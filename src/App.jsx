import React from 'react';
import './App.css';
import './Admin.css';
import AnalysisPage from './components/AnalysisPage';
import OverviewPage from './components/OverviewPage';
import Sidebar from './components/Sidebar';
import UsersPage from './components/UsersPage';

function App() {
  const [session, setSession] = React.useState(null);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loginPending, setLoginPending] = React.useState(false);
  const [actionPending, setActionPending] = React.useState(false);
  const [error, setError] = React.useState('');
  const [actionMessage, setActionMessage] = React.useState('');
  const [counter, setCounter] = React.useState(0);
  const [activePage, setActivePage] = React.useState('overview');
  const [teamUsers, setTeamUsers] = React.useState([]);
  const [stateResults, setStateResults] = React.useState([]);

  async function handleLogin(event) {
    event.preventDefault();
    setError('');
    setLoginPending(true);

    try {
      const loginResponse = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const loginData = await loginResponse.json();
      if (!loginResponse.ok) throw new Error(loginData.message || 'Não foi possível entrar.');

      const authHeaders = { Authorization: `Bearer ${loginData.token}` };
      const [profileResponse, usersResponse, statesResponse] = await Promise.all([
        fetch('/api/user/profile', { headers: authHeaders }),
        fetch('/api/admin/users', { headers: authHeaders }),
        fetch('/api/analysis/states', { headers: authHeaders }),
      ]);
      const [profileData, usersData, statesData] = await Promise.all([
        profileResponse.json(),
        usersResponse.json(),
        statesResponse.json(),
      ]);
      if (!profileResponse.ok) throw new Error(profileData.message || 'Não foi possível carregar seu perfil.');
      if (!usersResponse.ok) throw new Error(usersData.message || 'Não foi possível carregar a equipe.');
      if (!statesResponse.ok) throw new Error(statesData.message || 'Não foi possível carregar os dados.');

      setSession({ token: loginData.token, user: profileData.user });
      setTeamUsers(usersData.users);
      setStateResults(statesData.states);
      setActivePage('overview');
      setActionMessage('');
      setCounter(0);
    } catch (loginError) {
      setError(loginError.message || 'Não foi possível conectar à API. Tente novamente.');
    } finally {
      setLoginPending(false);
    }
  }

  async function handleAction() {
    setActionPending(true);
    setActionMessage('');
    setError('');

    try {
      const response = await fetch('/api/action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({ command: 'create-update' }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'A ação não pôde ser concluída.');
      setActionMessage(data.message);
    } catch (actionError) {
      setError(actionError.message || 'Não foi possível conectar à API. Tente novamente.');
    } finally {
      setActionPending(false);
    }
  }

  async function handleCreateUser(userInput) {
    const response = await fetch('/api/admin/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.token}`,
      },
      body: JSON.stringify(userInput),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Não foi possível cadastrar o usuário.');
    setTeamUsers((users) => [data.user, ...users]);
  }

  function handleLogout() {
    setSession(null);
    setEmail('');
    setPassword('');
    setError('');
    setActionMessage('');
    setActivePage('overview');
    setTeamUsers([]);
    setStateResults([]);
  }

  if (!session) {
    return (
      <main className="login-layout">
        <section className="login-story" aria-label="Apresentação do Ritmo">
          <a className="brand brand-light" href="/" aria-label="Ritmo, início">
            <span className="brand-mark" aria-hidden="true">r.</span>
            <span>ritmo</span>
          </a>
          <div className="story-copy">
            <p className="eyebrow">SEU ESPAÇO, SEU RITMO</p>
            <h1>Faça caber<br />o que importa.</h1>
            <p className="story-description">Um lugar simples para organizar o dia, tirar ideias do papel e seguir em frente.</p>
          </div>
          <div className="story-note">
            <span className="note-dot" aria-hidden="true" />
            <span>Seu próximo passo começa aqui.</span>
            <span className="note-number">01 / 03</span>
          </div>
          <div className="story-orbit orbit-one" aria-hidden="true" />
          <div className="story-orbit orbit-two" aria-hidden="true" />
        </section>

        <section className="login-panel">
          <div className="login-form-wrap">
            <p className="eyebrow form-eyebrow">BEM-VINDO DE VOLTA</p>
            <h2>Entre no seu espaço.</h2>
            <p className="form-intro">Use seu e-mail e senha para continuar.</p>
            <form className="login-form" onSubmit={handleLogin}>
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="voce@exemplo.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <div className="password-label-row">
                <label htmlFor="password">Senha</label>
                <span>ACESSO DE DEMONSTRAÇÃO</span>
              </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              {error && <p className="form-error" role="alert">{error}</p>}
              <button className="button button-primary login-submit" type="submit" disabled={loginPending}>
                {loginPending ? 'Entrando...' : 'Entrar'}
                {!loginPending && <span aria-hidden="true">↗</span>}
              </button>
            </form>
            <p className="login-footnote">Acesso demonstrativo. Qualquer e-mail e senha são aceitos.</p>
          </div>
          <div className="panel-footer"><span>RITMO / ESPAÇO PESSOAL</span><span>FEITO PARA IR MAIS LONGE</span></div>
        </section>
      </main>
    );
  }

  const firstName = session.user.name.split(' ')[0];
  return (
    <main className="console-layout">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        user={{ name: session.user.name, email: session.user.email, initial: firstName.slice(0, 1).toUpperCase(), count: teamUsers.length }}
      />
      <div className="console-main">
        <header className="console-header">
          <div><span className="breadcrumb-muted">Painel de dados</span><span className="breadcrumb-divider">/</span><strong>{activePage === 'overview' ? 'Visão geral' : activePage === 'users' ? 'Usuários' : 'Dados eleitorais'}</strong></div>
          <div className="header-actions"><span className="api-connection"><i /> API conectada</span><button className="console-logout" type="button" onClick={handleLogout} title="Encerrar sessão">Sair <span aria-hidden="true">↗</span></button></div>
        </header>
        <div className="console-content">
          {activePage === 'overview' && (
            <OverviewPage
              firstName={firstName}
              users={teamUsers}
              states={stateResults}
              onNavigate={setActivePage}
              onAction={handleAction}
              actionPending={actionPending}
              actionMessage={actionMessage}
              error={error}
              counter={counter}
              onCounterChange={setCounter}
            />
          )}
          {activePage === 'users' && <UsersPage users={teamUsers} onCreateUser={handleCreateUser} />}
          {activePage === 'analysis' && <AnalysisPage states={stateResults} />}
        </div>
      </div>
    </main>
  );
}

export default App;

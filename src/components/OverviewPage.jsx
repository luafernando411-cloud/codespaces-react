function number(value) {
  return new Intl.NumberFormat('pt-BR').format(value);
}

function OverviewPage({ firstName, users, states, onNavigate, onAction, actionPending, actionMessage, error, counter, onCounterChange }) {
  const selectedVotes = states.reduce((total, state) => total + state.validVotes, 0);
  const positiveStates = states.filter((state) => state.difference > 0).length;
  const activeUsers = users.filter((user) => user.status === 'Ativo').length;
  const leadingState = [...states].sort((first, second) => second.lulaPercent - first.lulaPercent)[0];

  return (
    <div className="page-stack">
      <section className="welcome-row">
        <div>
          <p className="section-eyebrow">SEGUNDA-FEIRA, 26 DE OUTUBRO DE 2026</p>
          <h1>Bom dia, <span>{firstName}.</span></h1>
          <p className="page-subtitle">Acompanhe os dados, a equipe e as referências do seu espaço.</p>
        </div>
        <button className="console-button button-dark" type="button" onClick={() => onNavigate('analysis')}>
          Explorar dados <span aria-hidden="true">↗</span>
        </button>
      </section>

      <section className="metric-grid" aria-label="Indicadores do painel">
        <article className="metric-panel"><div className="metric-heading"><span>VOTOS VÁLIDOS</span><span className="metric-symbol">↗</span></div><strong>{number(selectedVotes)}</strong><p>Recorte de 6 estados nas imagens</p></article>
        <article className="metric-panel"><div className="metric-heading"><span>ESTADOS NO RECORTE</span><span className="metric-symbol metric-blue">⌖</span></div><strong>{String(states.length).padStart(2, '0')}</strong><p>Dados transcritos das capturas</p></article>
        <article className="metric-panel"><div className="metric-heading"><span>USUÁRIOS ATIVOS</span><span className="metric-symbol metric-orange">◎</span></div><strong>{String(activeUsers).padStart(2, '0')}</strong><p>{users.length} pessoas na equipe demonstrativa</p></article>
        <article className="metric-panel"><div className="metric-heading"><span>VANTAGEM NO RECORTE</span><span className="metric-symbol metric-green">⌁</span></div><strong>{positiveStates} <small>de {states.length}</small></strong><p>Estados em que Lula aparece à frente</p></article>
      </section>

      <section className="overview-grid">
        <article className="content-panel state-overview">
          <div className="panel-heading">
            <div><p className="section-eyebrow">COMPARATIVO POR ESTADO</p><h2>Votos válidos</h2></div>
            <button className="text-button" type="button" onClick={() => onNavigate('analysis')}>Ver análise <span aria-hidden="true">→</span></button>
          </div>
          <div className="chart-legend"><span><i className="legend-lula" /> Lula</span><span><i className="legend-bolsonaro" /> Bolsonaro</span><span className="legend-unit">% DOS VOTOS VÁLIDOS</span></div>
          <div className="state-bars">
            {states.slice(0, 5).map((state) => (
              <div className="state-bar-row" key={state.abbreviation}>
                <span className="state-bar-name">{state.abbreviation}</span>
                <div className="state-bar-track" aria-label={`${state.state}: Lula ${state.lulaPercent}%, Bolsonaro ${state.bolsonaroPercent}%`}>
                  <span className="bar-lula" style={{ width: `${state.lulaPercent}%` }} />
                  <span className="bar-bolsonaro" style={{ width: `${state.bolsonaroPercent}%` }} />
                </div>
                <span className="state-bar-values">{state.lulaPercent.toFixed(1).replace('.', ',')} / {state.bolsonaroPercent.toFixed(1).replace('.', ',')}</span>
              </div>
            ))}
          </div>
          <div className="panel-footnote">Maior votação de Lula no recorte: <strong>{leadingState?.state}</strong></div>
        </article>

        <article className="content-panel team-overview">
          <div className="panel-heading">
            <div><p className="section-eyebrow">COLABORAÇÃO</p><h2>Equipe</h2></div>
            <button className="text-button" type="button" onClick={() => onNavigate('users')}>Ver equipe <span aria-hidden="true">→</span></button>
          </div>
          <div className="mini-user-list">
            {users.slice(0, 4).map((user, index) => (
              <div className="mini-user" key={user.id}>
                <span className={`user-avatar avatar-tone-${index % 4}`}>{user.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span>
                <span className="mini-user-copy"><strong>{user.name}</strong><small>{user.area}</small></span>
                <span className={`user-status status-${user.status.toLowerCase()}`}><i />{user.status}</span>
              </div>
            ))}
          </div>
          <button className="invite-inline" type="button" onClick={() => onNavigate('users')}><span aria-hidden="true">＋</span> Gerenciar usuários</button>
        </article>
      </section>

      <section className="quick-tools" aria-label="Ações rápidas">
        <article className="quick-tool-panel">
          <div><p className="section-eyebrow">INTEGRAÇÃO</p><h2>Teste a API</h2><p>Envie uma ação autenticada e veja o retorno do servidor.</p></div>
          <button className="console-button button-dark" type="button" onClick={onAction} disabled={actionPending}>{actionPending ? 'Enviando...' : 'Acionar a API'} <span aria-hidden="true">↗</span></button>
          {actionMessage && <p className="quick-tool-feedback" role="status">{actionMessage}</p>}
          {error && <p className="quick-tool-error" role="alert">{error}</p>}
        </article>
        <article className="quick-tool-panel counter-tool">
          <div><p className="section-eyebrow">CONTADOR LOCAL</p><h2>Ritmo de hoje</h2><p>Marque os pequenos avanços do seu dia.</p></div>
          <div className="quick-counter"><strong aria-live="polite">{String(counter).padStart(2, '0')}</strong><button type="button" onClick={() => onCounterChange((value) => value - 1)} aria-label="Diminuir contador">−</button><button type="button" onClick={() => onCounterChange((value) => value + 1)} aria-label="Aumentar contador">+</button></div>
        </article>
      </section>

      <div className="data-disclaimer"><span className="disclaimer-icon">i</span><p>Os valores eleitorais foram transcritos manualmente das imagens em <strong>img/</strong>. Confira os arquivos de origem antes de usar ou compartilhar os números.</p><button type="button" onClick={() => onNavigate('analysis')}>Ver fontes</button></div>
    </div>
  );
}

export default OverviewPage;
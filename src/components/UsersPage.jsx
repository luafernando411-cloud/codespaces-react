import React from 'react';

function UsersPage({ users, onCreateUser }) {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('Todos');
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [formError, setFormError] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({ name: '', email: '', role: 'Analista' });

  const filteredUsers = users.filter((user) => {
    const matchesSearch = `${user.name} ${user.email} ${user.area}`.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (statusFilter === 'Todos' || user.status === statusFilter);
  });

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      await onCreateUser(form);
      setForm({ name: '', email: '', role: 'Analista' });
      setDialogOpen(false);
    } catch (error) {
      setFormError(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page-stack">
      <section className="page-title-row">
        <div><p className="section-eyebrow">ACESSO E COLABORAÇÃO</p><h1>Usuários</h1><p className="page-subtitle">Gerencie quem pode consultar este painel demonstrativo.</p></div>
        <button className="console-button button-dark" type="button" onClick={() => setDialogOpen(true)}><span aria-hidden="true">＋</span> Adicionar usuário</button>
      </section>

      <section className="user-summary-row" aria-label="Resumo da equipe">
        <div><strong>{users.length}</strong><span>Total de usuários</span></div>
        <div><strong>{users.filter((user) => user.status === 'Ativo').length}</strong><span>Ativos</span></div>
        <div><strong>{users.filter((user) => user.status === 'Pendente').length}</strong><span>Convites pendentes</span></div>
        <p>Contas e informações desta tela são fictícias.</p>
      </section>

      <section className="content-panel users-panel">
        <div className="users-toolbar">
          <label className="search-control"><span aria-hidden="true">⌕</span><input type="search" placeholder="Buscar por nome, e-mail ou área" value={search} onChange={(event) => setSearch(event.target.value)} /></label>
          <label className="filter-control"><span>Status</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>Todos</option><option>Ativo</option><option>Pendente</option></select></label>
          <span className="result-count">{filteredUsers.length} resultados</span>
        </div>
        <div className="table-scroll">
          <table className="data-table user-table">
            <thead><tr><th>USUÁRIO</th><th>PERFIL</th><th>ÁREA</th><th>STATUS</th><th>ÚLTIMO ACESSO</th><th aria-label="Ações" /></tr></thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user.id}>
                  <td><div className="table-user"><span className={`user-avatar avatar-tone-${index % 4}`}>{user.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><span><strong>{user.name}</strong><small>{user.email}</small></span></div></td>
                  <td><span className="role-label">{user.role}</span></td>
                  <td>{user.area}</td>
                  <td><span className={`user-status status-${user.status.toLowerCase()}`}><i />{user.status}</span></td>
                  <td className="last-seen">{user.lastSeen}</td>
                  <td><button className="row-menu" type="button" aria-label={`Mais opções para ${user.name}`} title="Mais opções">···</button></td>
                </tr>
              ))}
              {filteredUsers.length === 0 && <tr><td className="empty-table" colSpan="6">Nenhum usuário encontrado com esses filtros.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      {dialogOpen && (
        <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setDialogOpen(false); }}>
          <section className="user-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
            <div className="dialog-heading"><div><p className="section-eyebrow">NOVA COLABORAÇÃO</p><h2 id="dialog-title">Adicionar usuário</h2></div><button className="dialog-close" type="button" aria-label="Fechar" onClick={() => setDialogOpen(false)}>×</button></div>
            <form className="user-form" onSubmit={handleSubmit}>
              <label htmlFor="new-user-name">Nome completo</label><input id="new-user-name" autoFocus required minLength="2" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Ex.: Marina Oliveira" />
              <label htmlFor="new-user-email">E-mail</label><input id="new-user-email" type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="marina@exemplo.com" />
              <label htmlFor="new-user-role">Perfil de acesso</label><select id="new-user-role" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}><option>Analista</option><option>Leitor</option><option>Administradora</option></select>
              {formError && <p className="form-error" role="alert">{formError}</p>}
              <p className="form-helper">O convite será criado como pendente. Os dados são mantidos apenas enquanto a API estiver ativa.</p>
              <div className="dialog-actions"><button className="button-muted" type="button" onClick={() => setDialogOpen(false)}>Cancelar</button><button className="console-button button-dark" type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Criar convite'}</button></div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default UsersPage;
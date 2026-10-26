const navigation = [
  { id: 'overview', icon: '▦', label: 'Visão geral' },
  { id: 'users', icon: '◎', label: 'Usuários' },
  { id: 'analysis', icon: '⌁', label: 'Dados eleitorais' },
];

function Sidebar({ activePage, onNavigate, user }) {
  return (
    <aside className="console-sidebar">
      <a className="console-brand" href="/" aria-label="Observa, início">
        <span className="console-brand-mark" aria-hidden="true">o</span>
        <span>observa<span className="brand-period">.</span></span>
      </a>

      <div className="sidebar-workspace">
        <span className="workspace-mark">D</span>
        <span><strong>Painel de dados</strong><small>Equipe demonstrativa</small></span>
        <span className="workspace-chevron" aria-hidden="true">⌄</span>
      </div>

      <p className="sidebar-label">ESPAÇO DE TRABALHO</p>
      <nav className="console-nav" aria-label="Navegação principal">
        {navigation.map((item) => (
          <button
            className={`console-nav-item${activePage === item.id ? ' is-active' : ''}`}
            key={item.id}
            type="button"
            aria-current={activePage === item.id ? 'page' : undefined}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav-icon" aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
            {item.id === 'users' && <span className="nav-count">{user.count}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-data-status"><span className="status-indicator" /> Dados de demonstração</div>
        <div className="sidebar-profile">
          <span className="profile-avatar">{user.initial}</span>
          <span className="profile-copy"><strong>{user.name}</strong><small>{user.email}</small></span>
          <span className="profile-menu" aria-hidden="true">···</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
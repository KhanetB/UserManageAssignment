import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Users, UserPlus, Search, RefreshCw, MoreHorizontal, Eye, Pencil, Trash2,
  Mail, Phone, ChevronLeft, ChevronRight, Database, ShieldCheck, CircleAlert
} from 'lucide-react';
import UserModal from './components/UserModal.jsx';
import { userApi } from './services/userApi.js';

const PAGE_SIZE = 8;

function initials(name = '') {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'U';
}

export default function App() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await userApi.list(search);
      setUsers(result.data || []);
    } catch (err) {
      setError(`${err.message} Check that the API is running and MySQL is configured.`);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timeout = setTimeout(loadUsers, 250);
    return () => clearTimeout(timeout);
  }, [loadUsers]);

  useEffect(() => { setPage(1); }, [search]);

  const totalPages = Math.max(1, Math.ceil(users.length / PAGE_SIZE));
  const visibleUsers = useMemo(
    () => users.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [users, page]
  );

  async function saveUser(form) {
    setBusy(true);
    setError('');
    try {
      if (modal.mode === 'create') {
        await userApi.create(form);
        setNotice('User created successfully.');
      } else {
        await userApi.update(modal.user.id, form);
        setNotice('User updated successfully.');
      }
      setModal(null);
      await loadUsers();
    } catch (err) {
      setError(err.message);
      if (err.errors) {
        setNotice(Object.values(err.errors).join(' '));
      }
    } finally {
      setBusy(false);
    }
  }

  async function deleteUser(user) {
    if (!window.confirm(`Delete ${user.name}? This action cannot be undone.`)) return;
    setBusy(true);
    setError('');
    try {
      await userApi.remove(user.id);
      setModal(null);
      setNotice('User deleted successfully.');
      await loadUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function openModal(mode, user = null) {
    setNotice('');
    setModal({ mode, user });
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#" aria-label="User Management home">
          <span className="brand-mark"><Users size={22} /></span>
          <span>People<span className="brand-light">Desk</span></span>
        </a>
        <p className="nav-label">WORKSPACE</p>
        <div className="nav-item nav-item-active"><Users size={18} /> User management</div>
        <div className="sidebar-bottom">
          <div className="sidebar-tip"><ShieldCheck size={18} /><div><strong>Simple & secure</strong><p>Organize your user records in one place.</p></div></div>
          <p className="sidebar-version">USER MANAGEMENT · V1.0</p>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">Workspace <span>/</span> <strong>Users</strong></div>
          <div className="topbar-user"><div className="avatar avatar-admin">A</div><div><strong>Administrator</strong><span>Workspace admin</span></div></div>
        </header>

        <section className="page-content">
          <div className="page-heading">
            <div><p className="eyebrow">DIRECTORY / OVERVIEW</p><h1>User management</h1><p className="subtitle">Manage your users, contact details, and records.</p></div>
            <button className="button button-primary" onClick={() => openModal('create')}><UserPlus size={17} /> Add user</button>
          </div>

          {notice && <div className="notice"><span>{notice}</span><button onClick={() => setNotice('')} aria-label="Dismiss message">×</button></div>}
          {error && <div className="error-banner"><CircleAlert size={18} /><span>{error}</span><button onClick={loadUsers} className="button button-quiet button-small">Retry</button></div>}

          <div className="stats-grid">
            <div className="stat-card"><div className="stat-icon stat-blue"><Users size={20} /></div><div><span>Total users</span><strong>{loading ? '—' : users.length}</strong><small>Matching records</small></div></div>
            <div className="stat-card"><div className="stat-icon stat-green"><Database size={20} /></div><div><span>Data source</span><strong>MySQL</strong><small>Connected through API</small></div></div>
            <div className="stat-card"><div className="stat-icon stat-violet"><ShieldCheck size={20} /></div><div><span>Available actions</span><strong>4</strong><small>Create · Read · Update · Delete</small></div></div>
          </div>

          <section className="table-card">
            <div className="table-card-header">
              <div><h2>All users <span className="count-pill">{users.length}</span></h2><p>Browse and manage user information</p></div>
              <button className="button button-quiet refresh-button" onClick={loadUsers} disabled={loading}><RefreshCw size={16} className={loading ? 'spin' : ''} /> Refresh</button>
            </div>
            <div className="table-toolbar">
              <div className="search-box"><Search size={17} /><input aria-label="Search users" placeholder="Search name, email, or phone..." value={search} onChange={(e) => setSearch(e.target.value)} /><kbd>⌕</kbd></div>
              <span className="table-hint">Showing {users.length ? (page - 1) * PAGE_SIZE + 1 : 0}–{Math.min(page * PAGE_SIZE, users.length)} of {users.length}</span>
            </div>
            <div className="table-scroll">
              <table>
                <thead><tr><th>USER</th><th>PHONE</th><th>EMAIL ADDRESS</th><th>USER ID</th><th className="align-right">ACTIONS</th></tr></thead>
                <tbody>
                  {loading ? <tr><td colSpan="5" className="empty-state">Loading users…</td></tr> :
                    visibleUsers.length === 0 ? <tr><td colSpan="5" className="empty-state">{error ? 'Could not load records.' : 'No users found. Try another search or add a user.'}</td></tr> :
                    visibleUsers.map((user, index) => (
                      <tr key={user.id}>
                        <td><button className="user-cell" onClick={() => openModal('detail', user)}><span className={`avatar avatar-${index % 5}`}>{initials(user.name)}</span><span className="user-name-wrap"><strong>{user.name}</strong><small>Registered user</small></span></button></td>
                        <td><span className="contact-cell"><Phone size={14} />{user.phone}</span></td>
                        <td><span className="contact-cell"><Mail size={14} />{user.email}</span></td>
                        <td><span className="id-badge">USR-{String(user.id).padStart(4, '0')}</span></td>
                        <td><div className="row-actions"><button title="View details" aria-label={`View ${user.name}`} onClick={() => openModal('detail', user)}><Eye size={16} /></button><button title="Edit user" aria-label={`Edit ${user.name}`} onClick={() => openModal('edit', user)}><Pencil size={16} /></button><button title="Delete user" aria-label={`Delete ${user.name}`} onClick={() => deleteUser(user)}><Trash2 size={16} /></button><button title="More details" aria-label={`More actions for ${user.name}`} onClick={() => openModal('detail', user)}><MoreHorizontal size={16} /></button></div></td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
            <footer className="table-footer">
              <span>Page <strong>{page}</strong> of <strong>{totalPages}</strong></span>
              <div className="pagination"><button aria-label="Previous page" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}><ChevronLeft size={17} /></button><span>{page}</span><button aria-label="Next page" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}><ChevronRight size={17} /></button></div>
            </footer>
          </section>
          <p className="page-footnote">PeopleDesk · User Management System <span>Built with React, Express & MySQL</span></p>
        </section>
      </main>

      {modal && <UserModal
        user={modal.user}
        mode={modal.mode}
        busy={busy}
        onClose={() => !busy && setModal(null)}
        onSave={saveUser}
        onEdit={(user) => setModal({ mode: 'edit', user })}
        onDelete={deleteUser}
      />}
    </div>
  );
}

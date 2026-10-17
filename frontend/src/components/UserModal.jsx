import { useEffect, useState } from 'react';
import { X, UserRound, Mail, Phone, CalendarDays, Pencil, Trash2 } from 'lucide-react';

const EMPTY_FORM = { firstname: '', lastname: '', phone: '', email: '' };

export default function UserModal({ user, mode, busy, onClose, onSave, onEdit, onDelete }) {
  const isForm = mode === 'create' || mode === 'edit';
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(user ? { firstname: user.firstname || '', lastname: user.lastname || '', phone: user.phone || '', email: user.email || '' } : EMPTY_FORM);
    setErrors({});
  }, [user, mode]);
   
  function change(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setErrors((current) => ({ ...current, [event.target.name]: '' }));
  }

  async function submit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!form.firstname.trim()) nextErrors.firstname = 'Please enter a first name.';
    if (!form.lastname.trim()) nextErrors.lastname = 'Please enter a last name.';
    if (!form.phone.trim()) nextErrors.phone = 'Please enter a phone number.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = 'Please enter a valid email.';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    await onSave({
      firstname: form.firstname.trim(),
      lastname: form.lastname.trim(),
      phone: form.phone.trim(),
      email: form.email.trim().toLowerCase()
    });
  }

  const title = mode === 'create' ? 'Add new user' : mode === 'edit' ? 'Edit user' : 'User details';

  return (
    <div className="modal-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget && !busy) onClose();
    }}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <header className="modal-header">
          <div>
            <p className="eyebrow">{mode === 'create' ? 'NEW RECORD' : user ? `USER ID · ${user.id}` : 'USER RECORD'}</p>
            <h2 id="modal-title">{title}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} disabled={busy} aria-label="Close dialog">
            <X size={20} />
          </button>
        </header>

        {isForm ? (
          <form onSubmit={submit} className="user-form">
            <label>
              First name
              <span className="input-wrap"><UserRound size={17} /><input name="firstname" value={form.firstname} onChange={change} maxLength={100} placeholder="e.g. Anan" autoFocus /></span>
              {errors.firstname && <small className="field-error">{errors.firstname}</small>}
            </label>
            <label>
              Last name
              <span className="input-wrap"><UserRound size={17} /><input name="lastname" value={form.lastname} onChange={change} maxLength={100} placeholder="e.g. Srisuk" /></span>
              {errors.lastname && <small className="field-error">{errors.lastname}</small>}
            </label>
            <label>
              Phone number
              <span className="input-wrap"><Phone size={17} /><input name="phone" value={form.phone} onChange={change} maxLength={20} placeholder="e.g. 0812345678" /></span>
              {errors.phone && <small className="field-error">{errors.phone}</small>}
            </label>
            <label>
              Email address
              <span className="input-wrap"><Mail size={17} /><input name="email" type="email" value={form.email} onChange={change} maxLength={150} placeholder="name@example.com" /></span>
              {errors.email && <small className="field-error">{errors.email}</small>}
            </label>
            <footer className="modal-actions">
              <button className="button button-quiet" type="button" onClick={onClose} disabled={busy}>Cancel</button>
              <button className="button button-primary" type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save user'}</button>
            </footer>
          </form>
        ) : (
          <>
            <div className="profile-block">
              <div className="avatar avatar-large">{user?.firstname?.charAt(0)?.toUpperCase() || 'U'}</div>
              <div><h3>{user?.firstname} {user?.lastname}</h3><p className="muted">User #{user?.id}</p></div>
            </div>
            <div className="detail-list">
              <div><span><Mail size={17} /> Email</span><strong>{user?.email}</strong></div>
              <div><span><Phone size={17} /> Phone</span><strong>{user?.phone}</strong></div>
              <div><span><CalendarDays size={17} /> Created</span><strong>{user?.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}</strong></div>
            </div>
            <footer className="modal-actions modal-actions-between">
              <button className="button button-danger-outline" type="button" onClick={() => onDelete(user)}><Trash2 size={16} /> Delete</button>
              <div className="action-group">
                <button className="button button-quiet" type="button" onClick={onClose}>Close</button>
                <button className="button button-primary" type="button" onClick={() => onEdit(user)}><Pencil size={16} /> Edit</button>
              </div>
            </footer>
          </>
        )}
      </section>
    </div>
  );
}

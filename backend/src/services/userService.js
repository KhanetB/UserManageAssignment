import { pool } from '../config/database.js';

const USER_FIELDS = 'id, name, phone, email, created_at, updated_at';

export async function getAllUsers(search = '') {
  const term = `%${search.trim()}%`;
  const [rows] = await pool.execute(
    `SELECT ${USER_FIELDS} FROM users
     WHERE name LIKE ? OR email LIKE ? OR phone LIKE ?
     ORDER BY id DESC`,
    [term, term, term]
  );
  return rows;
}

export async function getUserById(id) {
  const [rows] = await pool.execute(
    `SELECT ${USER_FIELDS} FROM users WHERE id = ?`,
    [id]
  );
  return rows[0] || null;
}

export async function createUser({ name, phone, email }) {
  const [result] = await pool.execute(
    'INSERT INTO users (name, phone, email) VALUES (?, ?, ?)',
    [name, phone, email]
  );
  return getUserById(result.insertId);
}

export async function updateUser(id, { name, phone, email }) {
  const [result] = await pool.execute(
    'UPDATE users SET name = ?, phone = ?, email = ? WHERE id = ?',
    [name, phone, email, id]
  );

  if (result.affectedRows === 0) return null;
  return getUserById(id);
}

export async function deleteUser(id) {
  const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

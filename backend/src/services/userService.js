import { pool } from '../config/database.js';

const USER_FIELDS = 'id, name, phone, email, created_at, updated_at';

export async function getAllUsers(search = '') {
  const term = `%${search.trim()}%`;
  const [rows] = await pool.execute(
    `SELECT ${USER_FIELDS} FROM users
     WHERE firstname LIKE ? OR lastname LIKE ? OR email LIKE ? OR phone LIKE ?
     ORDER BY id DESC`,
    [term, term, term, term]
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

export async function createUser({ firstname, lastname, phone, email }) {
  const [result] = await pool.execute(
    'INSERT INTO users (firstname, lastname, phone, email) VALUES (?, ?, ?, ?)',
    [firstname, lastname, phone, email]
  );
  return getUserById(result.insertId);
}

export async function updateUser(id, { firstname, lastname, phone, email }) {
  const [result] = await pool.execute(
    'UPDATE users SET firstname = ?, lastname = ?, phone = ?, email = ? WHERE id = ?',
    [firstname, lastname, phone, email, id]
  );

  if (result.affectedRows === 0) return null;
  return getUserById(id);
}

export async function deleteUser(id) {
  const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

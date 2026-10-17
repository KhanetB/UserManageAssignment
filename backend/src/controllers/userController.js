import * as userService from '../services/userService.js';

function handleDatabaseError(error, res) {
  if (error.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      message: 'That email address is already in use.',
      errors: { email: 'Email must be unique.' }
    });
  }
  console.error(error);
  return res.status(500).json({ message: 'An unexpected server error occurred.' });
}

export async function listUsers(req, res) {
  try {
    const users = await userService.getAllUsers(req.query.search || '');
    res.json({ data: users });
  } catch (error) {
    handleDatabaseError(error, res);
  }
}

export async function getUser(req, res) {
  try {
    const user = await userService.getUserById(Number(req.params.id));
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ data: user });
  } catch (error) {
    handleDatabaseError(error, res);
  }
}

export async function createUser(req, res) {
  try {
    const user = await userService.createUser(req.validatedUser);
    res.status(201).json({ message: 'User created successfully.', data: user });
  } catch (error) {
    handleDatabaseError(error, res);
  }
}

export async function updateUser(req, res) {
  try {
    const user = await userService.updateUser(Number(req.params.id), req.validatedUser);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ message: 'User updated successfully.', data: user });
  } catch (error) {
    handleDatabaseError(error, res);
  }
}

export async function deleteUser(req, res) {
  try {
    const deleted = await userService.deleteUser(Number(req.params.id));
    if (!deleted) return res.status(404).json({ message: 'User not found.' });
    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    handleDatabaseError(error, res);
  }
}

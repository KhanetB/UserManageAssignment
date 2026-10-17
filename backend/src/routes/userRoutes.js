import { Router } from 'express';
import {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/userController.js';
import { validateUser } from '../middleware/validateUser.js';

const router = Router();

router.get('/', listUsers);
router.get('/:id', getUser);
router.post('/', validateUser, createUser);
router.put('/:id', validateUser, updateUser);
router.delete('/:id', deleteUser);

export default router;

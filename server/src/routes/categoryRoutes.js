import { Router } from 'express';
import {
  getCategories, getCategory, getCategoryById,
  createCategory, updateCategory, deleteCategory,
} from '../controllers/categoryController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

router.route('/').get(getCategories).post(protect, adminOnly, createCategory);
router.get('/id/:id', protect, adminOnly, getCategoryById);
router.route('/:id').put(protect, adminOnly, updateCategory).delete(protect, adminOnly, deleteCategory);
router.get('/:slug', getCategory);

export default router;

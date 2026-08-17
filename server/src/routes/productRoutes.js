import { Router } from 'express';
import {
  getProducts, getProduct, getRelated, getTrending, getBrands,
  createProduct, updateProduct, deleteProduct,
} from '../controllers/productController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

router.route('/').get(getProducts).post(protect, adminOnly, createProduct);
router.get('/trending', getTrending);
router.get('/brands', getBrands);
router.get('/:idOrSlug', getProduct);
router.get('/:idOrSlug/related', getRelated);
router.route('/:id').put(protect, adminOnly, updateProduct).delete(protect, adminOnly, deleteProduct);

export default router;

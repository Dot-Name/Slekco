import { Router } from 'express';
import { getStats, getAdminProducts, uploadImages } from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

// Everything below this line requires a signed-in admin.
router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/products', getAdminProducts);
router.post('/uploads', upload.array('images', 6), uploadImages);

export default router;

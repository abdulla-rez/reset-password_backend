import { Router } from 'express';
import {
  signup,
  login,
  requestPasswordReset,
  resetPassword,
} from '../controllers/authController';
import { validateRequest } from '../middlewares/validateRequest';

const router = Router();

router.post('/signup', validateRequest, signup);
router.post('/login', validateRequest, login);
router.post('/request-reset', validateRequest, requestPasswordReset);
router.post('/reset-password/:token', validateRequest, resetPassword);

export default router;

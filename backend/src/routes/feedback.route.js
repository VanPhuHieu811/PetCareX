import express from 'express';
import feedbackController from '../controllers/feedback.controller.js';

const router = express.Router();

// Khớp với yêu cầu POST /api/feedback trong ảnh của bạn
router.post('/', feedbackController.postFeedback);

export default router;
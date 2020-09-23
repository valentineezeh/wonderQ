import express from 'express';
import MessageController from '../controller/index';
import { validateMessageInput, validateCheckMessageInput } from '../middleware/validations';

// set up router
const router = express.Router();

// application endpoints

// This endpoint pushes the message into the queue
router.post('/push-message', validateMessageInput, MessageController.postMessage);
// This endpoint consumes the message in the queue
router.get('/messages', MessageController.getMessage);
// This endpoint check if the message has been consume and deletes the message before it is set back to it initial state
router.post('/check-message', validateCheckMessageInput, MessageController.checkMessage);

export default router;

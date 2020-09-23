import express from 'express';
import MessageController from '../controller/index';
import { validateMessageInput, validateLoginInput } from '../middleware/validations';
import verifyUserToken from '../middleware/verifyUser';

// set up router
const router = express.Router();

// application endpoints

// This endpoint pushes the message into the queue
router.post('/push-message', verifyUserToken, validateMessageInput, MessageController.postMessage);
// This endpoint consumes the message in the queue
router.get('/messages', MessageController.getMessage);

router.post('/login-producer', validateLoginInput, MessageController.loginProducer);

export default router;

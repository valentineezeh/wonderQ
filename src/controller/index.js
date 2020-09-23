/* eslint-disable no-restricted-syntax */
import { v4 as uuidv4 } from 'uuid';

// initialize a db
const db = {};
const newObj = {};

// resetDbMethod this method id called in the cron job to reset the processState back to false after a duration of time
export const resetDbMethod = () => {
  for (const i of Object.keys(newObj)) {
    if (newObj[i].timeFetch < new Date()) {
      const value = newObj[i];
      newObj[i] = { ...value, processState: false }
    }
  }
};

/**
 * @description message controller class
 * @class MessageController
 */
class MessagesController {
  /**
     * @description post a message to the queue
     * @param {Object} req - Http Request object
     * @param {Object} res - Http Request object
     * @returns {Object} returns a payload of success response
     */
  static async postMessage(req, res) {
    try {
      // get message from the user
      const { message } = req.body;
      // generate unique id
      const generateID = uuidv4();
      // store message and the generated id in the db object as the id as the key
      db[generateID] = {
        processState: false,
        message
      };
      // if everything goes right create a message and return the new generated id
      return res.status(200).json({
        message: 'This is your message ID',
        data: generateID
      });
    } catch (error) {
      // catch every error incase something goes wrong
      return res.status(500).json({
        message: 'Internal server error.'
      });
    }
  }

  /**
     * @description post a message to the queue
     * @param {Object} req - Http Request object
     * @param {Object} res - Http Request object
     * @returns {Object} returns list of delivery rep
     */
  static async getMessage(req, res) {
    try {
      let newMessage;
      let messageId;
      // check if db is empty and return appropriate response
      if (Object.keys(db).length === 0) {
        return res.status(404).json({
          message: 'You are yet to push a message',
          data: db
        });
      }

      // loop through the db and consume the first message in the db
      for (const i of Object.keys(db)) {
        if (!db[i].processState) {
          const value = db[i];
          newObj[i] = { ...value, processState: true, timeFetch: new Date() };
          newMessage = value.message;
          messageId = i;
          break;
        }
      }
      // if all messages are currently been processed return this message
      if (Object.keys(newObj).length === 0) {
        return res.status(404).json({
          message: 'All messages are currently been consumed'
        });
      }
      // If everything goes on well and a message has been successfully been consumed by a user send the message id and message
      res.status(200).json({
        id: messageId,
        message: 'Success',
        data: newMessage
      });
    } catch (error) {
      // catch every error incase something goes wrong
      return res.status(500).json({
        message: 'Internal server error.'
      });
    }
  }

  /**
     * @description post a message to the queue
     * @param {Object} req - Http Request object
     * @param {Object} res - Http Request object
     * @returns {Object} returns list of delivery rep
     */
  static async checkMessage(req, res) {
    try {
      // Get message from the user
      const { messageId } = req.body;
      let lookUpId = false;
      // loop through the db to match the message with the corresponding id that have been consume then delete that message from the queue.
      for (const i of Object.keys(db)) {
        if (i === messageId && db[i].processState) {
          lookUpId = true;
          delete db[i];
        }
      }

      // check if message id is not found in the db and return this not found message
      if (!lookUpId) {
        return res.status(404).json({
          message: 'Message not found'
        });
      }

      // if message id exist and message has successfully been consumed delete the message from the queue and return a success message
      return res.status(200).json({
        message: 'Success!'
      });
    } catch (error) {
      // catch every error incase something goes wrong
      return res.status(500).json({
        message: 'Internal server error.'
      });
    }
  }
}


export default MessagesController;

/* eslint-disable no-restricted-syntax */
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { db, authdb } from '../db';

dotenv.config();

let viewData = {};

// resetDbMethod this method id called in the cron job to reset the processState back to false after a duration of time
export const resetDbMethod = () => {
  for (const i of Object.keys(viewData)) {
    if (viewData[i].processState) {
      const value = viewData[i];
      viewData[i] = { ...value, processState: false };
    }
  }
};

/**
 * @description message controller class
 * @class MessageController
 */
class MessagesController {
  /**
     * @description validate a producer login details
     * @param {Object} req - Http Request object
     * @param {Object} res - Http Request object
     * @returns {Object} returns a payload of token
     */
  static async loginProducer(req, res) {
    try {
      const { email, password } = req.body;
      if (email !== authdb.email && password !== authdb.password) {
        return res.status(400).json({
          message: 'Invalid credentials'
        });
      }

      const token = jwt.sign({ email, userType: 'producer' }, process.env.secret);
      return res.status(200).json({
        message: 'Success! you are now logged in.',
        data: token
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Internal server error.'
      });
    }
  }

  /**
     * @description post a message to the queue
     * @param {Object} req - Http Request object
     * @param {Object} res - Http Request object
     * @returns {Object} returns a payload of success response
     */
  static async postMessage(req, res) {
    try {
      // Get userType using the token
      const { userType } = req.userData;

      // get message from the user
      const { message } = req.body;

      // Check if user is a producer then allow access
      if (userType !== 'producer') {
        return res.status(400).json({
          message: 'Only a producer can push a message to wonderQ'
        });
      }
    
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
          viewData[i] = {
            ...value, processState: true,
          };
          db[i] = { ...value, processState: true };
        } else {
          viewData = {};
          // this delete the each message that has been processed
          delete db[i];
        }
      }

      // if all messages are currently been processed return this message
      if (Object.keys(viewData).length === 0) {
        return res.status(200).json({
          message: 'All messages are currently been consumed',
          data: {}
        });
      }

      // If everything goes on well and a message has been successfully been consumed by a user send the message id and message
      return res.status(200).json({
        message: 'Success',
        data: viewData
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

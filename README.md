# wonderQ
WonderQ is a broker that allows producers to write to it, and consumers to read from it. It runs on a single server. Whenever a producer writes to WonderQ, a message ID is generated and returned as confirmation. Whenever a consumer polls WonderQ for new messages, it can get those messages. These messages should NOT be available for processing by any other consumer that may be concurrently accessing WonderQ.

# Technologies Used
- Backend: Node/Express
- Libaries: Es6, Babel-CLI, eslint, chai, uuid, nodemon, express

# Features
- Send message to wonder queue
- Get a message from the queue and process that message
- Consume a message from the queue and delete that message using the message id.


## API Endpoints

| Endpoint                                             | Functionality                      |
| ---------------------------------------------------- | ---------------------------------- |
| POST /api/push-message                               | Push a message to the queue        |
| GET /api/messages                                    | Get a message from the queue       |
| POST /api/check-message                              | Consume a message and delete it    |  

[WONDERQ API Documentation]('./wonderQ.postman_collection.json)

# To Install
- Download or clone
- Open terminal inside the root directory of clone folder
- Type `npm install` to install all dependencies
- `npm run start` to run the app
- npm run `start:dev` to run development environment
- `npm test` to run the test suits on the app

##
API Endpoint: https://turing-ecommerce-backend.herokuapp.com

## AUTHOR
[Valentine Ezeh](https://github.com/valentineezeh/turing-backend)
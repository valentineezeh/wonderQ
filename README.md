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
| POST /api/push-message (Authorization: token)        | Push a message to the queue        |
| GET /api/messages                                    | Get a message from the queue       |
| POST /api/login-producer                             | login a producer                   |  

[WONDERQ API Documentation]('./wonderQ.postman_collection.json)

# To Install
- Download or clone repo
- Open terminal inside the root directory of clone folder
- Type `npm install` to install all dependencies
- Add secret and password to the .env for a simple user authentication
- `npm run start` to run the app
- npm run `start:dev` to run development environment
- `npm test` to run the test suits on the app
- To push a message to the wonderQ broker a producer will have to login using this default login detail { email: 'producer@mail.com', password: 'password'}
- After successful login by the producer, the token should be pass in the header as authorization in the push message endpoint

# Things to do to scale the system on production
- Using a queuing system will help scale this application to accommodate high volume of data examples of such queuing systems are rabbit MQ, amazon MQ, IBM MQ and so on.
- And for persisting data using redis will go a long way in accommodating high volume data processing.

## AUTHOR
[Valentine Ezeh](https://github.com/valentineezeh/wonderQ)
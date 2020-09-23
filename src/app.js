import express from 'express';
import bodyParser from 'body-parser';
import cron from 'node-cron';
import router from './routes';
import { resetDbMethod  } from './controller';

// fire express
const app = express();

const appName = 'wonderQ';

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: true }));


// test route to make sure everything is working (accessed at GET http://localhost:5000/api)
app.get('/', (req, res) => {
  res.status(200).json({
    message: `Welcome to ${appName}!`
  });
});


// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// when route does not exist return not found
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// initialize cron job
cron.schedule('*/1 * * * *', () => {
  resetDbMethod();
  console.log('see me here oooo')
});


// port destination
const port = process.env.PORT || 5000; 

// Listen on port and run the server 
app.listen(port, () => {
  console.log(`${appName} is listening on port: ${port}`);
});

export default app;

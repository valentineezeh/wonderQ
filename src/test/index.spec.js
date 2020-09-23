import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

const { expect } = chai;
chai.use(chaiHttp);

const messagePayload = { message: '' };
let generatedId;

describe('Store data in the db', () => {
  before((done) => {
    chai.request(app)
      .post('/api/push-message')
      .set('Content-Type', 'application/json')
      .send({ ...messagePayload, message: 'initial commit' })
      .end((err, res) => {
        if (err) return done(err);
        generatedId = res.body.data;
        done();
      });
  });
  describe('wonderQ Tests', () => {
    it('should give the welcome address', (done) => {
      chai.request(app)
        .get('/')
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          if (err) return done(err);
          expect(res.statusCode).equal(200);
          expect(res.body).have.property('message');
          expect(res.body.message).equal('Welcome to wonderQ!');
          done();
        });
    });
    it('throw an error when a wrong route is inputted', (done) => {
      chai.request(app)
        .get('/wrong-endpoint')
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          if (err) return done(err);
          expect(res.statusCode).equal(404);
          done();
        });
    });
    it('should throw an error when db is empty', (done) => {
      chai.request(app)
        .get('/api/messages')
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          if (err) return done(err);
          expect(res.statusCode).equal(404);
          expect(res.body).have.property('data');
          expect(res.body.message).equal('You are yet to push a message');
          done();
        });
    });
    it('should throw an error when no message is inputted', (done) => {
      chai.request(app)
        .post('/api/push-message')
        .send(messagePayload)
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          if (err) return done(err);
          expect(res.statusCode).equal(400);
          expect(res.body).have.property('message');
          expect(res.body.message).equal('You are yet to input a message');
          done();
        });
    });
    it('should return a message id when a message is sent', (done) => {
      chai.request(app)
        .post('/api/push-message')
        .send({ ...messagePayload, message: 'first message' })
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          if (err) return done(err);
          expect(res.statusCode).equal(200);
          expect(res.body).have.property('data');
          expect(res.body.message).equal('This is your message ID');
          done();
        });
    });
    it('should get a message that is yet to be consumed', (done) => {
      chai.request(app)
        .get('/api/messages')
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          if (err) return done(err);
          expect(res.statusCode).equal(200);
          expect(res.body).have.property('id');
          expect(res.body).have.property('data');
          expect(res.body.message).equal('Success');
          done();
        });
    });
    it('should check if a message has been successfully process or consumed and deletes it', (done) => {
      chai.request(app)
        .post('/api/check-message')
        .send({ ...messagePayload, messageId: '' })
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          if (err) return done(err);
          expect(res.statusCode).equal(400);
          expect(res.body).have.property('message');
          expect(res.body.message).equal('You are yet to input a message id');
          done();
        });
    });
    it('should check a message in the queue if it has been process', (done) => {
      chai.request(app)
        .post('/api/check-message')
        .send({ messageId: generatedId })
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          console.log('generatedId', generatedId);
          if (err) return done(err);
          expect(res.statusCode).equal(200);
        });
    });
  });
});

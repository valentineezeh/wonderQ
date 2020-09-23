import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

const { expect } = chai;
chai.use(chaiHttp);

const messagePayload = { message: '' };
let token;

describe('Store data in the db', () => {
  before((done) => {
    chai.request(app)
      .post('/api/login-producer')
      .set('Content-Type', 'application/json')
      .send({ email: 'producer@mail.com', password: 'password' })
      .end((err, res) => {
        if (err) return done(err);
        token = res.body.data;
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
        .set('authorization', token)
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
        .set('authorization', token)
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
          expect(res.body).have.property('data');
          expect(res.body.message).equal('Success');
          done();
        });
    });
  });
});

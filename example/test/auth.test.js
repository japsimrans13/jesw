const chai = require('chai');
  const chaiHttp = require('chai-http');
  const app = require('../app');
  const User = require('../models/userModel');
  const expect = chai.expect;
  
  chai.use(chaiHttp);
  
  describe('Authentication', () => {
    describe('POST /api/register', () => {
      it('should register a new user', (done) => {
        chai.request(app)
          .post('/api/register')
          .send({ email: 'testuser1', password: 'testpass' })
          .end((err, res) => {
            expect(res).to.have.status(201);
            // Add more assertions as needed
            done();
          });
      });
    });
  
    // Add more tests as needed
  
    // Hook to run after each test in this block
    afterEach((done) => {
      // Delete the user created during the test
      User.deleteOne({ email: 'testuser1' })
        .then(() => done())
        .catch(err => done(err));
    });
  });
  
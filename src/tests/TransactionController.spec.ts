import '../index';
import 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
chai.use(chaiHttp);
const expect = chai.expect;

const PORT = process.env.PORT && parseInt(process.env.PORT, 10) || 5000;
const API = `http://localhost:${PORT}`;


describe('/transaction API endpoints', () => {
  it('GET /transaction without transactionId queryparam', async () => {
    return chai.request(API).get('/api/transactions?confidenceLevel=0')
      .then(response => {
        expect(response).to.have.status(400);
        expect(response).to.be.a('object');
        expect(response.body.status).to.eql('error');
        expect(response.body.message).to.eql('transactionId is required query parameter');
      });
  });

  it('GET /transaction without confidenceLevel queryparam', async () => {
    return chai.request(API).get('/api/transactions?transactionId=xxxxxxxxxxxx')
      .then(response => {
        expect(response).to.have.status(400);
        expect(response).to.be.a('object');
        expect(response.body.status).to.eql('error');
        expect(response.body.message).to.eql('confidenceLevel is required query parameter');
      });
  });

  it('GET /transaction with multiple transactionId queryparams', async () => {
    return chai.request(API).get('/api/transactions?transactionId=xxxxxxxxxxxx&transactionId=yyyyyyyyyy&confidenceLevel=0')
      .then(response => {
        expect(response).to.have.status(400);
        expect(response).to.be.a('object');
        expect(response.body.status).to.eql('error');
        expect(response.body.message).to.eql('Multiple transactionId are found in query parameters');
      });
  });

  it('GET /transaction with multiple confidenceLevel queryparams', async () => {
    return chai.request(API).get('/api/transactions?transactionId=xxxxxxxxxxxx&confidenceLevel=1&confidenceLevel=0')
      .then(response => {
        expect(response).to.have.status(400);
        expect(response).to.be.a('object');
        expect(response.body.status).to.eql('error');
        expect(response.body.message).to.eql('Multiple confidenceLevel are found in query parameters');
      });
  });

  it('GET /transaction with transactionId and confidenceLevel queryparams', async () => {
    return chai.request(API).get('/api/transactions?transactionId=xxxxxxxxxxxx&confidenceLevel=0')
      .then(response => {
        expect(response).to.have.status(200);
        expect(response).to.be.a('object');
      });
  });
});
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

  it('GET /transaction with invalid(string) confidenceLevel queryparams', async () => {
    return chai.request(API).get('/api/transactions?transactionId=xxxxxxxxxxxx&confidenceLevel=test')
      .then(response => {
        expect(response).to.have.status(400);
        expect(response).to.be.a('object');
        expect(response.body.status).to.eql('error');
        expect(response.body.message).to.eql('confidenceLevel must be a number');
      });
  });

  it('GET /transaction with valid transactionId and confidenceLevel queryparams', async () => {
    return chai.request(API).get('/api/transactions?transactionId=xxxxxxxxxxxx&confidenceLevel=0')
      .then(response => {
        expect(response).to.have.status(200);
        expect(response.body).to.be.instanceof(Array);
        expect(response.body).to.eql([]);
      });
  });

  it('GET /transaction with single transaction response', async () => {
    return chai.request(API).get('/api/transactions?transactionId=5c868b9be2cabfda9cfc0569&confidenceLevel=1')
      .then(response => {
        expect(response).to.have.status(200);
        expect(response.body).to.be.instanceof(Array);
        expect(response.body).to.have.lengthOf(1);
        expect(response.body[0]).to.not.have.property("connectionInfo");
        expect(response.body[0]).to.not.have.property("combinedConnectionInfo");
      });
  });

  it('GET /transaction with multiple transaction response', async () => {
    return chai.request(API).get('/api/transactions?transactionId=5c868b9b89b9aadcd89bef44&confidenceLevel=1')
      .then(response => {
        expect(response).to.have.status(200);
        expect(response.body).to.be.instanceof(Array);
        expect(response.body).to.have.lengthOf(2);
        expect(response.body[0]).to.not.have.property("connectionInfo");
        expect(response.body[0]).to.not.have.property("combinedConnectionInfo");
        expect(response.body[1]).to.have.property("connectionInfo");
        expect(response.body[1]).to.have.property("combinedConnectionInfo");
      });
  });
});
import chai from 'chai';
import chaiHttp from 'chai-http'
import app from '../index.js';

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("Users", () => {
    describe("GET /", () => {
        // Test to get all Users record
        it("should get healthcheck page", (done) => {
            chai.request(app)
                .get('/')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.text.should.eql("Hello World from matching-service")
                    done();
                });
        });
    });
});
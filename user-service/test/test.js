import chai from 'chai';
import chaiHttp from 'chai-http'
import app from '../index.js';

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("Users", () => {
    describe("GET /", () => {
        // Test to get all Users record
        it("should get all users record", (done) => {
            chai.request(app)
                .get('/')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });

    describe("POST /api/user", () => {
        // Test to add user record
        it("should add user record", (done) => {
            const data = {
                username: "kums",
                password: "lalala"
            };
            chai.request(app)
                .post('/api/user/')
                .send(data)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    done();
                });
        });
        // Test to add user record
        it("should not add user record with existing id", (done) => {
            const data = {
                username: "kums",
                password: "lalala",
            };
            chai.request(app)
                .post('/api/user/')
                .send(data)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });
});
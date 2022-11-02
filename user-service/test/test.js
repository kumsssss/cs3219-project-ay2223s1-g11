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
                    res.text.should.eql("Hello World from user-service")
                    done();
                });
        });
    });
});
    // describe("POST /api/user", () => {
    //     // Test to add user record
    //     it("should add user record", (done) => {
    //         const data = {
    //             username: "kums",
    //             password: "lalala"
    //         };
    //         chai.request(app)
    //             .post('/api/user/')
    //             .send(data)
    //             .end((err, res) => {
    //                 res.should.have.status(201);
    //                 res.body.should.be.a('object');
    //                 done();
    //             });
    //     });
    //     // Test to add user record
    //     it("should not add user record with existing id", (done) => {
    //         const data = {
    //             username: "kums",
    //             password: "lalala",
    //         };
    //         chai.request(app)
    //             .post('/api/user/')
    //             .send(data)
    //             .end((err, res) => {
    //                 res.should.have.status(400);
    //                 res.body.should.be.a('object');
    //                 done();
    //             });
    //     });
    // });

    // let token = undefined;
    // describe("POST /api/user/login", () => {
    //     // Test to add user record
    //     it("should allow login", (done) => {
    //         const data = {
    //             username: "kums",
    //             password: "lalala"
    //         };
    //         chai.request(app)
    //             .post('/api/user/login')
    //             .send(data)
    //             .end((err, res) => {
    //                 res.should.have.status(200);
    //                 res.body.should.be.a('object');
    //                 token = res.body.token;
    //                 console.log(token);
    //                 done();
    //             });
    //     });
    // });
    // describe("POST /api/user/delete", () => {
    //     // Test to add user record
    //     it("should allow delete", (done) => {
    //         const data = {
    //             username: "kums"
    //         };
    //         console.log(token);
    //         chai.request(app)
    //             .post('/api/user/delete')
    //             .set('Authorization', 'JWT ' + token)
    //             .send(data)
    //             .end((err, res) => {
    //                 console.log(res.body.message);
    //                 res.should.have.status(200);
    //                 res.body.should.be.a('object');
    //                 token = res.body.token;
    //                 done();
    //             });
    //     });
    // });

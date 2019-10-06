var expect = require("chai").expect;
var index = require("../index");
var assert = require("assert");
var supertest = require("supertest");
var should = require("should");
var server = supertest.agent("http://localhost:3001");

var request = require("request");

describe("Cancel orders status by owner", function () {
    it("Cancel orders status by owner", function (done) {
        server
            .post("/itemsByRestaurant")
            .send({ restId: 2 })
            .expect(200)
            .end(function (err, res) {
                res.status.should.equal(200);
                done();
            });
    });
});

// describe("Delivered orders status by owner", function () {
//     it("Delivered orders status by owner", function (done) {
//         server
//             .post("/deliveredOrder")
//             .send({ orderId: 2 })
//             .expect(200)
//             .end(function (err, res) {
//                 res.status.should.equal(404);
//                 done();
//             });
//     });
// });

// describe("Delete item by owner", function () {
//     it("Delete item by owner", function (done) {
//         server
//             .post("/deleteitem")
//             .send({ orderId: 2 })
//             .expect(200)
//             .end(function (err, res) {
//                 res.status.should.equal(404);
//                 done();
//             });
//     });
// });

// describe("View item by owner", function () {
//     it("View item by owner", function (done) {
//         server
//             .post("/viewitem")
//             .send({ orderId: 2 })
//             .expect(200)
//             .end(function (err, res) {
//                 res.status.should.equal(404);
//                 done();
//             });
//     });
// });

// describe("Manage orders by owner", function () {
//     it("Manage orders by owner", function (done) {
//         server
//             .post("/manageOrders")
//             .send({ orderStatus: "preparing", orderId: 2 })
//             .expect(200)
//             .end(function (err, res) {
//                 res.status.should.equal(404);
//                 done();
//             });
//     });
// }) 
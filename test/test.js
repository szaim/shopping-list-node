var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../shopping_list_server.js');

var should = chai.should();
var app = server.app;
var storage = server.storage;

chai.use(chaiHttp);

describe('Shopping List', function() {

    it('should list items on GET', function(done) {
        chai.request(app)
            .get('/items')
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.have.length(3);
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('id');
                res.body[0].should.have.property('name');
                res.body[0].id.should.be.a('number');
                res.body[0].name.should.be.a('string');
                res.body[0].name.should.equal('Broad beans');
                res.body[1].name.should.equal('Tomatoes');
                res.body[2].name.should.equal('Peppers');
                done();
        
            });
    });
    it('should add an item on POST', function(done) {
        chai.request(app)
            .post('/items')
            //use send() to new data to object for testing.
            .send({'name': 'Kale'})
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('id');
                res.body.name.should.be.a('string');
                res.body.id.should.be.a('number');
                res.body.name.should.equal('Kale');
                storage.items.should.be.a('array');
                storage.items.should.have.length(4);
                storage.items[3].should.be.a('object');
                storage.items[3].should.have.property('id');
                storage.items[3].should.have.property('name');
                storage.items[3].id.should.be.a('number');
                storage.items[3].name.should.be.a('string');
                storage.items[3].name.should.equal('Kale');
                done();
            });
    });
    it('should edit an item on put', function(done) {
      chai.request(app)
     
            .put('/items/0')
            .send({'name': 'potatoes'})
            .end(function (err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                storage.items[0].should.be.a('object');
                storage.items[0].should.have.property('id');
                storage.items[0].should.have.property('name');
                storage.items[0].id.should.be.a('number');
                storage.items[0].name.should.be.a('string');
                storage.items[0].name.should.equal('potatoes');
                done();
            });
          
    });
    it('should delete an item on delete', function(done) {
        chai.request(app)
            .delete('/items/1')
            .end(function (err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                storage.items[1].should.be.a('object');
                storage.items[1].should.have.property('id');
                storage.items[1].should.have.property('name');
                storage.items[1].id.should.be.a('number');
                storage.items[1].name.should.be.a('string');
                storage.items[1].name.should.equal('Peppers');
                done();
            });
            
    });
    
    //delete item doesnt  exist in the list
    it('delete an id doesnt exist', function(done) {
        chai.request(app)
            .delete('/items/id')   
            .end(function(err, res) {
                should.not.equal(err, null)
                res.should.have.status(400);
                done();
            });
    });
    // other way to do it:
    
    //  it("Post to an ID that exists", function(done) {
    //     chai.request(app)
    //     .post('/items')
    //     .send({name: 'appletini', id: '2'})
    // });
    // second part of the project:
    //A 400 means that the request was malformed. In other words, the data stream sent by the client 
    //to the server didn't follow the rules.
    it("Post to an ID that exists", function(done) {
        chai.request(app)
        .post('/items/2')
        //add a name to test that it cannot be assigned to an existing id.
        .send({name: 'appletini'})
        .end(function (err, res) {
        // 404 resource doesnt excist not found
        //  should.not.equal(err, null);
          res.should.have.status(409); 
        done(); 
        });
    });
    
    //POST without body data.
//   it("Post without body data", function(done) {
//         chai.request(app)
//         .post('/items')
//         .send({})
//         .end(function (err, res) {
//             should.not.equal(err, null);
//           res.should.have.status(500); 
//         done(); 
//         });
//     });

    
});


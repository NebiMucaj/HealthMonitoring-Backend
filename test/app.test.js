const app = require("../index");
const chai = require("chai");
const chaiHttp = require("chai-http");

const { expect } = chai;
chai.use(chaiHttp);
describe("Drug", () => {
  it("get all drug information", done => {
    chai
      .request(app)
      .get("/drug")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object')
        expect(res.body.drugs).to.be.a('array')
        expect(res.body).to.have.key('drugs')
        
        done();
      });
  });
  it("get specific drug information with existing drugID", done => {
    chai
      .request(app)
      .get("/drug/information/1")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object')
        expect(res.body.drug).to.be.a('array')
        expect(res.body).to.have.key('drug')
        
        done();
      });
      
  });
  it("get specific drug information with not existing drugID", done => {
    chai
      .request(app)
      .get("/drug/information/10000")
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object')
        expect(res.body).to.have.key('error')
        expect(res.body.error).to.equal('no drug with this id')
        
        
        done();
      });
      
  });
  it("get specific drug information with not numeric drugID", done => {
    chai
      .request(app)
      .get("/drug/information/seven")
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object')
        expect(res.body).to.have.key('error')
        expect(res.body.error).to.equal('only numeric input!')
        
        
        done();
      });
      
  });
  
});

describe("Message", () => {
    it("get all drug information", done => {
      chai
        .request(app)
        .get("/drug")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object')
          expect(res.body.drugs).to.be.a('array')
          expect(res.body).to.have.key('drugs')
          
          done();
        });
    });
    it("get all messages of a conversation ", done => {
      chai
        .request(app)
        .get("/message/1/2")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object')
          expect(res.body.messages).to.be.a('array')
          expect(res.body).to.have.key('messages')
          
          done();
        });
        
    });
    it("post message with valid parameters ", done => {
        chai
          .request(app)
          .post("/message/1")
          .send({
            "message": "Hallo",
            "timestamp": "2020-08-11",
            "patientIsReceiver": true,
            "doctorID": 2
          })
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.a('object')
            expect(res.body).to.have.key('status')
            expect(res.body.status).to.equal('created')
            
            done();
          });
          
      });
      it("post message with not existing Id`s ", done => {
        chai
          .request(app)
          .post("/message/100000")
          .send({
            "message": "Hallo",
            "timestamp": "2020-08-11",
            "patientIsReceiver": true,
            "doctorID": 2
          })
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.a('object')
            expect(res.body).to.have.key('error')
            expect(res.body.error).to.equal('ER_NO_REFERENCED_ROW_2')
            
            done();
          });
          
      });
   
    
  });
  describe("Patient", () => {

    it("get specific patient", done => {
      chai
        .request(app)
        .get("/patient/user/2")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object')
          expect(res.body.patient).to.be.a('array')
          expect(res.body.patient[0].patientID).to.equal(2)
          
          done();
        });
        
    });
   
    it("search specific patient with  name", done => {
      chai
        .request(app)
        .get("/patient/search?name=Max")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.patients).to.be.a('array')
          res.body.patients.forEach(x=>{
            expect(x.name).to.equal('Max')
          })
         


         
         
          
          done();
        });

    });
    
    it("search specific patient with  lastName", done => {
      chai
        .request(app)
        .get("/patient/search?lastName=Mustermann")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.patients).to.be.a('array')
          res.body.patients.forEach(x=>{
            expect(x.lastName).to.equal('Mustermann')
          })
         


         
         
          
          done();
        });
      });
      it("search specific patient with ID", done => {
        chai
          .request(app)
          .get("/patient/search?PatientID=2")
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body.patients).to.be.a('array')
            res.body.patients.forEach(x=>{
              expect(x.patientID).to.equal(2)
            })
           
  
  
           
           
            
            done();
          });
        });
   
        it("search specific patient with not existing parameters", done => {
          chai
            .request(app)
            .get("/patient/search?name=wolf&PatientID=3000")
            .end((err, res) => {
              expect(res).to.have.status(400);
              expect(res.body.patients).to.be.a('array')
              expect(res.body.patients.length).to.equal(0)
              
             
    
    
             
             
              
              done();
            });
          });
     
    
  });
  


const express= require('express');
const router= express.Router();
require('../controller/Patient.js')
const con=require('../models/dbconnection.js');
const { query } = require('express');
/**
 * @swagger
 *
 * paths: 
 *  /patient/user/{patientID}:
 *   get:
 *      tags:
 *         - Patient
 *      description: get a patient By ID 
 *      responses:
 *       '200':
 *         description: Operation was successful
 *       '400':
 *         description: No Patient with this ID
 *      '500':
 *         description: Error in Database
 *      parameters:
 *       - in: path
 *         name: patientID
 *         schema:
 *          type: String
 *          default: '2'
 *          required: true
 *         description:  ID of the patient to get
 *         
 * 
 * 
 */
router.get('/user/:patientID',(req,res)=>{
    
    var query=(gePatientByID(req.params.patientID))
    con.connection.query(query, function(err, result) {

        if (err) res.status(500).json({'error':err.code});
       
        else {
            if (result.length==0) res.status(400).json({'status':'no patient with this id'})
            
            else res.status(200).json({'patient':result});
        }
          });


});
/**
 * @swagger
 *
 * paths: 
 *  /patient/search:
 *   get:
 *      tags:
 *         - Patient
 *      description: search for  a patient By name, lastname or patientID 
 *      responses:
 *       '200':
 *         description: Operation was successful
 *       '400':
 *         description: No Patient found
 *       '500':
 *         description: Error in Database
 *      parameters:
 *       - in: query
 *         name: name
 *         schema:
 *          type: String
 *          default: ''
 *          required: true
 *         description:  name of the patient 
 *       - in: query
 *         name: lastName
 *         schema:
 *          type: String
 *          default: ''
 *          required: true
 *         description:  lastname of the patient  
 *       - in: query
 *         name: PatientID
 *         schema:
 *          type: String
 *          default: ''
 *          required: true
 *         description:  patientID of the patient  
 * 
 * 
 */

router.get('/search',(req,res)=>{
    
    
    let values = Object.values(req.query)
    let  nofilterlist =  values.filter((x)=> x.length==0)
    if( (nofilterlist.length==values.length) || values.length==0) res.status(400).json({'status':'specify your request'})
    else{
        var queryobj={};
        for(i=0;i<Object.keys(req.query).length;i++){
      
       var key =Object.keys(req.query)[i];
       var currentValue= req.query[key]
      
      if(currentValue.length!=0){
        keyAsString=key.toString();
        queryobj[keyAsString]= currentValue;
        
      }
    }
      let query=getSearchQuery(queryobj)
    
      con.connection.query(query, function(err, result) {

        if (err) res.status(500).json({'error':err});
       
        else {
            if (result.length==0) res.status(400).json({'patients':result})
            
            else{

              
             criticalScorequery= getCriticalScore(result);
             con.connection.query(criticalScorequery, function(err, result) {

              if (err) res.status(500).json({'error':err});
             
              else {

                let scoredPatients=getScoredPatients(queryobj)
                con.connection.query(scoredPatients, function(err, result) {

                  if (err) res.status(500).json({'error':err});
                 
                  else {
                    res.status(200).json({'patients':result})
                    
                  }
                    });
              }
                });


              
            } 
        }
          });
    
    }
   
   

    
           
        
         


});
router.get('/search/init/:doctorID',(req,res)=>{
  patientsByIdQuery= getPatientByDoctorID(req.params.doctorID)
  con.connection.query(patientsByIdQuery, function(err, result) {

    if (err) res.status(500).json({'error':err});
   
    else {
      if (result.length==0) res.status(400).json({'patients':result})
      else{
              criticalScorequery= getCriticalScore(result);
             con.connection.query(criticalScorequery, function(err, result) {

              if (err) res.status(500).json({'error':err});
             
              else {
               let scoredPatients=getScoredPatientsByDoctorID(req.params.doctorID)
                con.connection.query(scoredPatients, function(err, result) {

                  if (err) res.status(500).json({'error':err});
                 
                  else {
                    res.status(200).json({'patients':result})
                    
                  }
                    });
                
              }
                });
              }  
    }
      });

     
});
router.get('/doctor/:id',function(req,res){
  con.connection.query("SELECT name,lastName from doctor WHERE doctorID="+req.params.id+";", function(err, result) {

      if (err) res.status(400).json({'error':err});
      
      else{ 
          let fullname=result[0].name+' '+result[0].lastName
          res.status(200).json({fullname});
  
  
  }   
  })

})
module.exports=router
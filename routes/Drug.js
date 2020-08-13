const express= require('express');
const router= express.Router();
require('../controller/Drug')
const con=require('../models/dbconnection.js')

/**
 * @swagger
 *
 * paths: 
 *  /drug:
 *   get:
 *      tags:
 *         - Drug
 *      description: get all drugs 
 *      responses:
 *       '200':
 *         description: operation was successful
 *       '400':
 *         description: table drugs is empty
 *      '500':
 *         description: Error in Database
 *   
 *         
 * 
 * 
 */

router.get('/',(req,res)=>{
    
    var query=(getDrugs())
    con.connection.query(query, function(err, result) {

        if (err) res.status(500).json({'error':err});
       
        else {
            if (result.length==0) res.status(400).json({'status':'no drugs'})
            
            else res.status(200).json({'drugs':result});
        }
          });


});
/**
 * @swagger
 *
 * paths: 
 *  /drug/information/{drugID}:
 *   get:
 *      tags:
 *         - Drug
 *      description: get a drug By ID 
 *      responses:
 *       '200':
 *         description: Operation was successful
 *       '400':
 *         description: No drug with this ID
 *      '500':
 *         description: Error in Database
 *      parameters:
 *       - in: path
 *         name: drugID
 *         schema:
 *          type: String
 *          default: '2'
 *          required: true
 *         description:  ID of the drug to get
 *         
 * 
 * 
 */

router.get('/information/:id',(req,res)=>{
    
    var query=(getDrugByID(req.params.id))
    



    if (!/^[0-9]*$/.test(req.params.id)){
        res.status(400).json({'error':'only numeric input!'});
    }
    else{
    var query=(getDrugByID(req.params.id))
    con.connection.query(query, function(err, result) {

        if (err) res.status(500).json({'error':err.code});
       
        else {
            if (result.length==0) res.status(400).json({'error':'no drug with this id'})
            
            else res.status(200).json({'drug':result});
        }
          });

        }
});


module.exports=router
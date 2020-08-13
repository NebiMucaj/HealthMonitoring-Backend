const express= require('express');
const router= express.Router();
require('../controller/Message.js')
const con=require('../models/dbconnection.js')
/**
 * @swagger
 *
 * paths: 
 *  /message/{patientID}:
 *   post:
 *      tags:
 *         - Message
 *      description: post message
 *      responses:
 *       '200':
 *         description: Operation was successful
 *       '400':
 *         description: requestbody is not valid 
 *       '500':
 *         description: Error in Database

 *      parameters:
 *       - in: path
 *         name: patientID
 *         schema:
 *          type: String
 *          default: '2'
 *          required: true
 *         description:  ID of the patient 
 *       - in: body
 *         name: message
 *         description: The user to create.
 *         schema:
 *           type: object
 *           required:
 *           properties:
 *             message:
 *               type: string
 *             timestamp:
 *               type: string
 *             patientIsReceiver:
 *               type: boolean
 *             doctorID:
 *               type: integer
 *          
 *              
 *         
 * 
 * 
 */

router.post("/:id",(req,res)=>{
//check if the params are valid 
var bodyParams=Object.keys(req.body);
var validParams=[ 'message', 'timestamp', 'patientIsReceiver', 'doctorID' ]
sameParams = bodyParams.filter(x=>validParams.includes(x) );

if(sameParams.length!=4){res.status(400).json({'status':'Bad Request'})

}
else {var newMessage= new Message(req.body.message,req.body.timestamp,req.body.patientIsReceiver,req.params.id,req.body.doctorID,)

var query=newMessage.insertMessage()

//post a message to the db 
con.connection.query(query.sql,query.set, function(err, result) {

    if (err) res.status(400).json({'error':err});
   
    else res.status(200).json({'status':'created'});
      });

}
})
/**
 * @swagger
 *
 * paths: 
 *  /message/{doctorID}/{patientID}:
 *   get:
 *      tags:
 *         - Message
 *      description: get all the messages from the conversation between patient and doctor  
 *      responses:
 *       '200':
 *         description: Operation was successful
 *      '500':
 *         description: Error in Database
 *      parameters:
 *       - in: path
 *         name: doctorID
 *         schema:
 *          type: String
 *          default: '2'
 *          required: true
 *         description:  ID of the doctor
 *       - in: path
 *         name: patientID
 *         schema:
 *          type: String
 *          default: '2'
 *          required: true
 *         description:  ID of the patient 
 *         
 * 
 * 
 */

router.get('/:doctorID/:patientID',(req,res)=>{
    
    var query=getMessages(req.params.patientID,req.params.doctorID)
    con.connection.query(query, function(err, result) {

        if (err) res.status(500).json({'error':err});
       
        else {
            var messages=[];

            if(req.query.isDoctor=='true'){
            result.map(x=>{
                timestamp=new Date(x.timestamp)
        
                var rel=true;
                var participantId=1;
                if(!x.patientIsReceiver){
                    rel=false
                    participantId=2
                }
            
                
            messages.push({'content':x.message,'myself':rel,'participantId':participantId,
            'timestamp':{'year':timestamp.getFullYear(),'month':timestamp.getMonth(),'day':timestamp.getDay(),'hour': timestamp.getHours(),'minute':timestamp.getMinutes(),'second':timestamp.getSeconds(),'millisecond':timestamp.getMilliseconds()}
        
        })

            }    )
        }else{
            result.map(x=>{
                timestamp=new Date(x.timestamp)
                
                var rel=true;
                var participantId=1;
                if(x.patientIsReceiver){
                    rel=false
                    participantId=2
                }
            
                
            messages.push({'content':x.message,'myself':rel,'participantId':participantId,
            'timestamp':{'year':timestamp.getFullYear(),'month':timestamp.getMonth(),'day':timestamp.getDay(),'hour': timestamp.getHours(),'minute':timestamp.getMinutes(),'second':timestamp.getSeconds(),'millisecond':timestamp.getMilliseconds()}
        
        })

            }    )

        }
            
            
            
            
            res.status(200).json({'messages':messages});
        }
          });


});



module.exports=router
const express= require('express');
const router= express.Router();
require('../controller/ Prescription ')
require('../controller/Amount')
const con=require('../models/dbconnection.js')

/**
 * @swagger
 *
 * paths: 
 *  /prescription/prescriptions/{patientID}:
 *   get:
 *      tags:
 *         - Prescription
 *      description: get all prescription from specific  patient 
 *      responses:
 *       '200':
 *         description: Operation was successful
 *       '500':
 *         description: Error in Database
 *      parameters:
 *       - in: path
 *         name: patientID
 *         schema:
 *          type: String
 *          default: '1'
 *          required: true
 *         description:  ID of the patient
 *         
 * 
 * 
 */

router.get('/prescriptions/:patientID',(req,res)=>{
    
   sql= getallPrescriptionByID(req.params.patientID);
   
   con.connection.query(sql, function(err, result) {

    if (err) res.status(400).json({'error':err.code});
    else {
      prescriptions=[]
      noRepeatList=[];
      dailyRepeatList=[];
      weeklyRepeatList=[];
      monthlyRepeatList=[];
      result.map((x)=>{
        
       switch (x.frequenz){
         case "keine": noRepeatList.push(x); break;
         case "täglich":dailyRepeatList.push(x); break;
         case "wöchentlich":weeklyRepeatList.push(x);break;
         case "monatlich":monthlyRepeatList.push(x);break;
         default:
       }
       
      })
   

      noRepeatList.map((x)=>{
      
        let intakeTime=getIntakeTime(x.intakeTime)
        let start =x.startDate.toISOString().substring(0,11)+intakeTime.startTime
        let end= x.startDate.toISOString().substring(0,11)+intakeTime.endTime
        
      
       
        prescriptions.push({ id:x.prescriptionID,title: x.drugName, start: start,end:end,extendedProps: {description:x.description,start:x.startDate,amount:x.amount,prescriptionID:x.prescriptionID,intakeTimeIndex:x.intakeTime,frequenzID:x.frequenzID},color:"#"+((1<<24)*Math.random()|0).toString(16),allDay: false, drugID:x.drugID.toString()    

      })
    })

      dailyRepeatList.map((x)=>{
        
        let intakeTime=getIntakeTime(x.intakeTime)
        if(x.endDate===null){
          prescriptions.push({ id:x.prescriptionID,title:x.drugName, startRecur: x.startDate,daysOfWeek: [ '1','2','3','4','5','6','0'], drugID:x.drugID.toString(),color:"#"+((1<<24)*Math.random()|0).toString(16),allDay: false,extendedProps: {description:x.description,start: x.startDate,amount:x.amount,prescriptionID:x.prescriptionID,intakeTimeIndex:x.intakeTime,frequenzID:x.frequenzID},startTime:intakeTime.startTime,endTime:intakeTime.endTime})
        }
        else   prescriptions.push({ id:x.prescriptionID,title:x.drugName, startRecur: x.startDate,endRecur: x.endDate,daysOfWeek: [ '1','2','3','4','5','6','0'], drugID:x.drugID.toString(),color:"#"+((1<<24)*Math.random()|0).toString(16),extendedProps: {description:x.description,start: x.startDate,end: x.endDate,amount:x.amount, prescriptionID:x.prescriptionID,intakeTimeIndex:x.intakeTime,frequenzID:x.frequenzID},allDay: false,startTime:intakeTime.startTime,endTime:intakeTime.endTime})
         
  
        })
        weeklyRepeatList.map((x)=>{
          
          let intakeTime=getIntakeTime(x.intakeTime)
          if(x.endDate===null){
            prescriptions.push({ id:x.prescriptionID,title:x.drugName, startRecur: x.startDate,daysOfWeek:x.specificDays.split(','), drugID:x.drugID.toString(),color:"#"+((1<<24)*Math.random()|0).toString(16),allDay: false,extendedProps: {description:x.description,start: x.startDate,amount:x.amount,prescriptionID:x.prescriptionID,intakeTimeIndex:x.intakeTime,frequenzID:x.frequenzID},startTime:intakeTime.startTime,endTime:intakeTime.endTime})
         
          }
          else   prescriptions.push({ id:x.prescriptionID,title:x.drugName, startRecur: x.startDate,endRecur: x.endDate,daysOfWeek: x.specificDays.split(','), drugID:x.drugID.toString(),color:"#"+((1<<24)*Math.random()|0).toString(16),allDay: false,extendedProps: {description:x.description,start: x.startDate,end: x.endDate,amount:x.amount,prescriptionID:x.prescriptionID,intakeTimeIndex:x.intakeTime,frequenzID:x.frequenzID},startTime:intakeTime.startTime,endTime:intakeTime.endTime})
           
    
          })
          monthlyRepeatList.map((x)=>{
          
            let intakeTime=getIntakeTime(x.intakeTime)
            if(x.endDate===null){
            let timeBetween=(new Date()-x.startDate)/1000
            timeBetween /= (60 * 60 * 24 * 7 * 4)
            timeBetween= Math.abs(Math.round(timeBetween));
            
            for(i=0;i<timeBetween+12;i++){
              
            
              x.startDate.setMonth(x.startDate.getMonth()+ 1);
            
              

             
              let intakeTime=getIntakeTime(x.intakeTime)
              let start =x.startDate.toISOString().substring(0,11)+intakeTime.startTime
              let end= x.startDate.toISOString().substring(0,11)+intakeTime.endTime
              
            
             
              prescriptions.push({ id:x.prescriptionID,title: x.drugName, start: start,end:end,extendedProps: {description:x.description,start:x.startDate,amount:x.amount,prescriptionID:x.prescriptionID,intakeTimeIndex:x.intakeTime,frequenzID:x.frequenzID},color:"#"+((1<<24)*Math.random()|0).toString(16),allDay: false, drugID:x.drugID.toString()   }) 
            }
            }
            else   prescriptions.push({ id:x.prescriptionID,title:x.drugName, startRecur: x.startDate,endRecur: x.endDate,daysOfWeek: x.specificDays.split(','), drugID:x.drugID.toString(),color:"#"+((1<<24)*Math.random()|0).toString(16),allDay: false,extendedProps: {description:x.description,start: x.startDate,end: x.endDate,amount:x.amount,prescriptionID:x.prescriptionID,intakeTimeIndex:x.intakeTime,frequenzID:x.frequenzID},startTime:intakeTime.startTime,endTime:intakeTime.endTime})
             
      
            })
     
      
      
      
      
     
     
     
      res.status(200).json({'prescriptions':prescriptions});
    }
      });

   
   
    

});
/**
 * @swagger
 *
 * paths: 
 *  /prescription/:
 *   post:
 *      tags:
 *         - Prescription
 *      description: post prescription
 *      responses:
 *       '200':
 *         description: Operation was successful
 *       '400':
 *         description: requestbody is not valid 
 *       '500':
 *         description: Error in Database

 *      parameters:
 *       - in: body
 *         name: prescription
 *         description: The prescription to create for the specific patient.
 *         schema:
 *           type: object
 *           required:
 *           properties:
 *             patientID:
 *               type: integer
 *             doctorID:
 *               type: integer
 *             drugID:
 *               type: integer
 *             startDate:
 *               type: string
 *             endDate:
 *               type: string
 *             specificDays:
 *               type: string
 *             frequenzID:
 *               type: integer
 *             amountList:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   intakeTimeindex:
 *                     type: integer
 *                   amount:
 *                     type: integer
 *          
 *              
 *         
 * 
 * 
 */
router.post("/",(req,res)=>{
  //check if the params are valid 
  var bodyParams=Object.keys(req.body);
  var validParams=[ 'patientID', 'doctorID', 'drugID', 'startDate','endDate','specificDays','frequenzID','amountList','description']
  sameParams = bodyParams.filter(x=>validParams.includes(x) );
  console.log(sameParams.length)
  console.log(req.body)
  if(sameParams.length!=9){
    res.status(400).json({'status':'Bad Request'})
  
  }
 else {
   
    let endDateIncrement=''
    if(req.body.endDate!==''){
  let endDate=new Date(req.body.endDate)
  endDate.setDate(endDate.getDate() + 1);
   endDateIncrement=endDate.toISOString().substr(0,10)
    }
  

    var newPrescription= new Prescription(req.body.patientID,req.body.doctorID,req.body.drugID,req.body.startDate,endDateIncrement,req.body.specificDays,req.body.frequenzID,req.body.amount,req.body.description)
   
  var query=newPrescription.insertPrescription()
  
  //post a message to the db 
  con.connection.query(query, function(err, result) {
  
      if (err) res.status(400).json({'error':err});
     
      else {
        
        let amountQuery=insertAmount(req.body.amountList,result.insertId)
        
        con.connection.query(amountQuery, function(err, result) {
  
          if (err) res.status(400).json({'error':err});
         else res.status(200).json({'status':'created'});
        
        });
        
        

  }
        });

  
  }
  })
/**
 * @swagger
 *
 * paths: 
 *  /prescription/frequenz:
 *   get:
 *      tags:
 *         - Prescription
 *      description: available repetition intervals
 *      responses:
 *       '200':
 *         description: Operation was successful
 *      '500':
 *         description: Error in Database
 *         
 * 
 * 
 */
  
  router.get('/frequenz',(req,res)=>{
    
    sql= 'select * from frequenz; ';
    
    con.connection.query(sql, function(err, result) {
 
     if (err) res.status(400).json({'error':err.code});
     else {
      res.json(result);
            
     }
           })

          });
      
       
     function getIntakeTime(index){
     
      let inatkeTime={};
      switch (index){
        case 0:inatkeTime={startTime: '05:00:00',endTime: '10:00:00'}; break;
        case 1:inatkeTime={startTime: '10:00:00',endTime: '12:00:00'}; break;
        case 2:inatkeTime={startTime: '12:00:00',endTime: '14:00:00'}; break;
        case 3:inatkeTime={startTime: '14:00:00',endTime: '18:00:00'}; break;
        case 4:inatkeTime={startTime: '18:00:00',endTime: '23:00:00'}; break;
        case 5:inatkeTime={startTime: '23:00:00',endTime: '05:00:00'}; break;
      
        default:
      }
      
      return inatkeTime;
      
     }  
     /**
 * @swagger
 *
 * paths: 
 *  /prescription/delete/{prescriptionID}:
 *   delete:
 *      tags:
 *         - Prescription
 *      description: delete prescription
 *      responses:
 *       '200':
 *         description: Operation was successful
 *       '500':
 *         description: Error in Database

 *      parameters:
 *       - in: path
 *         name: prescriptionID
 *         schema:
 *          type: String
 *          default: '2'
 *          required: true
 *         description:  ID of the prescription
 *              
 *         
 * 
 * 
 */
     router.delete('/delete/:prescriptionID', function (req, res) {
      let prescriptionID=req.params.prescriptionID;
      let sql = deletePrescriptionByID(prescriptionID)
      con.connection.query(sql, function(err, result) {
 
        if (err) res.status(500).json({'error':err});
        else {
         res.status(200).json({status:"deleted successfully"});
               
        }
              })

    });
 
 /** 
 * @swagger
 *
 * paths: 
 *  /prescription/{prescriptionID}:
 *   put:
 *      tags:
 *         - Prescription
 *      description: post prescription
 *      responses:
 *       '200':
 *         description: Operation was successful
 *       '400':
 *         description: requestbody is not valid 
 *       '500':
 *         description: Error in Database

 *      parameters:
 *       - in: path
 *         name: prescriptionID
 *         schema:
 *           type: String
 *           default: '2'
 *           required: true
 *         description:  ID of the prescription  
 *       - in: body
 *         name: prescription
 *         description: The prescription to update for the specific patient.
 *         schema:
 *           type: object
 *           required:
 *           properties:
 *             patientID:
 *               type: integer
 *             doctorID:
 *               type: integer
 *             drugID:
 *               type: integer
 *             startDate:
 *               type: string
 *             endDate:
 *               type: string
 *             specificDays:
 *               type: string
 *             frequenzID:
 *               type: integer
 *             amountList:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   intakeTimeindex:
 *                     type: integer
 *                   amount:
 *                     type: integer
 *          
 *              
 *         
 * 
 * 
 */

    router.put('/:prescriptionID', function (req, res) {
      
      var bodyParams=Object.keys(req.body);
  var validParams=[ 'patientID', 'doctorID', 'drugID', 'startDate','endDate','specificDays','frequenzID','amountList','description' ]
  sameParams = bodyParams.filter(x=>validParams.includes(x) );
  
  if(sameParams.length!=9){
    res.status(400).json({'status':'Bad Request'})
  
  }
 else {
  let prescriptionID=req.params.prescriptionID;
  let sql = deletePrescriptionByID(prescriptionID)
  con.connection.query(sql, function(err, result) {

    if (err) res.status(400).json({'error':err});
    else {
     
           
    }
          })
    
    var newPrescription= new Prescription(req.body.patientID,req.body.doctorID,req.body.drugID,req.body.startDate,req.body.endDate,req.body.specificDays,req.body.frequenzID,req.body.amount,req.body.description)
   
  var query=newPrescription.insertPrescription()
  
  //post a message to the db 
  con.connection.query(query, function(err, result) {
  
      if (err) res.status(400).json({'error':err});
     
      else {
        
        let amountQuery=insertAmount(req.body.amountList,result.insertId)
        
        con.connection.query(amountQuery, function(err, result) {
  
          if (err) res.status(400).json({'error':err});
         else res.status(200).json({'status':'created'});
        
        });
        
        

  }
        });

  
  }
      
      
     
    });  
       


    addDay= function(date){
      let modifiedDate=date
      modifiedDate.setDate(modifiedDate.getDate() + 1)
      return modifiedDate;
    }



module.exports=router
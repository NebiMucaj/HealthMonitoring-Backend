

Message =class Message{
constructor(message,timestamp,patientIsReceiver,patientID,doctorID){
 this.message=message;
 this.timestamp=timestamp;
 this.patientID=patientID;
 this.doctorID=doctorID;
 this.patientIsReceiver=patientIsReceiver;

}



 insertMessage(){
    
    var sql = "INSERT INTO message SET ?";
    //Make an array of values:
    var data ={
      "message":this.message, "timestamp":this.timestamp,"patientID":this.patientID,"doctorID":this.doctorID,"patientIsReceiver":this.patientIsReceiver
     
    };
   return {'sql':sql,'set':data}
  
}

}

getMessages= function(patientID,doctorID){

  
    
   var sql = 'SELECT * FROM message WHERE patientID='+patientID+' and doctorID='+doctorID;
   ;
   //Make an array of values:
   
  return sql
 

}
module.exports=getMessages;
module.exports=Message;
    

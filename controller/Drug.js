drug =class Drug{
    constructor(message,timestamp,patientIsReceiver,patientID,doctorID){
     this.message=message;
     this.timestamp=timestamp;
     this.patientID=patientID;
     this.doctorID=doctorID;
     this.patientIsReceiver=patientIsReceiver;
    
    }

    
    
    
    
    }
    
    getDrugs= function(){
    
      
        
       var sql = 'select drugID,drugName from drug' ;

       
       
       
      return sql
     
    
    }
    getDrugByID= function(drugID){

        var sql= 'select drugName, sideEffects, dosageForm from drug Where drugID='+drugID+';'
        return sql
    }

    
    module.exports=getDrugs;
    module.exports=drug;
        
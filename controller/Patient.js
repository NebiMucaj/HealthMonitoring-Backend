patient =class Patient{
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
    
    gePatientByID= function(patientID){
    
      
        
       var sql = 'SELECT * FROM patient WHERE patientID='+patientID;
       
       
       
      return sql
     
    
    }

    getSearchQuery= function(queryobj){
     
      var querylist = Object.keys(queryobj).map(function(key) {
        return [key, queryobj[key]];
      });
     var condition=''
     var index=0;
     querylist.map(x=> {
       
    if (index<querylist.length-1)condition+=((x[0]+'='+"'"+x[1]+"'"+' and '));
    else condition+=((x[0]+"="+"'"+x[1]+"'"));
    
    
      index++
      
  
  })
      var sql = 'SELECT patientID FROM patient WHERE '+condition
      
      return sql

    }
    getCriticalScore=function(patientList){
      let sql=''
      for(i=0;i<patientList.length;i++)
      sql+='call computeCritical('+patientList[i].patientID+');'
      return sql

    }
    getScoredPatients= function(queryobj){
     
      var querylist = Object.keys(queryobj).map(function(key) {
        return [key, queryobj[key]];
      });
     var condition=''
     var index=0;
     querylist.map(x=> {
       
    if (index<querylist.length-1)condition+=(('p.'+x[0]+'='+"'"+x[1]+"'"+' and '));
    else condition+=(('p.'+x[0]+"="+"'"+x[1]+"'"));
    
    
      index++
      
  
  })
      var sql = 'SELECT *  FROM patient p join criticalScore c  on p.patientID=c.patientID and '+condition+' Order By c.criticalScore DESC'
     
      return sql
}

  getPatientByDoctorID=function(doctorID){
    let sql='select DISTINCT p.patientID  from patient p join prescription pr on p.patientID=pr.patientID where doctorID='+doctorID+' ;'
    return sql;
  }
  getScoredPatientsByDoctorID=function(doctorID){
    let sql= 'select DISTINCT  p.patientID,p.name,p.lastName,c.criticalScore  from patient p join prescription pr on p.patientID=pr.patientID  join criticalScore c on c.patientID=p.patientID where doctorID='+doctorID+' Order By c.criticalScore DESC limit 50;'
    return sql;
  }
    


    module.exports=gePatientByID;
    module.exports=getSearchQuery;
    module.exports=getCriticalScore;
    module.exports=patient;
    module.exports=getScoredPatients;
    module.exports=getPatientByDoctorID;
    module.exports=getScoredPatientsByDoctorID;

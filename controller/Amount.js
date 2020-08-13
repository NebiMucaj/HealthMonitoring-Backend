      
    insertAmount=function(amountList,prescriptionID){
        let sql='';
           amountList.map(x=>{
           sql+= 'insert into amount(prescriptionID,amount,intakeTime) Values ('+prescriptionID+','+x.amount+','+x.intakeTimeindex+');'
           });
          
           return sql;
        };
    
        
        module.exports=insertAmount;
       
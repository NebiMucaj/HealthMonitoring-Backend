const express = require('express');


const app= express();
const bodyparser = require('body-parser')
require('dotenv/config')
const messageRoute= require('./routes/Message')
const patientRoute= require('./routes/Patient')
const drugRoute=require('./routes/Drug')
const prescriptionRoute=require('./routes/Prescription')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')
const userMiddleware = require('./middleware/user');




const swaggerOptions={
swaggerDefinition:{
   info:{ title:'HealthMonitoring API',
    description:'API for monitoring of drug adherence and vital parameters of patients at home',
    contact:{
    name:'Andrea Karadzhova,Danylo Ulianov,Nebi Mucaj, '

    },
    servers:['http://localhost:5000'],
   }
},
apis:['./routes/*.js']

}
const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use('/api',swaggerUI.serve, swaggerUI.setup(swaggerDocs));

var cors = require('cors')
app.use(cors({origin: 'http://localhost:8080'}));
app.use(bodyparser.json())
const router = require('./routes/auth.js');
app.use('/auth', router);
app.use('/message',userMiddleware.isLoggedIn, messageRoute);
app.use('/patient',userMiddleware.isLoggedIn, patientRoute);
app.use('/drug',userMiddleware.isLoggedIn,drugRoute);
app.use('/prescription',userMiddleware.isLoggedIn,prescriptionRoute);

app.listen(5000);
console.log('server is listining on port 5000')


module.exports = app
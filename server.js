const express = require('express');
const { initMysql } = require('./dataModel');
const morgan = require('morgan');
const userRoute = require('./routes/userRoute');
const {checkApiKey } = require('./middleware/apikeyCheck');
const dotenv = require('dotenv');



const app = express();
const port = 3000;

dotenv.config();
app.use(express.json());    
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocument));
app.use('/api/user',checkApiKey,userRoute);


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    initMysql();
});
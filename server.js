const express = require('express');
const { initMysql } = require('./dataModel');
const morgan = require('morgan');
const userRoute = require('./routes/userRoute');
const {checkApiKey } = require('./middleware/apikeyCheck');
const dotenv = require('dotenv');
const { swaggerUi, swaggerDocument } = require('./swagger/swagger');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    credentials: true
}


const app = express();
const port = 3000;

dotenv.config();
app.use(express.json());    
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(cors(corsOptions));


app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocument));
app.use('/api/user',checkApiKey,userRoute);



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    initMysql();
});
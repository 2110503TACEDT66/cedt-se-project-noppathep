const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const {xss} = require('express-xss-sanitizer');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');


//Load env vars
dotenv.config({path:'./config/config.env'});

//connect to db
connectDB(); 

const app =express();
app.use(cookieParser());
app.use(express.json());
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());

const limiter = rateLimit({
    windowsMs:10*60*1000,//10min
    max:100
});
app.use(limiter);
app.use(hpp());
app.use(cors());

//swagger
const swaggerOptions = {
    swaggerDefinition:{
        openapi:'3.0.0',
        info:{
            title:'Libraty API',
            version:'1.0.0',
            description:'A restaurant reservation API'
        }
    },
    apis:['./routes/*.js'],
}
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDocs));


// // Add cache control headers doesn't work nutty
// app.use((req, res, next) => {
//     res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
//     res.setHeader('Pragma', 'no-cache');
//     res.setHeader('Expires', '0');
//     res.setHeader('Surrogate-Control', 'no-store');
//     next();
// });

const auth = require('./routes/auth');
app.use('/api/v1/auth', auth);

const restaurants = require('./routes/restaurants');
app.use('/api/v1/restaurants', restaurants);

const reservations = require('./routes/reservations');
app.use('/api/v1/reservations',reservations);

const menus = require('./routes/menus');
app.use('/api/v1/menus',menus);

const tables = require('./routes/tables');
app.use('/api/v1/tables', tables);

const PORT = process.env.PORT || 5000 ;

const server = app.listen(PORT, console.log('Server running in ', process.env.HOST ,' mode on port ', PORT));

//handle rejection
process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error: ${err.message}`);
    //close server and exit
    server.close(()=>process.exit(1));
});
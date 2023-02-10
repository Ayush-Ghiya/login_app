import express from 'express';
import cors from 'cors'
import morgan from 'morgan';
import connect from './database/conn.js';
import router from './router/route.js';
import bodyParser from 'body-parser'
const app = express();


//=>middlewares
app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(morgan('tiny')); 
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Methods','Content-Type','Authorization');
    next(); 
})
app.disable('x-powered-by');
app.use(express.json());


const port = 8080;


//=>Http GET request
app.get('/',(req,res)=>{
    res.status(201).json('Home GET request');
});

//=>api Routes
app.use('/api',router)


//=>Start server only when we have valid connection
connect().then(()=>{
    try {
        app.listen(port,()=>{
            console.log(`Server connected to http://localhost:${port}`);
        })

    } catch (error) {
        console.log('Cannot connect to the server')
    }
}).catch(error=>{
    console.log("Invalid database connection");
})
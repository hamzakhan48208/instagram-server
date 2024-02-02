const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const postRoute = require('./routes/posts');

app = express();

//connect to mongodb
mongoose.connect('mongodb+srv://hamzakhanonlinebusiness:VhC9jPsn2q5YKLPF@cluster0.vyrtwya.mongodb.net/?retryWrites=true&w=majority');


//usages
app.use(express.json());
app.use(cors({methods: ["POST", "GET", "PUT", "DELETE"], origin: ['http://localhost:4200']}));

app.use(function(req, res, next){
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  //continue to listen
  next();
});

//routes
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/post', postRoute);

//home route
app.get('/', function(req, res){
  res.json('Welcome to Server!');
});

//listen
app.listen(3000, function(){
  console.log('listening on port 3000');
});

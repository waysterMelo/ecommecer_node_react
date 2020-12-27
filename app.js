const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');

require('dotenv').config();

//routes
const auth_routes = require('./routes/auth');
const user_routes = require('./routes/user');

//app
const app = express();


//db
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => console.log('database is now available'));


//middlewares
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(expressValidator());


app.use("/api", auth_routes);
app.use("/api", user_routes);

const port = process.env.PORT || 8000;

app.listen(port, () => {

    console.log(`server is running on port ${port}`);
})
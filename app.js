const express=require('express')
const path = require('path');
const authRouter=require('./routes/authRouter')
const viewRouter=require('./routes/viewRouter')
const cookieParser = require('cookie-parser')
const AppError=require('./utils/appError')
const session=require('express-session')
const MongoStore=require('connect-mongo')
const app=express()

app.use(express.json())
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))

global.userIN = null

//Handle Session
app.use(
    session({
      secret: 'general',
      resave: false,
      saveUninitialized: true,
      store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/auth' }),
    })
  )

//Routers
app.use('/', viewRouter)
app.use('/user',authRouter)


//All Other routes
app.all('*', (req, res, next) => {
    userIN = req.session.userID;
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

module.exports =app
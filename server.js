const dotenv=require('dotenv')
const mongoose=require('mongoose')
const app = require('./app')

//Environemnt settings
dotenv.config({path:'./config.env'})

//Declare Database and connection
const DB = process.env.DATABASE_LOCAL 
mongoose
  .connect(DB)
  .then(() => console.log('DB connection successful!'));

//Server launch setup
const port=process.env.PORT || 3000
app.listen(port,()=>{
    console.log(`App running on port ${port}...`)
})
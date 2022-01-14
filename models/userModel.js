const mongoose=require('mongoose')
const bcrypt=require('bcrypt')

//User schema for database data
const userSchema=new mongoose.Schema({
    name:{
        type: String,
        required: [true,'Please write your name']
    },
    surname:{
        type: String,
        required: [true,'Please write your surname']
    },
    username:{
        type: String,
        required:[true,'Please provide your username'],
        unique: true,
        lowercase:true,
        trim: true,        
    },
    password:{
        type: String,
        required:[true,'Please provide a password'],
        minLength:6,
        select:false
    },   
    created: {
        type:Date,
        default:Date.now
    }
})

userSchema.pre('save',async function(next){             //Middileware async function for crypt password on database

    if(!this.isModified('password')) return next()      //Check the password isModified or notModeified
    this.password = await bcrypt.hash(this.password,12) //Modified the password with bcrypt  
    next()
})

//Userschema method for confirm login password 
userSchema.methods.correctPassword=async function(candidatePassword,userPassword) {
    return await bcrypt.compare(candidatePassword,userPassword)
}

//JWT token generate function
userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign(
      {
        _id: this._id,
        name: this.name
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    )
    return token;
  }

//Export UserModel
const User=mongoose.model('User',userSchema)
module.exports = User



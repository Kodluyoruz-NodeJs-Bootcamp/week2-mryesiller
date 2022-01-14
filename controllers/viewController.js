const path = require('path');
const user=require('./../models/userModel')
const catchAsync = require('../utils/catchAsync');


//Direct to the İndexPage
exports.main=(req,res)=>{
    res.status(200).sendFile(path.join(__dirname, '../public', 'index.html'),{
        title : 'HOME PAGE'
    })
}

//Direct to the UserDashboard
exports.usersOverview = catchAsync(async(req,res,next)=>{
    const users=await user.find()     
    res.status(200).sendFile(path.join(__dirname, '../public', 'overview.html'),{
        title : ' ALL USERS',
        users
    })
})

//Direct to the LoginPage
exports.getLoginForm = (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../public', 'login.html'), {
      title: 'Log into your account'
    })
};

//Direct to the RegisterPage
exports.getRegisterForm = (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../public', 'register.html'), {
      title: 'Register'
    })
};


exports.dataUsers= async(req, res) => {
    const users=await user.find()  
    res.status(200).json({
        users
    })
}
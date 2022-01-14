const express=require('express')
const viewController = require('./../controllers/viewController')
const authController= require('./../controllers/authController')

const router=express.Router()

//View Routes for HTML and data transfer
router.get('/', viewController.main)
router.get('/login',authController.isLoggedIn, viewController.getLoginForm)
router.get('/register',viewController.getRegisterForm)


router.get('/users',authController.checkJWT, viewController.usersOverview)
router.get('/users/data',viewController.dataUsers)

module.exports =router
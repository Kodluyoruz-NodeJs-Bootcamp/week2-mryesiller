const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

//JWT token sign
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

//JWT token Create function
const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user.__id);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  })
}

//Signup settings and create User on database
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    surname: req.body.surname,
    username: req.body.username,
    password: req.body.password,
  })

  createSendToken(newUser, 201, req, res);
})

//Login users and check user is valid(Database-SessionID)
exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;
  //check email and password if exist
  if (!username || !password) {
    return next(new AppError("Please provide username and password", 400))
  }
  //Check if User exist and password is correct
  const user = await User.findOne({ username }).select("+password")
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect user or password", 401))   
  }
  req.session.userID = user._id; 
  //if everytihng is ok send token to client
  createSendToken(user, 200, req, res)
})

//Logout function
exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  })
  req.session.destroy(()=> {
    res.status(200).json({ status: "success" })
  })
  
}

//Check user if loggedIn
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      )
      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id)
      if (!currentUser) {
        return next();
      }
      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
}

//Checking JWT token
exports.checkJWT = (req, res, next) => {
  // Read the token from the cookie
  const token = req.cookies.jwt;
  if (!token)
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {  
    //Incase of expired jwt or invalid token kill the token and clear the cookie
    res.clearCookie("jwt")
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    )    
  }
}

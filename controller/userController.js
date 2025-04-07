
const bcrypt = require('bcryptjs');
const base64 = require('base-64');
const Users = require('../Models/Users.js')


const signup = (req, res) => {
    res.render('signup', {message: null})
}


const loginPage = (req, res) => {
    res.render('login', {message: null });
  }
const register = async (req, res) => {
    try{  const {name, email, password} = req.body

    const existingUser = await Users.findOne({email});
    if(existingUser) {
      // return res.status(400).json({message: 'email already exists, please try login'})
      return res.render('signup', {message: 'email already exists, please try login'})

    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Users({name, email, password: hashedPassword});
    newUser.save()
    .then( response => {
      // return res.status(200).json({message: 'User created successfully !'})
      return res.render('login', {message: 'User created successfully !'})
    })
    .catch( err => {
      // return res.status(400).json({message: 'User cant be created now, please try later'})
      return res.render('signup', { message: 'User can’t be created due to server error, please contact support' });
    })
  }
  catch{
    console.error(error);
    return res.render('signup', { message: 'User can’t be created due to server error, please contact support' });
  }
}

const login = async (req, res) => {
    try{
        const {email, password} = req.body
        const existingUser = await Users.findOne({email})
        if(!existingUser){
          return res.render('login', {message: 'User is not registered, please register'})
        }
        const passwordMatch = await bcrypt.compare(password, existingUser.password)
        if(passwordMatch){
          req.session.userId = existingUser._id  
          return res.redirect('/home');

        }else {
          //return res.status(400).json({message: 'Invalid password'})
          return res.render('login', {message: 'Invalid password'})
        }
      }
    catch (error) {
      // return res.status(500).json({message: 'User can not login at the moment, please try later '})
      return res.render('login', {message: 'User can not login at this moment, please try later'})
    }
}

const allusers = async (req, res) => {
  if (!req.session.isAdmin) {
    return res.status(403).json({ message: "Access Denied" });
  }
  try {
      const allUsers = await Users.find();
      return res.json(allUsers);
  } catch (error) {
      return res.status(500).json({ message: "Failed to fetch users", error });
  }
};

const logout = (req, res, next) => {
    req.session.destroy(() => {
      res.redirect('/login');
    })
    next();
}

module.exports = {
    signup, loginPage, register, login, allusers, logout 
}
// SGN , JSLN, JMD, JSVM, JSSR, JBB, JSRK, JSM, JSRK, JSLN 
const Blogs = require('./Models/blogs.js');
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const {  signup, loginPage, register, login, allusers, logout } = require('./controller/userController.js')

const session = require('express-session');
const Users = require('./Models/Users.js');
const {requireAuth, checAuth} = require('./utils/auth.js');
const {home, myblogs, addblog, createblog, deleteblog, editblog, updateblog } = require('./controller/blogController.js')


const app = express();
app.use(express.json())
app.use(session({
  secret: process.env.SESSION_SECRET || 'dummy key', // Use env for security
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true } // Secure should be true in production
}));
app.use(checAuth);
app.use(express.urlencoded({ extended : true}))
app.set('view engine', 'ejs');

console.log("MONGO_URI:", process.env.MONGO_URI); // Debugging

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true
})
.then(() => console.log('✅ Connected to DB'))
.catch(err => console.error('❌ Database connection failed:', err.message));

app.get('/signup', signup)

app.get('/login', loginPage)

app.post('/register', register)

app.post('/login', login)

app.get('/allusers', requireAuth, allusers);

app.get('/logout', logout);
app.get('/', home);
app.get('/home', home);

app.get('/myblogs', myblogs);
app.get('/addblog', addblog);

app.post('/createblog', createblog)
app.get('/deleteblog', deleteblog )
app.get('/editblog', editblog);
app.post('/updateblog', updateblog);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
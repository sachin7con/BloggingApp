const Blogs = require("../Models/blogs")

const home = async (req, res) => {
        
    try{
        const perPage = 5;
        const page = req.query.page || 1 ;
        const sort = req.query.sort || "title";
        const search = req.query.search || "";
          
        let filter = {};
        if(search){
            filter = {
                $or: [
                    { title: { $regex: search, $options: "i" } },  // Search in title (case-insensitive)
                    { body: { $regex: search, $options: "i" } }    // Search in body (case-insensitive)
                ]
            };
        }
    
        

        const blogs = await Blogs.find(filter)
        .sort( {[sort]: 1 })
        .skip((perPage * page) - perPage)
        .limit(perPage);
        
        const count = await Blogs.countDocuments(filter);
        const totalPages = Math.ceil(count / perPage);
        res.render('home', {message: null, blogData: blogs, pages: totalPages, current: page, sort: sort, search: search })
    }
    catch(error){
        res.render('home', {message: null, blogData: null})
    }

    
}

const myblogs = async (req, res) => {
    const userId = req.session.userId;
    const myBlogs = await Blogs.find({userId}) 
    res.render('myblogs', {message: null, blogData: myBlogs})
}

const addblog = (req, res) => {
    res.render('addblog', {message: null})
}

const createblog = async (req, res) => {
    try{
        const {title, body} = req.body;
        const newblog = new Blogs({title, body, userId: req.session.userId})
        await newblog.save()
        .then(response => {
            res.redirect('/myblogs')
        })
        .catch( err => {
            res.render('addblog', {message: "Cannot be saved, Please try later."})
        })
    }
    catch(err) {
        res.render('addblog', {message: "Cannot create a blog due to server error, Please try later."})
    }
}

const deleteblog = (req, res) => {
    try{
        const {id} = req.query
        Blogs.findOneAndDelete({_id: id})
        .then( response => {
            res.redirect('/myblogs')
        })
        .catch(err => {
            console.log(error)
        })

    }
    catch(error){
        console.log(error)
    }
}


const editblog = async (req, res) => {
    try{
        const blogId = req.query.id;
        const blogData = await Blogs.findOne({_id: blogId})
        res.render('editblog',{message: null, blogData})
        
    }
    catch(error) {
        res.render('myblogs', { message: "Cannot edit blog, please try later." });

    }
        
};
const updateblog = async (req, res) => {
    try{
        const {id, title, body} = req.body;
        await Blogs.findByIdAndUpdate(id, { title, body })
        res.redirect('/myblogs');

    }
    catch(error){
        res.render('editblog', {message: "Can not update blog, please try again later. "})
    }
}


module.exports = {home, myblogs, addblog, createblog, deleteblog, editblog, updateblog}
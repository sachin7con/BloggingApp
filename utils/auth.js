const requireAuth = (req, res, next) => {
    if(!req.session.userId){
        return res.redirect('/login')
    }
    next();

}

const checAuth = ( req, res, next) => {
    res.locals.isAuthenticated = req.session.userId ? true : false; 
    next();
}

module.exports = {requireAuth,  checAuth}
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;




function authMiddleware(req, res, next) {
    const token = req.headers.token;
    const data = jwt.verify(token, JWT_SECRET);
    req.username = data.username;
    if(data) {
        next();
    } else {
        res.status(400).json({
            message: "UnAuthenticated user, signin again"
        })
    }
}



module.exports = {
    authMiddleware
}
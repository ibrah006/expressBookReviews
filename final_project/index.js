const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const getBooks = require('./router/general.js').getBooks;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here

    // NOTE: for debug purpose
    // req.session.authorization = {
    //     username: "Ibrah"
    // }
    // next();
    // return;

    if (req.session.authorization) {
        const token = req.session.authorization["token"];

        jwt.verify(token, "access", (err, user)=> {
            if (!err) {
                req.user = user;
                next();
            } else {
                res.status(400).json({message: "User is not authenticated!"});
            }
        })
    } else {
        res.status(400).json({mesage: "User is not logged in."})
    }

});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

await app.listen(PORT,()=> console.log("Server is running"));

const Router = require('express');
const bcrypt = require('bcrypt');
const { userModel } = require('../db');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { authMiddleware } = require('../middleware/user');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;





const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await userModel.create({
            username,
            password: hashedPassword
        });

        res.status(200).json({
            message: "User signup successfull"
        })
    } catch (e) {
        res.status(500).json({
            message: "Error Signing up " + e,
        })
    }

})


userRouter.post("/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const user = await userModel.findOne({ username })


        if (user) {
            const hashedPassword = bcrypt.compare(password, user.password)

            if (hashedPassword) {
                const token = jwt.sign({
                    username
                }, JWT_SECRET);

                res.status(200).json({
                    message: "User Signin Successfull",
                    token: token
                });
            } else {
                res.status(400).json({
                    message: "Invalid Credentials, Check Password"
                })
            }
        } else {
            res.status(400).json({
                message: "Invalid Credentials, Check Username"
            })
        }
    } catch (e) {
        res.status(500).json({
            message: "Error Fetching User, Try Again Later: " + e
        })
    }

})

userRouter.post("/logout", authMiddleware, (req, res) => {
    res.status(200).json({
        message: "User logged out successfully",
    });
});



module.exports = {
    userRouter
}
const express = require('express');
const { default: mongoose } = require('mongoose');
const dotenv = require('dotenv');
const { userRouter } = require('./routes/user');

dotenv.config();

const app = express();
const PORT = 3000;


app.use(express.json());

app.use("/api/v1/user", userRouter);



async function main() {
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(PORT, ()=> {
        console.log(`Server started at ${PORT}`);
    })
}

main();
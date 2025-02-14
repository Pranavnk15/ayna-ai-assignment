const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { userRouter } = require('./routes/user');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/v1/user", userRouter);

async function main() {
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(PORT, () => {
        console.log(`Server started at ${PORT}`);
    });
}

main();

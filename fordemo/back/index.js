const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./routes/authRouter');
const cors = require('cors')

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cors())
app.use("/auth", authRouter);

const start = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/test');
        app.listen(PORT, () => {
            console.log(`Сервер запущен на порту ${PORT}`)
        })
    } catch (error) {
        console.log(error);
        
    }
}

start()
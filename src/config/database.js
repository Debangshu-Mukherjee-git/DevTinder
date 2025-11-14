const mongoose = require('mongoose');

const connectDB = async() => {
    await mongoose.connect('mongodb+srv://debangshumukherjee:dev-tinder-debangshu@cluster0.yc88hhf.mongodb.net/devTinder')
};

module.exports = connectDB;
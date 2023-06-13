const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI), {
            useUnifiedTopology: true,
            useNewUrlParser: true
            //^ prevent warnings from mongo?
        }
    } catch (err) {
        console.error(error)
    }
}

module.exports = connectDB
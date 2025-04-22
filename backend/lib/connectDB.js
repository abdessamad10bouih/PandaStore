import mongoose from 'mongoose'


const connexionDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`connection to db is successful`)
        console.log(`connected to host: ${mongoose.connection.host}`)
    } catch (error) {
        console.error("error connecting to db :", error)
    }
}

export default connexionDB
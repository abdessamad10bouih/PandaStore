import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './lib/connectDB.js'
import authRouter from './routes/auth.router.js'
import produitRouter from './routes/produits.router.js'
import categorieRouter from './routes/categorie.router.js'
import fournisseurRouter from './routes/fournisseur.router.js'
import userRouter from './routes/user.router.js'
import postsRouter from './routes/posts.router.js'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import morgan from "morgan"
import { migrate } from './scripts/migration.js'


const app = express()
const PORT = 1000
dotenv.config()
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(cookieParser())
app.use((req, res, next) => {
    next();
});
app.use(morgan('dev'))
connectDB()

app.use('/auth', authRouter);
app.use('/produits', produitRouter)
app.use('/categories', categorieRouter)
app.use('/fournisseurs', fournisseurRouter)
app.use('/user', userRouter)
app.use('/posts', postsRouter)

// migrate().catch(console.error);

app.listen(PORT, () => {
    console.log(`listining on port : ${PORT}`)
})
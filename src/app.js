import express from 'express'
import dotenv from 'dotenv'
import userRouter from './routes/User.routes.js'
import chatRouter from './routes/Chat.routes.js'
import connectDB from './database/mongoDB.js'
import cors from 'cors'

dotenv.config()

const app = express()

app.use(cors());
app.use(express.json())

app.use('/v0/api/user', userRouter)
app.use('/v0/api/chat', chatRouter)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
});

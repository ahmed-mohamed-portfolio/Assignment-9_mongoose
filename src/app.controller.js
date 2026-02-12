
import express from 'express'
import { databaseConnection } from './database/connection.js'
import userRouter from './modules/users.controller.js'
import { PORT } from '../config/index.js'


export const bootstrap = async () => {

    //express
    const app = express()
    app.use(express.json())
    app.use('/users',userRouter)


    await databaseConnection()

    app.use((error, req, res, next) => {
        res.json({ message: "something went wrong", error: error.message })
    })
    

    //express server listen
    app.listen(PORT, () => {
        console.log(`server is running in port ${PORT}`);
    })
}

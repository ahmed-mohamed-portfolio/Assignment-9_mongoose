
import express from 'express'
import { databaseConnection } from './database/connection.js'

import userRouter from './modules/users.controller.js'

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
    app.listen(3000, () => {
        console.log("server is running in port 3000");
    })
}
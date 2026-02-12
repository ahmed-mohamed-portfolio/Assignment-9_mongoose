
import express from 'express'
import { databaseConnection } from './database/connection.js'
import authRouter from './modules/auth/auth.controller.js'
import { PORT } from '../config/index.js'
import { globalErrorHandler } from './common/utils/responce/index.js'


export const bootstrap = async () => {

    //express
    const app = express()
    app.use(express.json())
    app.use('/auth',authRouter)


    await databaseConnection()

    app.use('{*dummy}', (req, res) => res.status(404).json('invalid route'))

    app.use(globalErrorHandler)


    //express server listen
    app.listen(PORT, () => {
        console.log(`server is running in port ${PORT}`);
    })
}

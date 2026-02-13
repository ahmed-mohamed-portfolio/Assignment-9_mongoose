import { Router } from "express";
import { SuccessResponse } from "../../common/utils/responce/index.js";
import { signup , login, updateLoggedInUser, deleteLoggedInUser, getLoggedInUser} from './users.service.js'

const router = Router()


router.post('/signup', async (req, res) => {
    let addedUser = await signup(req.body)
    return SuccessResponse({res,message :'user added',status:201,data:addedUser})

})


router.post('/login', async (req, res) => {
    let loginUser = await login(req.body)
    return SuccessResponse({res,message :'user login successfully ',status:200,data:loginUser})

})


router.patch('/', async (req, res) => {
    let updatedUser = await updateLoggedInUser(req.headers,req.body)
    return SuccessResponse({ res, message: 'User updated', status: 200, data: updatedUser })
})


router.delete('/', async (req, res) => {
   await deleteLoggedInUser(req.headers)
   return SuccessResponse({ res, message: 'User deleted', status: 200 })
})


router.get('/', async (req, res) => {
    const user = await getLoggedInUser(req.headers)
    return SuccessResponse({ res, message: 'done', status: 200, data: user })
})



export default router

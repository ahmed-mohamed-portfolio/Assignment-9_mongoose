import { ConflictException, NotFoundException } from '../../common/utils/responce/index.js'
import { userModel } from '../../database/index.js'
import { hash, compare } from 'bcrypt'
import { SALT, secret } from './../../../config/index.js'
import { createHmac } from 'node:crypto'
import jwt from 'jsonwebtoken'

export const signup = async (data) => {
    let { name, email, password, phone } = data

    let existUser = await userModel.findOne({ email })
    if (existUser) {
        return ConflictException({ message: "User Already Exists" })
    }

    let hashedPassword = await hash(password, Number(SALT))


    const phoneHash = createHmac('sha256', secret)
        .update(phone)
        .digest('hex');

    let addedUser = await userModel.insertOne({ name, email, password: hashedPassword, phone: phoneHash })
    return addedUser
}



export const login = async (data) => {

    let { email, password } = data

    let existUser = await userModel.findOne({ email })
    if (existUser) {
        const isMatched = await compare(password, existUser.password)
        if (isMatched) {
            let token = jwt.sign({ id: existUser._id }, 'route', { expiresIn: " 1h " })
            return { token }
        }
    }

    return NotFoundException({ message: "Invalid email or password" })

}


export const updateLoggedInUser = async (headers)=>{

  let decode = jwt.verify(headers.authorization,'route')
console.log(decode);

//   let userData = await userModel.findById()

}

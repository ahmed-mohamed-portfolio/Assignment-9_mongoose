import { ConflictException, NotFoundException, UnauthorizedException } from '../../common/utils/responce/index.js'
import { userModel } from '../../database/index.js'
import { hash, compare } from 'bcrypt'
import { SALT, secret } from './../../../config/index.js'
import { createHmac } from 'node:crypto'
import jwt from 'jsonwebtoken'



const tokenDecodeAndCheck = (headers) => {
    const auth = headers?.authorization;
    if (!auth) return UnauthorizedException({ message: "Token is required" });

    let decoded;
    try {
       return decoded = jwt.verify(auth, secret);
       
    } catch {
        return UnauthorizedException({ message: "Invalid token" });
    }
}



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
            let token = jwt.sign({ id: existUser._id }, secret, { expiresIn: "1h" })
            return { token }
        }
    }

    return NotFoundException({ message: "Invalid email or password" })

}


export const updateLoggedInUser = async (headers, data) => {
    let { name, email, age } = data

      let decoded = tokenDecodeAndCheck(headers)


    if (await userModel.findById(decoded.id)) {

        if (email) {
            if (await userModel.findOne({ email })) {
                return ConflictException({ message: "email already exist" })
            }
        }


        try {
            await userModel.findByIdAndUpdate(decoded.id, { name, email, age })
            return { message: "user updated" }
        } catch (error) {
            console.log(error);
        }


    }

    return NotFoundException({ message: "user not found" })

}




export const deleteLoggedInUser = async (headers) => {


   let decoded = tokenDecodeAndCheck(headers)


    if (await userModel.findById(decoded.id)) {

        try {
            await userModel.findByIdAndDelete(decoded.id)
            return { message: "user deleted" }
        } catch (error) {
            console.log(error);
        }

    }


    return NotFoundException({ message: "user not found" })
}

import { secret } from "../../../config/index.js";
import { UnauthorizedException } from "../utils/responce/index.js";
import jwt from 'jsonwebtoken'


export const tokenDecodeAndCheck = (headers) => {
    const auth = headers?.authorization;
    if (!auth) return UnauthorizedException({ message: "Token is required" });

    let decoded;
    try {
        return decoded = jwt.verify(auth, secret);

    } catch {
        return UnauthorizedException({ message: "Invalid token" });
    }
}
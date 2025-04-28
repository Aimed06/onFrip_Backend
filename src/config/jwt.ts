import { User, UserRole } from "../api/entities/User.entity";
import jwt, { Secret } from 'jsonwebtoken';
import app from "../api/app"

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

interface JwtPayload {
    id?: number
    email?: string
}

export class JwtService {

    static #generateJWT(data: any) {
        return jwt.sign(data, JWT_SECRET_KEY as string);
    }

    static #verifyToken(token: string) {
        return jwt.verify(token, JWT_SECRET_KEY as string) as JwtPayload;
    }

    public static generateAuthToken(user: User) {
        return this.#generateJWT({ id: user.id });
    }

  

    public static verifyAuthToken(authToken: string) {
        return this.#verifyToken(authToken).id;
    }

   

    public static generateRegistrationToken(email: string) {
        return this.#generateJWT({ email: email });
    }

    public static verifyRegistrationToken(registrationToken: string) {
        const token: any = this.#verifyToken(registrationToken);
        return {
            email: token.email
        };
    }

}


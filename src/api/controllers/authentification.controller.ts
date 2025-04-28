import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/users.service";
import { UserAuthentificationService } from "../services/authentification.service";
import UsersController from "./users.controller";
import { JwtService } from "../../config/jwt";
import { HttpErrors } from "../errors/httpErrors";

export class AuthentificationController {

    // ----------------------------------- Send Secret Code -----------------------------------
    public static async sendSecretCode(req: Request, res: Response, next: NextFunction) {
        try {
            const { email } = req.body;
            if (!email) throw new HttpErrors.Forbidden("Email is required");

            // TODO : remttre en place l'envoi de code OTP en production
            // Je l'ai enlever juste pour ne pas envoyé des emails à chaque fois
            // pendant le développement et les tests
            await UserAuthentificationService.sendSecretCode(email);

            res.json({
                email,
                message: "Code OTP envoyé"
            });
        } catch (error) {
            next(error);
        }
    }

    // ----------------------------------- Verify Secret -----------------------------------
    public static async verifySecretCode(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, code } = req.body;
            if (!email || !code) throw new HttpErrors.BadRequest("Email and code are required");

            const { token, isRegistred, user } = await UserAuthentificationService.login(email, code);

            res.json({ 
                success: true,
                isRegistred,
                user,
                token,
            });
        } catch (error) {
            next(error);
        }
    }

    // ----------------------------------- Register user -----------------------------------
    public static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const registrationToken = req.body.registrationToken;
            if (!registrationToken) throw new HttpErrors.Unauthorized('Registration token non fourni');

            const { lastName, firstName, phone } = req.body;

            if (!lastName || !firstName || !phone) throw new HttpErrors.BadRequest('Tous les champs sont obligatoires');

            const { user, authToken } = await UserAuthentificationService.register(registrationToken, {
                firstName,
                lastName,
                phone
            });

            res.json({
                message: "User registered",
                user,
                authToken
            });
        } catch (error) {
            next(error);
        }
    }

    // ----------------------------------- Logout user -----------------------------------
    public static async logout(req: Request, res: Response, next: NextFunction) {
        try {
            res.clearCookie('authToken');
            res.json({
                message: "User logged out"
            });
        } catch (error) {
            next(error);
        }
    }

    // ----------------------------------- Get authenticated user -----------------------------------
    public static async me(req: Request, res: Response, next: NextFunction) {
        try {
            const authToken = req.headers.authorization?.split(' ')[1];
            if (!authToken) throw new HttpErrors.Unauthorized('Unauthenticated user');

            const userId = await JwtService.verifyAuthToken(authToken);
            if (!userId) throw new HttpErrors.Unauthorized(`User not found`);

            const user = await UserService.findOne(userId);

            res.json({
                user
            });
        } catch (error) {
            next(error);
        }
    }

    public static async authenticateWithGoogle(req: Request, res: Response, next: NextFunction) {
        try {

            const { access_token } = req.body;
            if (!access_token) throw new HttpErrors.BadRequest('Code is required');

            const { token, isRegistred, user, userDetails } = await UserAuthentificationService.googleAuth(access_token);

            res.json({
                success: true,
                isRegistred,
                user,
                token,
                userDetails
            });
        } catch (error) {
            next(error);
        }
    }

}


export default AuthentificationController;
import { Request, Response, NextFunction } from "express";
import { AuthentificationController } from "../controllers/authentification.controller";
import { HttpErrors } from "../errors/httpErrors";
import { JwtService } from "../../config/jwt";
import { UserService } from "../services/users.service";

export async function UserGuard(req: Request, res: Response, next: NextFunction) {
    try {
        const authToken = req.headers.authorization?.split(' ')[1];
        if (!authToken) throw new HttpErrors.Unauthorized('Unauthenticated user');

        const userId = await JwtService.verifyAuthToken(authToken);
        if (!userId) throw new HttpErrors.Unauthorized(`Invalid user token`);

        const user = await UserService.findOne(userId);
        if (!user) throw new HttpErrors.Forbidden('User not found');
        
        res.locals.user = user;
        next();
    } catch (error) {
        next(error);
    }
}

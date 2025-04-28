import { NextFunction, Response, Request } from "express"

import { HttpError } from "./httpErrors";

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof HttpError) {
        res.status(err.status).json({
            success: false,
            message: err.message
        });
    } else {
        console.log(err);
        res.status(500).json({
            sucess: false,
            message: err.message
        });
    }
}
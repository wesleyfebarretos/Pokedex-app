import { NextFunction, Request, Response } from "express";
import { ApiError } from "../helpers/api-errors";

export const errorMiddleware = (
    error: Error & Partial<ApiError>,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
) => {
    console.log(error);
    const statusCode = error.statusCode ?? 500;
    const message = error.statusCode ? error.message : "Internal server error";
    return res.status(statusCode).json({ message });
};

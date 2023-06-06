import { StatusCodes } from "http-status-codes";

export class ApiError extends Error {
    public readonly statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

export class BadRequestError extends ApiError {
    constructor(message: string) {
        super(message, StatusCodes.BAD_REQUEST);
    }
}

export class UnauthorizedRequestError extends ApiError {
    constructor(message: string) {
        super(message, StatusCodes.UNAUTHORIZED);
    }
}

export class NotFoundError extends ApiError {
    constructor(message: string) {
        super(message, StatusCodes.NOT_FOUND);
    }
}

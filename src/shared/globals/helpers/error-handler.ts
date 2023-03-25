import http_status from "http-status-codes";

export interface IErrorResponse {
  status: number;
  message: string;
  serializeError(): IError;
}

export interface IError {
  status: number;
  message: string;
}

export abstract class CustomError extends Error implements IErrorResponse {
  abstract status: number;
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }
  serializeError(): IError {
    return {
      status: this.status,
      message: this.message,
    };
  }
}

export class BadRequestError extends CustomError {
  status = http_status.BAD_REQUEST;
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

export class NotFoundError extends CustomError {
  status = http_status.NOT_FOUND;
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class InternalServerError extends CustomError {
  status = http_status.INTERNAL_SERVER_ERROR;
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}

export class UnauthorizedError extends CustomError {
  status = http_status.UNAUTHORIZED;
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export class ForbiddenError extends CustomError {
  status = http_status.FORBIDDEN;
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

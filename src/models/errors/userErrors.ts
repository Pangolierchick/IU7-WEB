export class WrongPasswordOrLoginError extends Error {
  constructor() {
    super("Wrong password or login.");
    this.name = "WrongPasswordOrLoginError";
  }
}

export class UserNotFound extends Error {
  constructor(userId?: number | string) {
    super(`User ${userId ?? ""} not found`);
    this.name = "UserNotFound";
  }
}

export class InvalidJWT extends Error {
  constructor(msg?: string) {
    super(msg ?? "Invalid JWT");
    this.name = "InvalidJWT";
  }
}

export class JWTExpired extends Error {
  constructor() {
    super("JWT expired");
    this.name = "JWTExpired";
  }
}

export class UserAlreadyExistError extends Error {
  constructor() {
    super("User already exist");
    this.name = "UserAlreadyExistError";
  }
}

export class UserIsNotAdminError extends Error {
  constructor(userId?: string) {
    super(`User ${userId ?? ""} is not an admin`);
    this.name = "UserIsNotAdminError";
  }
}

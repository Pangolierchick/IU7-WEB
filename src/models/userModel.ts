import * as jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { Hash } from "../hash";
import { INITIAL_SCORE, IUser, UserRole } from "../interfaces/IUser";
import { IUserRepository } from "../interfaces/IUserRepository";
import {
  InvalidJWT,
  JWTExpired,
  UserNotFound,
  WrongPasswordOrLoginError,
} from "./errors/userErrors";

const verifyToken = (token: string, secret: string) => {
  return new Promise<jwt.JwtPayload>((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded as jwt.JwtPayload);
      }
    });
  });
};

const signToken = (
  payload: string | object | Buffer,
  secret: jwt.Secret,
  options: jwt.SignOptions
) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        reject(err);
      }
      resolve(token as string);
    });
  });
};

interface IUserTokenPayload {
  userId: string;
}

class UserBuilder {
  public static async buildUser(
    login: string,
    password: string
  ): Promise<IUser> {
    return {
      id: uuidv4(),
      login: login,
      password: await Hash.hashAsync(password),
      score: INITIAL_SCORE,
      role: UserRole.User,
    };
  }

  public static async buildAdmin(
    login: string,
    password: string
  ): Promise<IUser> {
    return {
      id: uuidv4(),
      login: login,
      password: await Hash.hashAsync(password),
      score: INITIAL_SCORE,
      role: UserRole.Admin,
    };
  }
}

export class userModel {
  private _userRepository: IUserRepository;

  constructor(userRepo: IUserRepository) {
    this._userRepository = userRepo;
  }

  private getSecret() {
    const secretKey = process.env.SECRET_KEY;

    if (secretKey === undefined) {
      throw new Error("Secret key was not found");
    }

    return secretKey;
  }

  public async checkUser(id: string) {
    const user = await this._userRepository.get(id);

    return !!user;
  }

  public async loginUser(login: string, password: string) {
    const user = await this._userRepository.getByLogin(login);

    if (user === null) {
      throw new WrongPasswordOrLoginError();
    }

    if (!(await Hash.compare(password, user.password))) {
      throw new WrongPasswordOrLoginError();
    }

    const secretKey = this.getSecret();

    const token = await signToken({ userId: user.id }, secretKey, {
      expiresIn: "8h",
    });

    return token;
  }

  public async authenticateUser(token: string) {
    const secretKey = this.getSecret();

    try {
      const { userId } = (await verifyToken(
        token,
        secretKey
      )) as IUserTokenPayload;

      if ((await this.checkUser(userId)) === false) {
        throw new UserNotFound(userId);
      }

      return userId;
    } catch (e) {
      if (e instanceof jwt.TokenExpiredError) {
        throw new JWTExpired();
      } else if (e instanceof jwt.JsonWebTokenError) {
        throw new InvalidJWT(e.message);
      } else {
        throw new Error("Unknown jwt error");
      }
    }
  }

  public async addUser(login: string, password: string) {
    const user = await UserBuilder.buildUser(login, password);
    await this._userRepository.create(user);

    return user.id;
  }

  public async addAdmin(login: string, password: string) {
    const admin = await UserBuilder.buildAdmin(login, password);
    await this._userRepository.create(admin);

    return admin.id;
  }

  public async getUsersWithFilters(filters: Partial<IUser>) {
    return await this._userRepository.getWithFilter(filters);
  }

  public async updateUser(newUser: IUser) {
    const user = await this._userRepository.get(newUser.id);

    if (user === null) {
      throw new UserNotFound(newUser.id);
    }

    await this._userRepository.update(newUser);
  }
}

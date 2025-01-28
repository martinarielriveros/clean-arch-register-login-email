import jwt, { SignOptions } from "jsonwebtoken";
import { envs } from "./envs";
import { CustomError } from "../domain";

const options: SignOptions = {
  // expiresIn: envs.JWT_EXPIRES_IN,
  algorithm: "HS256", //* this is default. Others: RS256 (asymmetric), ES256 (Asymentric),etcDefault symmetric algorithm,
};

export class JwtAdapter {
  constructor(private readonly JWT_SECRET: string) {}
  public async generateToken(payload: any) {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, this.JWT_SECRET, options, (error, token) => {
        if (error) {
          reject(
            CustomError.serverError(
              `Failed to generate token ${error.message || "Unknown error"}`
            )
          ); // Provide error details
        } else {
          resolve(token); // Return the token
        }
      });
    });
  }
  public async validateToken(
    token: string
  ): Promise<string | jwt.JwtPayload | undefined> {
    //* the return type specified is because:
    //* The reject() method is handled in the response in the try catch
    //* Here, decoded can be:

    //* string or jwt.JwtPayload if the token is valid,
    //* undefined if the token is invalid.

    return new Promise((resolve, reject) => {
      jwt.verify(token, this.JWT_SECRET, (error, decoded) => {
        if (error) {
          reject(
            CustomError.unAuthorized(
              `Failed to validate token ${error.message || "Unknown error"}`
            )
          );
        } else {
          resolve(decoded);
        }
      });
    });
  }
}

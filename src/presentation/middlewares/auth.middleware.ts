import { NextFunction, Request, Response } from "express";
import { CustomError, UserEntity } from "../../domain";
import { envs, JwtAdapter } from "../../config";
import { userModel } from "../../data";

export class AuthMiddleWare {
  static async validateJWT(req: Request, res: Response, next: NextFunction) {
    const authorization = req.header("Authorization");
    try {
      if (!authorization || !authorization.startsWith("Bearer "))
        throw CustomError.unAuthorized(
          "No token provided or Bearer not specified"
        );

      const token = authorization.replace("Bearer ", "");
      const jwtAdapter = new JwtAdapter(envs.JWT_SECRET);

      const payload = await jwtAdapter.validateToken(token);

      if (typeof payload !== "string" && typeof payload !== undefined) {
        const user = await userModel.findById(payload!.id);

        req.body.user = UserEntity.fromObject({ user });
        next();
      }
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  }
}

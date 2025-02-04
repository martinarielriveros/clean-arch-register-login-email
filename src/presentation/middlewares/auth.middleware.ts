import { NextFunction, Request, Response } from "express";
import { CustomError, UserEntity } from "../../domain";
import { envs, JwtAdapter } from "../../config";
import { UserModel } from "../../data";

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
      //* payload object { id: '679aa75cbac6a33a111c184f', iat: 1738188636 }

      if (typeof payload !== "string" && typeof payload !== undefined) {
        const user = await UserModel.findById(payload!.id);

        //* user object:
        //*{
        //*  _id: new ObjectId('679aa75cbac6a33a111c184f'),
        //*  name: 'martin',
        //*  email: 'martin.riveros@hotmail.com',
        //*  emailValidated: false,
        //*  password: '$2a$10$s/7qZ6aywM4OEtLYpqvwtOnmm/e/RBwqAPVY7AXqEUq4YPzWPFyh.',
        //*  role: 'USER_ROLE',
        //*  __v: 0
        //*}

        //* Add an id property
        // if (user) {
        //   user.id = user._id;
        //   console.log("inside the if", user.toObject());
        // }
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

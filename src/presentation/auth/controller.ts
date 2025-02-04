import { Request, Response } from "express";
import { CustomError, RegisterUserDto, LoginUserDto } from "../../domain";
import { AuthService } from "../services/auth.service";

export class AuthController {
  constructor(public readonly authService: AuthService) {}

  loginUser = (req: Request, res: Response) => {
    console.log("this is req.body", req.body);

    const [loginUserDto, errorMessage] = LoginUserDto.create(req.body);
    //* DTO checks for consistency in the frontend info sent by user (no missing fields or email correctness check)

    if (errorMessage) return res.status(400).json({ errorMessage });
    //* At this point we have a VALID request format.
    //* Now the Service checks for DB realted consistency (no email duplicates check)

    this.authService.loginUser(loginUserDto!).then((resFromDto) => {
      if (resFromDto instanceof CustomError) {
        res
          .status(resFromDto.statusCode)
          .json({ errorMessage: resFromDto.message });
      } else {
        res.json(resFromDto);
      }
    });
  };
  registerUser = (req: Request, res: Response) => {
    const [registerDTO, errorMessage] = RegisterUserDto.create(req.body);

    //* DTO checks for consistency in the frontend info sent by user (no missing fields or email correctness check)
    if (errorMessage) return res.status(400).json({ errorMessage });

    //* At this point we have a VALID request format.
    //* Now the Service checks for DB realted consistency (no email duplicates check)
    this.authService.registerUser(registerDTO!).then((resFromDto) => {
      if (resFromDto instanceof CustomError) {
        res
          .status(resFromDto.statusCode)
          .json({ errorMessage: resFromDto.message });
      } else {
        res.json(resFromDto);
      }
    });
  };
  validateEmail = async (req: Request, res: Response) => {
    const tokenReceived = req.params.token;

    //* At this point we have a token sent by user, which we need to check for authenticity.
    try {
      const isValidated = await this.authService.validateEmail(tokenReceived);

      res.json({ token: isValidated });
    } catch (error) {
      if (error instanceof CustomError) {
        throw CustomError.badRequest(`Token do not match: ${error.message}`);
      } else {
        throw CustomError.serverError(
          `An error occurred while validating the token: ${error}`
        );
      }
    }
  };
}

import { BycriptAdapter, envs, JwtAdapter } from "../../config";
import { userModel } from "../../data";
import { EmailService } from "./email.service";
import {
  CustomError,
  LoginUserDto,
  RegisterUserDto,
  UserEntity,
} from "../../domain";

export class AuthService {
  constructor(private readonly emailService: EmailService) {}

  public async registerUser(registerUserDto: RegisterUserDto) {
    try {
      const user = await userModel.findOne({
        email: registerUserDto.email,
      });

      if (user) {
        throw CustomError.badRequest("Email already exists");
      }

      //* replace unhashed email with new email address hashed
      registerUserDto.password = await BycriptAdapter.hash(
        registerUserDto.password
      );

      const sendEmailVal = await this.sendEmailValidationLink(
        registerUserDto.email
      );
      const newUser = await userModel.create({
        ...registerUserDto,
        password: registerUserDto.password,
      });

      //* Showing the UserEntity without the password
      const { password, ...userEntity } = UserEntity.fromObject(newUser!);

      //* generate JWT (if failed, the reject throws exception and is catched)
      const genToken = new JwtAdapter(envs.JWT_SECRET);
      const token = await genToken.generateToken({ id: userEntity.id });

      console.log("token generated", token);

      return {
        user: { ...userEntity, password },
        token: token,
      };
    } catch (error: any) {
      // Preserve the original error if it's already a CustomError
      if (error instanceof CustomError) {
        return error; // Re-throw the original error
        // return CustomError.badRequest(error.message); // Re-throw the original error
      } else return CustomError.serverError(`${error.message}`);
    }
  }

  public async loginUser(loginUserDto: LoginUserDto) {
    try {
      const { email, password } = loginUserDto;

      //* Step 1: Find the user by email
      const user = await userModel.findOne({ email });

      if (!user) {
        throw CustomError.badRequest("No user found with that email/password");
      }

      //* Step 2: Verify the password using bcrypt.compare
      const isPasswordValid = await BycriptAdapter.compare(
        password,
        user.password
      );

      if (!isPasswordValid) {
        throw CustomError.badRequest("Invalid password, try again");
      }
      //*
      // Step 3: Return the user and token (if needed)
      //* generate JWT (if failed, the reject throws exception and is catched)
      const genToken = new JwtAdapter(envs.JWT_SECRET);
      const token = await genToken.generateToken({
        id: user!.id,
        email: user!.email,
      });

      return {
        user: { email: user.email, id: user.id },
        token: token,
      };
    } catch (error: any) {
      if (error instanceof CustomError) {
        return error;
      } else {
        return CustomError.serverError(`${error.message}`);
      }
    }
  }

  private async sendEmailValidationLink(email: string): Promise<any> {
    const jwtInstance = new JwtAdapter(envs.JWT_SECRET);

    const token = await jwtInstance.generateToken(email);

    if (token instanceof CustomError) {
      throw token;
    }

    const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
    const emailHtml = `
    <h2>Follow the link to activate your account<h2>
      <a href="${link}">Validate your email: ${email}<a>     
    `;

    const options = {
      to: email,
      subject: "Please click on the link to validate you email",
      htmlBody: emailHtml,
    };

    const isSent = await this.emailService.sendEmail(options);
    console.log(isSent);
    return isSent;
  }

  public async validateEmail(tokenReceived: string) {
    console.log("token received: ", tokenReceived);

    const genToken = new JwtAdapter(envs.JWT_SECRET);
    try {
      //* in our case, payoload is the "email" that was passed to sign()
      const payload = await genToken.validateToken(tokenReceived);
      if (payload instanceof CustomError) throw payload;
      const user = await userModel.findOne({ email: payload });
      if (!user) throw CustomError.serverError("No user found with that email");
      user.emailValidated = true;
      await user.save();

      return true;
    } catch (error) {
      if (error instanceof CustomError) throw error;
    }

    // const { email, password, token } = payload;
  }
}

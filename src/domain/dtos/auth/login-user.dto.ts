import { customRegex } from "../../../config";
import { entityType } from "../../entities/user.entity";

export class LoginUserDto {
  private constructor(
    public readonly email: string,
    public readonly password: string
  ) {}

  //* loginEntity === req.body from login controller
  static create(loginEntity: entityType): [LoginUserDto?, string?] {
    console.log("this is loginEntity", loginEntity);

    const { email, password } = loginEntity;

    if (!email || !password) {
      return [undefined, "Missing email or password"];
    }
    if (!customRegex.email.test(email))
      return [undefined, "invalid email format"];

    return [new LoginUserDto(email, password)];
  }
}

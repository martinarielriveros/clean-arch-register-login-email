import { customRegex } from "../../../config/regex-helpers";
import { entityType } from "../../entities/user.entity";

export class RegisterUserDto {
  private constructor(
    public readonly name: string,
    public readonly email: string,
    public password: string //* make readonly
  ) {}

  static create(object: entityType): [RegisterUserDto?, string?] {
    const { name, email, password } = object;

    if (!name || !email || !password) {
      return [undefined, "missing name or email or password"];
    }
    if (!customRegex.email.test(email))
      return [undefined, "invalid email format"];

    return [new RegisterUserDto(name, email, password)];
  }
}

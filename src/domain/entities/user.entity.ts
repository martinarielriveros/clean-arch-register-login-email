import { CustomError } from "../errors/custom.error";

export interface entityType {
  [prop: string]: any;
}

export class UserEntity {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    public readonly role: string[],
    public readonly emailValidated: boolean,
    public readonly img?: string
  ) {}
  static fromObject(obj: entityType) {
    const {
      _id,
      id,
      name,
      email,
      password,
      role,
      emailValidated,
      img = "",
    } = obj.user;

    if (!_id && !id) throw CustomError.badRequest("Missing id");
    if (!name) throw CustomError.badRequest("Missing name");
    if (!email) throw CustomError.badRequest("Missing email address");
    if (!password) throw CustomError.badRequest("Missing password");
    if (!role) throw CustomError.badRequest("Missing role");
    if (emailValidated === undefined)
      throw CustomError.badRequest("EmailValidates is required");

    return new UserEntity(
      _id || id,
      name,
      email,
      password,
      role,
      emailValidated,
      img
    );
  }
}

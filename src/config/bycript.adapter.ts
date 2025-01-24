import bcrypt from "bcryptjs";
import { envs } from "./envs";

export class BycriptAdapter {
  static async hash(password: string): Promise<string> {
    const salt = bcrypt.genSaltSync(Number(envs.BCRYPT_SALT_ROUNDS));
    return bcrypt.hashSync(password, salt);
  }

  static async compare(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compareSync(password, hashedPassword);
  }
}

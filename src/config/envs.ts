import "dotenv/config";
import { get } from "env-var";

export const envs = {
  PORT: get("PORT").required().asPortNumber(),
  MONGO_URL: get("MONGO_URL").required().asString(),
  MONGO_DB_NAME: get("MONGO_DB_NAME").required().asString(),

  JWT_SECRET: get("JWT_SECRET").required().asString(),
  JWT_EXPIRES_IN: get("JWT_EXPIRES_IN").required().asInt(),
  JWT_REFRESH_EXPIRES_IN: get("JWT_REFRESH_EXPIRES_IN").required().asString(),
  BCRYPT_SALT_ROUNDS: get("BCRYPT_SALT_ROUNDS").required(),

  SEND_EMAILS: get("SEND_EMAILS").default("false").required().asBool(),
  MAILER_SERVICE: get("MAILER_SERVICE").required().asString(),
  MAILER_EMAIL: get("MAILER_EMAIL").required().asString(),
  MAILER_SECRET_KEY: get("MAILER_SECRET_KEY").required().asString(),
  WEBSERVICE_URL: get("WEBSERVICE_URL").required().asString(),
};

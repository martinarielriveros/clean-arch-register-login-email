import { envs } from "../../../config";
import { MongoDatabase } from "../config";
import { CategoryModel, ProductModel, UserModel } from "../models";
import { seedData } from "./data";

(async () => {
  await MongoDatabase.connect({
    dbName: envs.MONGO_DB_NAME,
    mongoUrl: envs.MONGO_URL,
  });
  await main();
  await MongoDatabase.disconnect();
})();

async function main() {
  //* Erase existing records
  await Promise.all([
    CategoryModel.deleteMany({}),
    ProductModel.deleteMany({}),
    UserModel.deleteMany({}),
  ]);

  //* Create users
  const users = await UserModel.insertMany(
    await Promise.all(
      seedData.users.map(async (user) => {
        return {
          name: user.name,
          email: user.email,
          password: await user.password, // Await the hashed password
        };
      })
    )
  );

  const randomNumber = (num: number) => Math.floor(Math.random() * num);

  //* Create Categories (we need to add random users id)

  const categoriesToAdd = seedData.categories.map((category) => {
    return {
      name: category.name,
      user: users[randomNumber(seedData.users.length)].id,
    };
  });

  const categories = await CategoryModel.insertMany(categoriesToAdd);

  //* Create Products (we need to add random users ids and categories ids)
  const productsToAdd = seedData.products.map((product) => {
    return {
      ...product,
      user: users[randomNumber(seedData.users.length)].id,
      category: categories[randomNumber(seedData.categories.length)].id,
    };
  });
  const products = await ProductModel.insertMany(productsToAdd);
}

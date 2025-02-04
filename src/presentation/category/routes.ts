import { Router } from "express";
import { CategoryController } from "./controller";
import { CategoryService } from "../services";
import { AuthMiddleWare } from "../middlewares/auth.middleware";

export class CategoryRoutes {
  static get routes(): Router {
    const router = Router();
    const categoryService = new CategoryService();
    const categoryController = new CategoryController(categoryService);

    router.get(
      "/",
      [AuthMiddleWare.validateJWT],
      categoryController.getCategories
    );
    router.post(
      "/",
      [AuthMiddleWare.validateJWT],
      categoryController.createCategory
    );

    return router;
  }
}

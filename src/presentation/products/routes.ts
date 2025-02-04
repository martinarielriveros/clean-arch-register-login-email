import { Router } from "express";
import { ProductController } from "./controller";
import { ProductService } from "../services";

export class ProductsRoutes {
  static get routes(): Router {
    const router = Router();
    const productService = new ProductService();
    const productController = new ProductController(productService);

    router.get(
      "/",

      productController.getProducts
    );
    router.post(
      "/",

      productController.createProduct
    );

    return router;
  }
}

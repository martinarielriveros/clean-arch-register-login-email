import { Request, Response } from "express";
import { ProductService } from "../services";
import { CustomError, PaginationDto } from "../../domain";
import { CreateProductDto } from "../../domain/dtos/products/create-product.dto";

export class ProductController {
  constructor(public readonly productService: ProductService) {}

  getProducts = async (req: Request, res: Response) => {
    const { limit = 10, page = 1 } = req.params;
    const paginationDto = PaginationDto.createPaginationDto(+page, +limit);

    const products = await this.productService.getProducts(
      paginationDto! as unknown as PaginationDto
    );
    res.json(products);
  };

  createProduct = async (req: Request, res: Response) => {
    const [createProductDto, error] = CreateProductDto.createProduct(req.body);

    if (error)
      return res.status(error.statusCode).json({ error: error.message });

    this.productService
      .createProduct(createProductDto!)
      .then((product) => res.status(200).json(product))
      .catch((error) =>
        res.status(error.statusCode).json({ error: error.message })
      );
  };
}

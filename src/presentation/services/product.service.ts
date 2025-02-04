import { ProductModel } from "../../data";
import { CustomError, PaginationDto } from "../../domain";
import { CreateProductDto } from "../../domain/dtos/products/create-product.dto";

export class ProductService {
  public async getProducts(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;

    try {
      const [products, totalProducts] = await Promise.all([
        ProductModel.find()
          .skip((page - 1) * limit)
          .limit(limit)
          .populate(["user", "category"]), //* the referenced documents in the mongoose model

        ProductModel.countDocuments(),
      ]);
      return {
        page,
        limit,
        totalProducts,
        next: `/api/products/?page=${page + 1}&limit=${limit}`, //* TODO validate next page existence
        previous:
          page - 1 === 0
            ? `/api/products/?page=1&limit=${limit}`
            : `/api/products/?page=${page - 1}&limit=${limit}`,
        products: products.map((product) => ({
          id: product.id,
          name: product.name,
          available: product.available,
          qtty: product.qtty,
          price: product.price,
          description: product.description,
          user: product.user,
          category: product.category,
        })),
      };
    } catch (error: any) {
      return CustomError.serverError(error.message);
    }
  }

  public async createProduct(createProductDto: CreateProductDto) {
    try {
      const prod = await ProductModel.findOne({ name: createProductDto.name });
      if (prod) throw CustomError.forbidden("Product already exists");

      const product = new ProductModel({
        ...createProductDto,
      });

      await product.save();

      return product;
    } catch (error: any) {
      if (error instanceof CustomError) throw error;
      else throw CustomError.serverError(error.message);
    }
  }
}

import {
  CreateCategoryDto,
  CustomError,
  PaginationDto,
  UserEntity,
} from "../../domain";
import { CategoryModel } from "../../data/mongo/models/category.model";

export class CategoryService {
  constructor() {}

  public async createCategory(
    createCategoryDto: CreateCategoryDto,
    user: UserEntity
  ) {
    //* solving name conflict (category name crashes with user name conflict)

    try {
      const cat = await CategoryModel.findOne({ name: createCategoryDto.name });

      if (cat) throw CustomError.forbidden("Category already exists");

      const category = new CategoryModel({
        ...createCategoryDto,
        user: user.id,
      });
      await category.save();
      //* category {
      //*   name: 'chocolate',
      //*   available: false,
      //*   user: new ObjectId('679aa75cbac6a33a111c184f'),
      //*   _id: new ObjectId('679b959dc907c391c3cae6a1'),
      //*   __v: 0
      //* }
      return {
        id: category.id,
        name: category.name,
        available: category.available,
      };
    } catch (error: any) {
      if (error instanceof CustomError) return error;
      else return CustomError.serverError(error.message);
    }
  }
  public async getCategories(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    try {
      const [categories, totalCategories] = await Promise.all([
        CategoryModel.find()
          .skip((page - 1) * limit)
          .limit(limit),
        CategoryModel.countDocuments(),
      ]);
      return {
        page,
        limit,
        totalCategories,
        next: `/api/categories/?page=${page + 1}&limit=${limit}`, //* TODO validate next page existence
        previous:
          page - 1 === 0
            ? `/api/categories/?page=1&limit=${limit}`
            : `/api/categories/?page=${page - 1}&limit=${limit}`,
        categories: categories.map((category) => ({
          id: category.id,
          name: category.name,
          available: category.available,
        })),
      };
    } catch (error: any) {
      return CustomError.serverError(error.message);
    }
  }
}

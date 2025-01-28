import { Request, Response } from "express";
import { CreateCategoryDto, CustomError, PaginationDto } from "../../domain";
import { CategoryService } from "../services";

export class CategoryController {
  constructor(public readonly categoryService: CategoryService) {}

  createCategory = async (req: Request, res: Response) => {
    //* Validate input data
    const [createCategoryDto, error] = CreateCategoryDto.createCategory(
      req.body
    );

    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    try {
      this.categoryService
        .createCategory(createCategoryDto!, req.body.user)
        .then((cat) => {
          if (cat instanceof CustomError) {
            res.status(cat.statusCode).json({ error: cat.message });
          } else {
            res.status(201).json({ category: cat });
          }
        })
        .catch((error) => {
          res.status(error.statusCode || 500).json({ error: error.message });
        });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ error: error.message || "Internal server error" });
    }
  };

  getCategories = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;

    const [paginationDto, error] = PaginationDto.createPaginationDto(
      +page,
      +limit
    );

    try {
      if (error) throw CustomError.badRequest(error);
      this.categoryService
        .getCategories(paginationDto as PaginationDto)
        .then((categories) => res.status(200).json(categories));
      // .catch((err) => res.status(err.statusCode).json(err.message));
    } catch (error: any) {
      res.status(error.statusCode).json({ error: error.message });
    }
  };
}

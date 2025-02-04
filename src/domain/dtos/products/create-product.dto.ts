import { Validators } from "../../../config";
import { CustomError } from "../../errors/custom.error";

export class CreateProductDto {
  private constructor(
    public readonly name: string,
    public readonly available: boolean,
    public readonly price: number,
    public readonly qtty: number,
    public readonly image: string,
    public readonly user: string,
    public readonly category: string
  ) {}

  static createProduct(params: {
    [key: string]: any;
  }): [CreateProductDto?, CustomError?] {
    const {
      name,
      available = false,
      price,
      qtty,
      image,
      user,
      category,
    } = params;
    // Validate required fields
    if (!name || !category || !user) {
      return [
        undefined,
        CustomError.badRequest(
          "Missing required fields: name, category or user."
        ),
      ];
    }

    if (!Validators.isMongoID(user) || !Validators.isMongoID(category))
      return [
        undefined,
        CustomError.badRequest("Category and User must be valid Mongo Id"),
      ];

    // Normalize and validate the "available" field
    let booleanAvailable: boolean;
    if (typeof available === "string") {
      const lowerCaseAvailable = available.toLowerCase();
      if (lowerCaseAvailable === "true") {
        booleanAvailable = true;
      } else if (lowerCaseAvailable === "false") {
        booleanAvailable = false;
      } else {
        return [
          undefined,
          CustomError.badRequest(
            'Invalid "available" field (must be "true" or "false").'
          ),
        ];
      }
    } else if (typeof available === "boolean") {
      booleanAvailable = available;
    } else {
      return [
        undefined,
        CustomError.badRequest(
          'Invalid "available" field (must be a boolean or a string of "true"/"false").'
        ),
      ];
    }
    // Return the successfully created DTO
    return [
      new CreateProductDto(
        name,
        booleanAvailable,
        price,
        qtty,
        image,
        user,
        category
      ),
    ];
  }
}

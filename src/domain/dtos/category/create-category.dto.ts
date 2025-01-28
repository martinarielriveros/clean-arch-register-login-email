import { CustomError } from "../../errors/custom.error";

export class CreateCategoryDto {
  private constructor(readonly name: string, readonly available: boolean) {}

  static createCategory(object: {
    [bodyKey: string]: string | boolean;
  }): [CreateCategoryDto?, CustomError?] {
    const { name, available = false } = object;

    // Validate name
    if (!name || typeof name !== "string") {
      return [
        undefined,
        CustomError.badRequest("missing or invalid name (must be a string)"),
      ];
    }

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
            'invalid available field (must be "true" or "false")'
          ),
        ];
      }
    } else if (typeof available === "boolean") {
      booleanAvailable = available;
    } else {
      return [
        undefined,
        CustomError.badRequest("invalid available field (must be a boolean)"),
      ];
    }

    // Return the DTO instance
    return [new CreateCategoryDto(name, booleanAvailable)];
  }
}

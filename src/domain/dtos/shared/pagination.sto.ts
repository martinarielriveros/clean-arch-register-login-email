export class PaginationDto {
  private constructor(
    public readonly limit: number,
    public readonly page: number
  ) {}
  static createPaginationDto(
    page: number,
    limit: number
  ): [PaginationDto?, string?] {
    if (limit <= 0 || page <= 0) {
      return [undefined, "page and limit must be greater than 0"];
    }
    if (isNaN(limit) || isNaN(page))
      return [undefined, "page and limit must be a number"];
    return [new PaginationDto(limit, page)];
  }
}

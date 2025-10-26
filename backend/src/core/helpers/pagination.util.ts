export function buildPaginationParams(dto: any) {
  const page = dto.page ?? 1;
  const limit = dto.limit ?? 10;
  const skip = (page - 1) * limit;

  return { skip, take: limit, page, limit };
}

export function buildOrderBy(dto: any) {
  const sortBy = dto.sortBy ?? "createdAt";
  const order = dto.order ?? "desc";
  return { [sortBy]: order };
}

export function buildSearchFilter(dto: any, searchableFields: string[] = []) {
  if (!dto.search || searchableFields.length === 0) return undefined;

  return {
    OR: searchableFields.map((field) => ({
      [field]: { contains: dto.search, mode: "insensitive" },
    })),
  };
}

export function buildPaginationResponse(
  data: any[],
  total: number,
  page: number,
  limit: number
) {
  const totalPages = Math.ceil(total / limit);
  return {
    data,
    pagination: {
      total,
      totalPages,
      currentPage: page,
      pageSize: limit,
    },
  };
}

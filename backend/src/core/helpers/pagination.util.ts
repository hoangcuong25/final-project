import { Prisma } from "@prisma/client";

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

// Bỏ dấu tiếng Việt để tìm kiếm “mềm”
function removeVietnameseTones(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

export function buildSearchFilter(
  dto: any,
  searchableFields: string[] = []
): Prisma.CourseWhereInput | undefined {
  if (!dto.search || searchableFields.length === 0) return undefined;

  const search = String(dto.search).trim();
  const normalized = removeVietnameseTones(search.toLowerCase());

  // Tạo nhiều dạng tìm để dễ khớp hơn
  const variants = [
    search, // gốc
    search.toLowerCase(), // thường
    normalized, // bỏ dấu
  ];

  return {
    OR: searchableFields.flatMap((field) =>
      variants.map((text) => ({
        [field]: { contains: text },
      }))
    ),
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

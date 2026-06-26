export interface PageParams {
  page: number;
  pageSize: number;
}

export function toSkipTake({ page, pageSize }: PageParams) {
  return { skip: (page - 1) * pageSize, take: pageSize };
}

export function paginated<T>(items: T[], total: number, params: PageParams) {
  return { items, total, page: params.page, pageSize: params.pageSize };
}

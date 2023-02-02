export interface IPaginationOffset {
  skip?: number;
  take?: number;
}

export interface IPaginationCursor<C extends string | number = string> {
  cursor?: C;
  take?: number;
}

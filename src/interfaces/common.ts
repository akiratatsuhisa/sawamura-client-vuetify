export interface IPaginationOffset {
  skip?: number;
  take?: number;
}

export interface IPaginationCursor<Cursor extends string | number = string> {
  cursor?: Cursor;
  take?: number;
}

export interface IPaginationExcludeIds<Id extends string | number = string> {
  excludeIds?: Array<Id>;
  take?: number;
}

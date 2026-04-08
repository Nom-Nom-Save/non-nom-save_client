export interface ActionResult {
  success: boolean;
  error: string | null;
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

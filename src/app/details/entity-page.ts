import { Entity } from './entity';

export interface EntityPage {
  totalElements: number;
  pageable: Pageable;
  content: Entity[];
}

export interface Pageable {
  sort: string;
  pageNumber: number;
  pageSize: number;
}

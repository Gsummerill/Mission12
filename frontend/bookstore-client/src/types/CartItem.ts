import type { Book } from './Book';

export interface CartItem extends Book {
  quantity: number;
}

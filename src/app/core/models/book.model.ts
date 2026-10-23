export interface Author {
  id: number;
  idBook: number;
  firstName: string;
  lastName: string;
  booksCount?: number;
}

export interface Book {
  id: number;
  title: string;
  description: string;
  pageCount: number;
  excerpt: string;
  publishDate: string;
  authorId?: number;
  author?: Author;
}

import { useEffect, useMemo, useState } from 'react';
import type { Book } from '../types/Book';

const API_URL = 'https://bookstore-api-george.azurewebsites.net/api/books';

type SortOrder = 'asc' | 'desc';

interface BookListProps {
  pageNum: number;
  setPageNum: React.Dispatch<React.SetStateAction<number>>;
  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  sortOrder: SortOrder;
  setSortOrder: React.Dispatch<React.SetStateAction<SortOrder>>;
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  onAddToCart: (book: Book) => void;
  cartItemCount: number;
  cartTotal: number;
}

function BookList({
  pageNum,
  setPageNum,
  pageSize,
  setPageSize,
  sortOrder,
  setSortOrder,
  selectedCategory,
  setSelectedCategory,
  onAddToCart,
  cartItemCount,
  cartTotal
}: BookListProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [totalBooks, setTotalBooks] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/categories`);

        if (!response.ok) {
          throw new Error('Unable to load book categories.');
        }

        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong.');
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError('');

      try {
        const params = new URLSearchParams({
          pageSize: pageSize.toString(),
          pageNum: pageNum.toString(),
          sortOrder
        });

        if (selectedCategory && selectedCategory !== 'All') {
          params.append('category', selectedCategory);
        }

        const response = await fetch(`${API_URL}?${params.toString()}`);

        if (!response.ok) {
          throw new Error('Unable to load books from the API.');
        }

        const data = await response.json();
        setBooks(data.books);
        setTotalBooks(data.totalBooks);

        const updatedTotalPages = Math.max(1, Math.ceil(data.totalBooks / pageSize));
        if (pageNum > updatedTotalPages) {
          setPageNum(1);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [pageNum, pageSize, sortOrder, selectedCategory, setPageNum]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(totalBooks / pageSize)), [totalBooks, pageSize]);
  const showingFrom = totalBooks === 0 ? 0 : (pageNum - 1) * pageSize + 1;
  const showingTo = Math.min(pageNum * pageSize, totalBooks);

  return (
    <div className="card bookstore-card shadow-sm">
      <div className="card-body p-4">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-3 mb-4">
          <div>
            <h2 className="mb-1">Book Catalog</h2>
            <p className="text-muted mb-0">
              Filter by category, sort by title, and add books to a session cart.
            </p>
          </div>

          <div className="text-lg-end">
            <div className="small text-muted">Cart summary</div>
            <div className="fw-semibold">{cartItemCount} items · ${cartTotal.toFixed(2)}</div>
          </div>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPageNum(1);
              }}
            >
              <option value="All">All</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Results per page</label>
            <select
              className="form-select"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPageNum(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Sort by title</label>
            <select
              className="form-select"
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value as SortOrder);
                setPageNum(1);
              }}
            >
              <option value="asc">A to Z</option>
              <option value="desc">Z to A</option>
            </select>
          </div>
        </div>

        {loading && <div className="alert alert-info">Loading books...</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && (
          <>
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Category</th>
                    <th>Pages</th>
                    <th>Price</th>
                    <th className="text-center">Cart</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr key={book.bookId}>
                      <td>
                        <div className="fw-semibold">{book.title}</div>
                        <div className="text-muted small">{book.publisher}</div>
                        <div className="text-muted small">ISBN: {book.isbn}</div>
                      </td>
                      <td>
                        {book.author}
                        <div className="text-muted small">{book.classification}</div>
                      </td>
                      <td>{book.category}</td>
                      <td>{book.pageCount}</td>
                      <td>
                        <span className="badge text-bg-success price-pill">
                          ${book.price.toFixed(2)}
                        </span>
                      </td>
                      <td className="text-center">
                        <button className="btn btn-outline-primary btn-sm" onClick={() => onAddToCart(book)}>
                          Add to Cart
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mt-4">
              <div className="text-muted">
                Showing {showingFrom} to {showingTo} of {totalBooks} books
                {selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}
              </div>

              <nav aria-label="Book pagination">
                <ul className="pagination mb-0">
                  <li className={`page-item ${pageNum === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setPageNum((prev) => Math.max(1, prev - 1))}>
                      Previous
                    </button>
                  </li>

                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <li key={page} className={`page-item ${page === pageNum ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => setPageNum(page)}>
                        {page}
                      </button>
                    </li>
                  ))}

                  <li className={`page-item ${pageNum === totalPages ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setPageNum((prev) => Math.min(totalPages, prev + 1))}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default BookList;

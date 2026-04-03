import { useEffect, useState } from 'react';
import type { Book } from '../types/Book';
import BookForm from './BookForm';

const API_URL = 'http://localhost:5001/api/books';

const emptyBook: Book = {
  bookId: 0,
  title: '',
  author: '',
  publisher: '',
  isbn: '',
  classification: '',
  category: '',
  pageCount: 0,
  price: 0
};

function AdminBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadBooks = async () => {
    try {
      setError('');
      const response = await fetch(`${API_URL}?pageSize=1000&pageNum=1&sortOrder=asc`);

      if (!response.ok) {
        throw new Error('Unable to load books.');
      }

      const data = await response.json();
      setBooks(data.books ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleSave = async (book: Book) => {
    try {
      setError('');
      setMessage('');

      const isEditing = book.bookId > 0;
      const url = isEditing ? `${API_URL}/${book.bookId}` : API_URL;
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(book)
      });

      if (!response.ok) {
        throw new Error(isEditing ? 'Unable to update book.' : 'Unable to add book.');
      }

      setMessage(isEditing ? 'Book updated successfully.' : 'Book added successfully.');
      setEditingBook(null);
      await loadBooks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  const handleDelete = async (bookId: number) => {
    try {
      setError('');
      setMessage('');

      const response = await fetch(`${API_URL}/${bookId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Unable to delete book.');
      }

      setMessage('Book deleted successfully.');
      if (editingBook?.bookId === bookId) {
        setEditingBook(null);
      }
      await loadBooks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-1">Admin Books</h1>
          <p className="text-muted mb-0">Add, edit, and delete books from the bookstore database.</p>
        </div>
        <button className="btn btn-outline-secondary" onClick={() => setEditingBook({ ...emptyBook })}>
          Add New Book
        </button>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4">
        <div className="col-lg-5">
          <BookForm
            key={editingBook ? editingBook.bookId || -1 : -2}
            book={editingBook ?? emptyBook}
            onSave={handleSave}
            onCancel={() => setEditingBook(null)}
          />
        </div>

        <div className="col-lg-7">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h4 mb-3">Current Books</h2>
              <div className="table-responsive">
                <table className="table table-striped align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map((book) => (
                      <tr key={book.bookId}>
                        <td>{book.title}</td>
                        <td>{book.author}</td>
                        <td>{book.category}</td>
                        <td>${book.price.toFixed(2)}</td>
                        <td className="text-end">
                          <div className="btn-group btn-group-sm">
                            <button className="btn btn-outline-primary" onClick={() => setEditingBook(book)}>
                              Edit
                            </button>
                            <button className="btn btn-outline-danger" onClick={() => handleDelete(book.bookId)}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminBooks;

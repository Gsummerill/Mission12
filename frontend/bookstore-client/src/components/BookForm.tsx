import { useEffect, useState } from 'react';
import type { Book } from '../types/Book';

interface BookFormProps {
  book: Book;
  onSave: (book: Book) => Promise<void>;
  onCancel: () => void;
}

function BookForm({ book, onSave, onCancel }: BookFormProps) {
  const [formData, setFormData] = useState<Book>(book);

  useEffect(() => {
    setFormData(book);
  }, [book]);

  const handleChange = (field: keyof Book, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === 'pageCount' || field === 'price' || field === 'bookId' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h2 className="h4 mb-3">{formData.bookId > 0 ? 'Edit Book' : 'Add Book'}</h2>
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-12">
            <label className="form-label">Title</label>
            <input className="form-control" value={formData.title} onChange={(e) => handleChange('title', e.target.value)} required />
          </div>

          <div className="col-12">
            <label className="form-label">Author</label>
            <input className="form-control" value={formData.author} onChange={(e) => handleChange('author', e.target.value)} required />
          </div>

          <div className="col-md-6">
            <label className="form-label">Publisher</label>
            <input className="form-control" value={formData.publisher} onChange={(e) => handleChange('publisher', e.target.value)} required />
          </div>

          <div className="col-md-6">
            <label className="form-label">ISBN</label>
            <input className="form-control" value={formData.isbn} onChange={(e) => handleChange('isbn', e.target.value)} required />
          </div>

          <div className="col-md-6">
            <label className="form-label">Classification</label>
            <input className="form-control" value={formData.classification} onChange={(e) => handleChange('classification', e.target.value)} required />
          </div>

          <div className="col-md-6">
            <label className="form-label">Category</label>
            <input className="form-control" value={formData.category} onChange={(e) => handleChange('category', e.target.value)} required />
          </div>

          <div className="col-md-6">
            <label className="form-label">Page Count</label>
            <input type="number" className="form-control" value={formData.pageCount} onChange={(e) => handleChange('pageCount', e.target.value)} required min="1" />
          </div>

          <div className="col-md-6">
            <label className="form-label">Price</label>
            <input type="number" step="0.01" className="form-control" value={formData.price} onChange={(e) => handleChange('price', e.target.value)} required min="0" />
          </div>

          <div className="col-12 d-flex gap-2">
            <button className="btn btn-primary" type="submit">Save Book</button>
            <button className="btn btn-outline-secondary" type="button" onClick={onCancel}>Clear</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookForm;

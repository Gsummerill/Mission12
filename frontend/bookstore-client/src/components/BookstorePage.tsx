import { useEffect, useMemo, useState } from 'react';
import BookList from './BookList';
import CartSummary from './CartSummary';
import type { Book } from '../types/Book';
import type { CartItem } from '../types/CartItem';

const CART_STORAGE_KEY = 'mission12-cart';
const PAGE_STORAGE_KEY = 'mission12-page';
const PAGE_SIZE_STORAGE_KEY = 'mission12-pageSize';
const SORT_STORAGE_KEY = 'mission12-sortOrder';
const CATEGORY_STORAGE_KEY = 'mission12-category';

function BookstorePage() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = sessionStorage.getItem(CART_STORAGE_KEY);
    return savedCart ? (JSON.parse(savedCart) as CartItem[]) : [];
  });

  const [pageNum, setPageNum] = useState<number>(() => {
    const savedPage = Number(sessionStorage.getItem(PAGE_STORAGE_KEY));
    return savedPage > 0 ? savedPage : 1;
  });

  const [pageSize, setPageSize] = useState<number>(() => {
    const savedPageSize = Number(sessionStorage.getItem(PAGE_SIZE_STORAGE_KEY));
    return savedPageSize > 0 ? savedPageSize : 5;
  });

  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(() => {
    const savedSort = sessionStorage.getItem(SORT_STORAGE_KEY);
    return savedSort === 'desc' ? 'desc' : 'asc';
  });

  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    return sessionStorage.getItem(CATEGORY_STORAGE_KEY) || 'All';
  });

  useEffect(() => {
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    sessionStorage.setItem(PAGE_STORAGE_KEY, String(pageNum));
  }, [pageNum]);

  useEffect(() => {
    sessionStorage.setItem(PAGE_SIZE_STORAGE_KEY, String(pageSize));
  }, [pageSize]);

  useEffect(() => {
    sessionStorage.setItem(SORT_STORAGE_KEY, sortOrder);
  }, [sortOrder]);

  useEffect(() => {
    sessionStorage.setItem(CATEGORY_STORAGE_KEY, selectedCategory);
  }, [selectedCategory]);

  const addToCart = (book: Book) => {
    setCart((prevCart) => {
      const existingBook = prevCart.find((item) => item.bookId === book.bookId);

      if (existingBook) {
        return prevCart.map((item) =>
          item.bookId === book.bookId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [...prevCart, { ...book, quantity: 1 }];
    });
  };

  const increaseQuantity = (bookId: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.bookId === bookId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (bookId: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.bookId === bookId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (bookId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.bookId !== bookId));
  };

  const cartItemCount = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart]
  );

  const cartTotal = useMemo(
    () => cart.reduce((total, item) => total + item.price * item.quantity, 0),
    [cart]
  );

  return (
    <div>
      <div className="row g-4 align-items-start">
        <div className="col-lg-8">
          <BookList
            pageNum={pageNum}
            setPageNum={setPageNum}
            pageSize={pageSize}
            setPageSize={setPageSize}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onAddToCart={addToCart}
            cartItemCount={cartItemCount}
            cartTotal={cartTotal}
          />
        </div>

        <div className="col-lg-4">
          <div className="sticky-top cart-sticky">
            <CartSummary
              cart={cart}
              total={cartTotal}
              onIncrease={increaseQuantity}
              onDecrease={decreaseQuantity}
              onRemove={removeFromCart}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookstorePage;

import type { CartItem } from '../types/CartItem';

interface CartSummaryProps {
  cart: CartItem[];
  total: number;
  onIncrease: (bookId: number) => void;
  onDecrease: (bookId: number) => void;
  onRemove: (bookId: number) => void;
}

function CartSummary({ cart, total, onIncrease, onDecrease, onRemove }: CartSummaryProps) {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="card shadow-lg border-start border-4 border-primary">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="h4 mb-1">Shopping Cart</h2>
            <p className="text-muted mb-0">Session-based cart summary</p>
          </div>
          <span className="badge text-bg-primary rounded-pill px-3 py-2">
            {totalItems} item{totalItems === 1 ? '' : 's'}
          </span>
        </div>

        {cart.length === 0 ? (
          <div className="alert alert-light border mb-0">
            Your cart is empty. Add a book to get started.
          </div>
        ) : (
          <>
            <div className="list-group mb-3">
              {cart.map((item) => {
                const subtotal = item.price * item.quantity;

                return (
                  <div key={item.bookId} className="list-group-item py-3">
                    <div className="d-flex justify-content-between gap-3">
                      <div>
                        <h3 className="h6 mb-1">{item.title}</h3>
                        <div className="text-muted small">
                          ${item.price.toFixed(2)} each
                        </div>
                        <div className="small mt-1">
                          Subtotal: <strong>${subtotal.toFixed(2)}</strong>
                        </div>
                      </div>

                      <div className="text-end">
                        <div className="btn-group btn-group-sm mb-2" role="group" aria-label="Quantity controls">
                          <button className="btn btn-outline-secondary" onClick={() => onDecrease(item.bookId)}>-</button>
                          <span className="btn btn-light disabled">{item.quantity}</span>
                          <button className="btn btn-outline-secondary" onClick={() => onIncrease(item.bookId)}>+</button>
                        </div>
                        <div>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => onRemove(item.bookId)}>
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-top pt-3">
              <div className="d-flex justify-content-between mb-2">
                <span>Total quantity</span>
                <strong>{totalItems}</strong>
              </div>
              <div className="d-flex justify-content-between fs-5">
                <span>Total</span>
                <strong>${total.toFixed(2)}</strong>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CartSummary;

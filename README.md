# Mission 12 - George Summerill

This project extends Mission 11 by adding category filtering, a session-based shopping cart, cart totals, a continue-shopping experience through persisted page/category state, and a Bootstrap grid layout.

## Run the backend

```bash
cd backend/BookstoreApi
dotnet run
```

## Run the frontend

```bash
cd frontend/bookstore-client
npm install
npm run dev
```

## Bootstrap features added for Mission 12

- Bootstrap Grid: `row`, `col-lg-8`, `col-lg-4`, and `g-4` are used to arrange the book list and cart summary.
- Additional Bootstrap features not previously used: `sticky-top` keeps the cart visible while browsing, and `border-start border-4 border-primary` gives the cart panel a highlighted edge.

The comments describing these Bootstrap additions are placed in `src/components/BookstorePage.tsx`.

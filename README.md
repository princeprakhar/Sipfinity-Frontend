# Sipfinity Frontend

Sipfinity is a modern inventory and product management web application. This repository contains the **frontend** codebase, built with React, Redux Toolkit, RTK Query, and TypeScript. It provides a responsive, theme-aware user interface for browsing, filtering, reviewing, and managing products.

---

## Features

- **Authentication:** Sign up, sign in, password reset, JWT-based protected routes.
- **Product Browsing:** Paginated, filterable product grid with masonry layout.
- **Product Details:** Modal with images, description, reviews, and user interactions (like/dislike).
- **Reviews:** Add, like/dislike, and flag reviews for products.
- **Admin Panel:** Manage products, categories, and view product stats.
- **Profile Management:** View and edit user profile, change password.
- **Theme Support:** Light/dark mode toggle.
- **Responsive Design:** Works well on desktop and mobile.

---

## Tech Stack

- **React** (with hooks)
- **Redux Toolkit** (global state management)
- **RTK Query** (data fetching & caching)
- **TypeScript** (type safety)
- **Tailwind CSS** (styling)
- **React Router** (routing)
- **React Toastify** (notifications)
- **Lucide Icons** (iconography)

---

## Project Structure

```
src/
  components/      # Reusable UI and feature components
  pages/           # Route-level pages (Dashboard, Items, Admin, Profile, Auth)
  services/        # RTK Query API slices (product, review, auth, etc.)
  store/           # Redux slices and store setup
  hooks/           # Custom hooks
  types/           # TypeScript types
  config/          # API endpoints and config
  data/            # Mock data (for development)
  utils/           # Utility functions
  App.tsx          # Main app component
  main.tsx         # Entry point
  index.css        # Global styles
```

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

```bash
git clone https://github.com/your-org/sipfinity-frontend.git
cd sipfinity-frontend
npm install
```

### Running the App

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

---

## Environment Variables

Configure API endpoints in `src/config/api.ts`.  
You may need to set up a `.env` file for backend URLs if required.

---

## Key Files

- `src/pages/ItemsPage.tsx` — Main product browsing page.
- `src/components/items/ItemDetailModal.tsx` — Product detail modal with reviews and interactions.
- `src/services/reviewService.ts` — RTK Query API for reviews and reactions.
- `src/store/slices/productSlice.ts` — Redux slice for product state.
- `src/components/admin/ProductModal.tsx` — Admin product add/edit modal.

---

## Customization

- **Theme:** Change default theme in Redux slice or via UI toggle.
- **API:** Update endpoints in `src/config/api.ts` to match your backend.
- **Icons:** Uses [Lucide](https://lucide.dev/) for icons.

---

## Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/foo`)
3. Commit your changes (`git commit -am 'Add foo feature'`)
4. Push to the branch (`git push origin feature/foo`)
5. Create a Pull Request

---

## License

MIT

---

## Credits

Developed by Prakhar Deep.

---


## Support

For issues, open a [GitHub Issue](https://github.com/princeprakhar/Sipfinity-Frontend/issues).

---

**Note:**  
This is the frontend part. You need the Sipfinity backend running for full functionality.

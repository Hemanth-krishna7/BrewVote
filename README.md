# BrewVote

BrewVote is a production-ready, coffee discovery and voting platform designed with a clean monorepo architecture separating the React frontend (`client`) and the Node.js/Express backend (`server`).

## Project Stack

* **Frontend**: React, Vite, Tailwind CSS v4, React Router DOM, Axios
* **Backend**: Node.js, Express.js
* **Database**: MongoDB Atlas via Mongoose

## Monorepo Architecture

```
BrewVote/
├── client/                 # React frontend (Vite, Tailwind v4)
│   ├── src/
│   │   ├── assets/         # Static assets
│   │   ├── components/     # Reusable UI components (Navbar, Footer, ProtectedRoute)
│   │   ├── context/        # React Contexts (AuthContext)
│   │   ├── hooks/          # Custom react hooks (useFetch)
│   │   ├── pages/          # Page layouts (Home, Login, Register, CoffeeDetails, AdminDashboard)
│   │   ├── services/       # Service layers for API (api, authService, coffeeService, voteService)
│   │   ├── App.jsx         # App routes and Layout
│   │   ├── main.jsx        # App entrypoint
│   │   └── index.css       # Tailwind CSS v4 styling
│   └── package.json
├── server/                 # Express backend
│   ├── config/             # DB connections and environment configurations
│   ├── constants/          # Application-wide constants
│   ├── controllers/        # Request handlers (auth, coffee, votes, analytics)
│   ├── middleware/         # Custom Express middlewares (errorHandler, authMiddleware)
│   ├── models/             # Mongoose database models (User, Coffee, Vote)
│   ├── routes/             # Router declarations
│   ├── utils/              # Common utility functions
│   ├── validators/         # Request validation logic
│   ├── server.js           # Server application starter
│   └── package.json
├── package.json            # Root workspace config
├── .gitignore              # Files to ignore in Git
└── README.md               # Project documentation
```

## Quick Start

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation
Run the following command in the root folder to install all root, client, and server dependencies:
```bash
npm install
```

### Run in Development
Start both frontend and backend development servers concurrently:
```bash
npm run dev
```

### Production Build
Build the frontend client for production:
```bash
npm run build
```

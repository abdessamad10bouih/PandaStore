# 🐼 PandaStore

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)

PandaStore is a modern full-stack e-commerce platform built with React, Node.js, and MongoDB. The platform offers a comprehensive admin dashboard for managing products, categories, suppliers, and promotional posts. With a responsive design and intuitive user interface, PandaStore provides businesses with powerful tools to showcase and sell their products online. This README outlines the architecture, features, setup process, and usage instructions for the application.

## 🎯 Key Features

PandaStore offers a comprehensive suite of features for e-commerce management:

- 🛒 **Product Management**: Create, update, and delete products with detailed specifications, pricing, and inventory tracking
- 🏷️ **Category System**: Hierarchical category management with subcategories support
- 📢 **Promotional Posts**: Create marketing posts with associated products and countdown timers
- 🏬 **Supplier Management**: Track and manage supplier information with contact details
- 🔐 **User Authentication**: Secure user registration and login system with JWT tokens
- 🎨 **Responsive Design**: Mobile-first approach with desktop optimization
- 🔍 **Advanced Search**: Product and supplier search functionality
- 📊 **Administrative Dashboard**: Comprehensive overview with sales analytics
- 🖼️ **Image Upload**: Product and category image management via Cloudinary
- 🛍️ **Frontend Storefront**: Customer-facing store with product browsing
- 🔧 **Admin Portal**: Dedicated interface for site administration

## ⚙️ Technology Stack

PandaStore leverages modern web technologies for both frontend and backend development:

### **Frontend**
- React 19 with Vite
- Tailwind CSS & shadcn/ui components
- Recharts for data visualization
- React Router for navigation
- Axios for API calls
- Lucide React for icons
- Framer Motion for animations

### **Backend**
- Node.js with Express
- MongoDB with Mongoose ORM
- JSON Web Tokens (JWT) for authentication
- Cloudinary for image storage
- Multer for file uploads
- Bcrypt for password hashing

### **Development & Deployment**
- Vite for frontend bundling
- Nodemon for backend development
- js-cookie for client-side storage
- Tailwind CSS for styling

## 🛠️ Installation

To set up PandaStore locally, follow these steps:

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file with your configuration
cp .env.example .env
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

## 🚀 Usage

### Starting the Application
```bash
# In the backend directory, start the server
cd backend
npm run dev

# In a separate terminal, start the frontend
cd frontend
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:1000`

### Administrative Interface
1. Visit `http://localhost:5173/login` to access the login page
2. Use admin credentials to log in
3. Navigate the dashboard sidebar to manage products, categories, or suppliers

### Frontend Store
- Browse products at the root URL (`http://localhost:5173`)
- Search for specific items using the search functionality
- View promotions and special offers on the homepage

## 🗂️ Project Folder Structure

```
PandaStore/
├── backend/                  # Server-side application
│   ├── controllers/          # Route controllers
│   ├── lib/                  # Utility functions and helpers
│   ├── models/               # MongoDB schema definitions
│   ├── routes/               # API routes
│   ├── scripts/              # Utility scripts
│   └── package.json          # Backend dependencies
│
├── frontend/                 # Client-side application
│   ├── components/           # React components
│   ├── context/              # React context providers
│   ├── lib/                  # Utility functions
│   ├── pages/                # Page components
│   ├── routing/              # Application routing
│   └── package.json          # Frontend dependencies
│
├── .gitignore                # Git ignore file
└── README.md                 # Project documentation
```

## ⚙️ Configuration and Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# MongoDB Connection
MONGO_URL=your_mongodb_connection_string

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# Backend Port
PORT=1000

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Frontend Configuration
FRONTEND_URL=http://localhost:5173
```

Key environment variables:
- `MONGO_URL`: MongoDB database connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `CLOUDINARY_*`: Credentials for Cloudinary image hosting
- `PORT`: Backend server port (default: 1000)

## 🧪 Testing and CI/CD

The repository currently doesn't include automated tests, but here's how you can implement testing:

### Test Strategy
- **Unit Testing**: Jest for component and utility function testing
- **Integration Testing**: Testing API routes and database interactions
- **End-to-End Testing**: Cypress or Playwright for user flow testing

### Example Test File Structure
```
frontend/
├── __tests__/
│   ├── components/
│   │   └── ProductCard.test.jsx
│   └── pages/
│       └── HomePage.test.jsx
backend/
├── __tests__/
│   ├── routes/
│   │   └── product.routes.test.js
│   └── controllers/
│       └── product.controller.test.js
```

### Recommended CI/CD Pipeline
1. Code push to GitHub repository
2. Run linting and formatting checks
3. Execute unit and integration tests
4. Build frontend production bundle
5. Deploy to hosting platform (Vercel, Netlify, etc.)

## 🚀 Deployment Instructions

### Production Deployment

#### Option 1: Vercel (Recommended for frontend)
```bash
# Deploy frontend to Vercel
vercel --prod

# Set environment variables in Vercel dashboard
vercel env add MONGO_URL
# ... add other required variables
```

#### Option 2: Render (Full-stack deployment)
1. Create new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `cd frontend && npm run build`
4. Set start command: `cd backend && node index.js`
5. Configure environment variables in Render dashboard

#### Option 3: Manual Deployment
```bash
# Build frontend for production
cd frontend
npm run build

# The production build will be in the 'dist' folder
# Serve this with any static file server

# Start backend server in production mode
cd backend
NODE_ENV=production npm start
```

## ✍️ Contribution Guidelines

We welcome contributions to PandaStore! Please follow these guidelines:

### Getting Started
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

### Code Standards
- Follow existing code style and patterns
- Use descriptive commit messages
- Include relevant comments for complex logic
- Update documentation when adding new features

### Issue Reporting
When reporting bugs or suggesting features:
1. Check if the issue already exists
2. Provide detailed reproduction steps

## 📑 License and Credits

This project is licensed under the MIT License - see the LICENSE file for details.

PandaStore was developed by undefined. Special thanks to the open-source community for the excellent tools and libraries that made this project possible.

## 📞 Maintainers and Contacts

The project is maintained by abdessamad10bouih.

For questions, collaborations, or reporting issues, please:
- Submit an issue on GitHub
- Contact the maintainers through GitHub messaging
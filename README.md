# PandaStore

## Project Description

PandaStore is an e-commerce platform built with a modern JavaScript stack, including Express.js, React, and MongoDB. It provides features for managing products, categories, suppliers, and user authentication.

## Features and Functionality

-   **User Authentication:**
    -   Registration and login functionality using JWT and bcrypt for password hashing.
    -   Logout functionality clears cookies.
    -   User profile retrieval.
    -   Password change and reset functionalities via OTP verification.
-   **Product Management:**
    -   CRUD operations for products, including image uploads to Cloudinary.
    -   Categorization of products with hierarchical subcategories.
    -   Supplier management, including adding, modifying, and deleting suppliers.
    -   Product search functionality.
-   **Category Management:**
    -   Creation, retrieval, modification, and deletion of categories.
    -   Hierarchical category structure with parent-child relationships.
-   **Supplier Management:**
    -   CRUD operations for suppliers, including contact information and product associations.
-   **Posts/Promotions Management:**
    -   Creation, modification, and deletion of promotional posts with associated products.
-   **Dashboard:**
    -   Displays key metrics such as total revenue, new orders, active products, and total clients.
    -   Includes interactive charts for visualizing product data.
-   **Help and Support:**
    -   FAQ section covering account management, payments, technical issues, and usage guides.

## Technology Stack

-   **Backend:**
    -   Node.js
    -   Express.js
    -   MongoDB with Mongoose
    -   JWT (JSON Web Tokens) for authentication
    -   bcrypt for password hashing
    -   cloudinary for image storage
    -   multer for handling file uploads
    -   cors for enabling Cross-Origin Resource Sharing
    -   cookie-parser for handling cookies
    -   resend for sending emails
-   **Frontend:**
    -   React
    -   Vite
    -   lucide-react for icons
    -   framer-motion for animations
    -   tailwindcss for styling
    -   shadcn/ui for UI components
    -   recharts for charts
    -   input-otp for one-time password inputs
    -   js-cookie for handling cookies
-   **Other:**
    -   dotenv for managing environment variables
    -   morgan for logging HTTP requests

## Prerequisites

Before you begin, ensure you have met the following requirements:

-   Node.js (v16 or higher)
-   npm or yarn
-   MongoDB installed and running
-   Cloudinary account for image storage
-   Resend API Key for sending emails

## Installation Instructions

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/abdessamad10bouih/PandaStore.git
    cd PandaStore
    ```

2.  **Install backend dependencies:**

    ```bash
    cd backend
    npm install
    ```

3.  **Configure environment variables:**

    Create a `.env` file in the `backend` directory and add the following variables:

    ```
    MONGO_URL=<Your MongoDB Connection String>
    JWT_SECRET=<Your JWT Secret Key>
    CLOUDINARY_CLOUD_NAME=<Your Cloudinary Cloud Name>
    CLOUDINARY_API_KEY=<Your Cloudinary API Key>
    CLOUDINARY_API_SECRET=<Your Cloudinary API Secret>
    RESEND_API_KEY=<Your Resend API Key>
    NODE_ENV=development  # or production
    ```

4.  **Run backend migration (optional):**
    ```bash
    # Uncomment the migrate() call in backend/index.js and then run the server
    # Or run directly
    node backend/scripts/migration.js
    ```

5.  **Start the backend server:**

    ```bash
    npm run dev
    ```

6.  **Install frontend dependencies:**

    ```bash
    cd ../frontend
    npm install
    ```

7.  **Start the frontend development server:**

    ```bash
    npm run dev
    ```

## Usage Guide

1.  **Access the frontend:**

    Open your browser and navigate to `http://localhost:5173`.

2.  **Register or login:**

    Use the signup or login forms to authenticate.

3.  **Navigate the dashboard:**

    The dashboard provides an overview of the store's key metrics.

4.  **Manage products, categories, and suppliers:**

    Use the respective pages in the dashboard to perform CRUD operations.

## API Documentation

### Authentication

-   **POST /auth/signup:** Registers a new user.
    -   Request body: `{ nom, email, password, confirmPassword }`
    -   Response: `{ message, token, user }`
-   **POST /auth/login:** Logs in an existing user.
    -   Request body: `{ email, password }`
    -   Response: `{ message, token, user }`
-   **POST /auth/logout:** Logs out the current user.
    -   Response: `{ message }`
-   **GET /auth/me:** Retrieves the current user's profile.
    -   Response: `{ user }`

### Products

-   **POST /produits/ajouter:** Adds a new product.
    -   Request body (multipart/form-data): `{ nom, description, prix, stock, categories[], specifications[], status, sku, images[], fournisseur, cost, discount, subcategories[] }`
    -   Response: `{ message, produit }`
-   **PUT /produits/modifier/:productId:** Modifies an existing product.
    -   Request body (multipart/form-data): `{ nom, description, prix, stock, categories[], specifications[], status, sku, images[], fournisseur, cost, discount, subcategories[], existingImages[] }`
    -   Response: `{ message, produit }`
-   **DELETE /produits/supprimer:** Deletes a product.
    -   Request body: `{ productId }`
    -   Response: `{ message }`
-   **GET /produits:** Retrieves all products.
    -   Response: `[produits]`
-   **GET /produits/:productId:** Retrieves a single product.
    -   Response: `{ produit }`
-   **GET /produits/rechercherProduit?nom=searchTerm:** Searches for products by name.
    -   Response: `[produits]`

### Categories

-   **POST /categories/ajouter:** Adds a new category.
    -   Request body (multipart/form-data): `{ nom, description, parentId, image }`
    -   Response: `{ message, categorie }`
-   **POST /categories/modifier/:categorieId:** Modifies an existing category.
    -   Request body (multipart/form-data): `{ nom, description, parentId, image }`
    -   Response: `{ message, categorie }`
-   **GET /categories/all:** Retrieves all categories.
    -   Response: `[categories]`
-    **GET /categories/categorie/:categorieId:** Retrieves a single category.
    -   Response: `{ categorie }`

### Suppliers

-   **POST /fournisseurs/ajouter:** Adds a new supplier.
    -   Request body: `{ nom, contact, status, logo, siteweb, description, notes }`
    -   Response: `{ newFournisseur }`
-   **PUT /fournisseurs/modifier:** Modifies an existing supplier.
    -   Request body: `{ fournisseurId, nom, contact, status, logo, siteweb, description, notes }`
    -   Response: `{ modifiedFournisseur }`
-   **DELETE /fournisseurs/supprimer:** Deletes a supplier.
    -   Request body: `{ fournisseurId }`
    -   Response: `{ message }`
-   **GET /fournisseurs:** Retrieves all suppliers.
    -   Response: `{ allFournisseurs }`
-   **GET /fournisseurs/rechercher?searchTerm=query:** Searches for suppliers.
    -   Response: `[result]`

### Users

-   **PUT /user/changePassword:** Changes the user's password.
    -   Request body: `{ userId, currentPassword, newPassword, confirmedPassword }`
    -   Response: `{ message }`
-   **PUT /user/modifier:** Modifies user information.
    -   Request body: `{ userId, username, email, phone, avatar, addresses[] }`
    -   Response: `{ message, user }`
-   **GET /user/users:** Retrieves all users.
    -   Response: `{ message, users }`
-   **POST /user/forgotPassword:** Initiates the password reset process.
    -   Request body: `{ email }`
    -   Response: `{ message, otp }`
-   **POST /user/verifierOTP:** Verifies the OTP entered by the user.
    -   Request body: `{ email, otp }`
    -   Response: `{ message, redirect }`
-   **POST /user/reset-password:** Resets the user's password.
    -   Request body: `{ email, newPassword }`
    -   Response: `{ message }`

### Posts

-   **POST /posts/ajouter:** Adds a new post.
    -   Request body (multipart/form-data): `{ titre, contenu, type, dateDebut, dateFin, produits[], description, status, image }`
    -   Response: `{ message, post }`
-   **PUT /posts/modifier/:postId:** Modifies an existing post.
    -   Request body (multipart/form-data): `{ titre, contenu, type, dateDebut, dateFin, produits[], description, status, image }`
    -   Response: `{ message, post }`
-   **DELETE /posts/supprimer/:postId:** Deletes a post.
    -   Response: `{ message, post }`
-   **GET /posts:** Retrieves all posts.
    -   Response: `{ message, posts }`

## Contributing Guidelines

Contributions are welcome! Here's how you can contribute:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with descriptive messages.
4.  Test your changes thoroughly.
5.  Submit a pull request to the `main` branch.

## License Information

No license specified. All rights reserved.

## Contact/Support Information

For any issues or support, please contact: bouihabdessamad5@gmail.com
# Watch
 
This project is a simple web application that allows users to register, log in, and view a specific video stream securely.

## Tech Stack

- **Frontend:** React (using Create React App + Vite)
- **Backend:** Node.js (Express)
- **Database:** SQLite
- **Authentication:** JWT (JSON Web Tokens)
- **ORM:** Sequelize
- **Password Hashing:** bcrypt
- **Containerization:** Docker, Docker Compose

## Setup and Running Instructions

There are two primary ways to run this application: using Docker (recommended for ease of setup and consistency) or setting up the frontend and backend manually.

### Option 1: Using Docker (Recommended)

**Prerequisites:**
*   Docker installed
*   Docker Compose installed



1.  **Build and Run:** Open a terminal in the project root directory (`watch`) and run:
    ```bash
    docker compose up --build -d
    ```
    This command will:
    *   Build the Docker images for the frontend and backend.
    *   Start containers for the MySQL database, backend API, and frontend React app.


2.  **Access:**
    *   Frontend: Open your browser and navigate to `http://localhost:3000`
    *   Backend API: Accessible at `http://localhost:5001`


### Option 2: Manual Setup (Local Development)

**Prerequisites:**
*   Node.js (v18 or later recommended)
*   npm or yarn
*   SQLite3 development libraries might be needed (`sudo apt-get install libsqlite3-dev` on Debian/Ubuntu)



**Steps:**

1.  **Clone/Download:** Obtain the project code.
2.  **Backend Setup:**
    *   Navigate to the `backend` directory: `cd watch/backend`
    *   Install dependencies: `npm install`
    *   Create a `.env` file (copy from example above) and set your `JWT_SECRET` and `PORT` (e.g., 5001).
    *   The backend is configured to use SQLite (`database_dev.sqlite`) by default for local development (see `backend/config/config.js`).
    *   Run database migrations: `npx sequelize-cli db:migrate`
    *   Start the backend server: `node server.js` 
    *   The backend should now be running (default: `http://localhost:5001`).
3.  **Frontend Setup:**
    *   Open a *new* terminal window.
    *   Navigate to the `frontend` directory: `cd watch/frontend`
    *   Install dependencies: `npm install`
    *   The frontend API service (`src/services/api.js`) is configured to connect to `http://localhost:5001/api` by default.
    *   Start the frontend development server: `npm run dev`
    *   The frontend should now be running and accessible in your browser (default: `http://localhost:3000`).




## Backend API Documentation

### 1. Register User

**Endpoint:** `POST /api/auth/register`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecureP@ss123"
}
```

**Response - Success (201):**
```json
{
  "message": "User registered successfully",
  "userId": "123"
}
```

**Response - Error (400) - User Exists:**
```json
{
  "message": "User already exists"
}
```

**Response - Error (400) - Password Validation:**
```json
{
  "message": "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character"
}
```

**Response - Error (500):**
```json
{
  "message": "Server error during registration"
}
```

### 2. Login User

**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecureP@ss123"
}
```

**Response - Success (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response - Error (401):**
```json
{
  "message": "Invalid credentials"
}
```

**Response - Error (500):**
```json
{
  "message": "Server error during login"
}
```

### 3. Get Current User

**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response - Success (200):**
```json
{
  "userId": "123",
  "email": "user@example.com"
}
```

**Response - Error (401):**
```
401 Unauthorized
```

**Response - Error (403):**
```
403 Forbidden
```

### 4. Logout User

**Endpoint:** `POST /api/auth/logout`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response - Success (200):**
```json
{
  "message": "Logged out successfully"
}
```

**Response - Error (401) - No Token:**
```json
{
  "message": "No token provided"
}
```

**Response - Error (401) - Blacklisted Token:**
```json
{
  "message": "Token is no longer valid"
}
```

**Response - Error (400):**
```json
{
  "message": "Invalid token format"
}
```

**Response - Error (500):**
```json
{
  "message": "Server error during logout"
}
```


## Frontend Pages

### 1. Login Page
- **Route**: `/login`
- **Features**:
  - Email/username input
  - Password input
  - Submit button
  - Link to registration page
  - Error messages for failed login attempts

### 2. Register Page
- **Route**: `/register`
- **Features**:
  - Email input
  - Password input with confirmation
  - Submit button
  - Link to login page
  - Form validation

### 3. Video Page (Protected)
- **Route**: `/video`
- **Features**:
  - Requires authentication to access
  - Displays video content
  - Shows user information
  - Logout button

## Implementation Flow

1. User registers via `/register` page
2. Registration data is sent to `/api/auth/register` endpoint
3. Upon successful registration, user is redirected to `/login` page
4. User enters credentials on login page
5. Login data is sent to `/api/auth/login` endpoint
6. On successful login, token is stored and user is redirected to `/video` page
7. The `/video` page loads and fetches user data from `/api/auth/me` endpoint
8. When user logs out, the `/api/auth/logout` endpoint is called and user is redirected to login


## Technology Choices & Assumptions

*   **Authentication:** JWT was chosen for session management. Tokens are stored in `localStorage` on the client-side. The backend provides `/register` and `/login` endpoints. A protected `/api/me` endpoint is included to verify tokens and fetch basic user info.
*   **Security:** Passwords are hashed using `bcrypt`. JWTs have an expiration time (1 hour). Basic input validation is present. CORS is enabled on the backend. Further security hardening (rate limiting, more complex validation, HTTPS enforcement in production) would be needed for a real-world application.


## <img  align= center width= 70px height =70px src="https://img.genial.ly/5f91608064ad990c6ee12237/bd7195a3-a8bb-494b-8a6d-af48dd4deb4b.gif?genial&1643587200063">  GIF Demo <a id ="video"></a>

<video src="https://github.com/user-attachments/assets/a52e6ea5-beaf-4d3e-8dbd-b1e37763bdff" >
</video> 

## Potential Improvements / Trade-offs

*   **Refresh Tokens:** Implement refresh tokens for a more robust session management strategy instead of relying solely on short-lived access tokens.
*   **Testing:** Add automated tests (unit, integration, end-to-end).
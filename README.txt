=======================================================
           COMPLETE AUTHENTICATION SYSTEM
=======================================================

WHAT IS THIS PROJECT?
---------------------
This is a complete login/registration system with:
- User registration and login
- Email verification
- Password management
- Secure authentication with JWT tokens
- Password expiry (180 days)
- Modern React frontend + Node.js backend

WHAT YOU NEED BEFORE STARTING:
------------------------------
1. Node.js (version 16 or higher) - Download from nodejs.org
2. MongoDB installed locally OR use MongoDB Atlas (cloud)
3. Git (to clone/download this project)
4. A Gmail account for sending verification emails

QUICK START GUIDE:
------------------

STEP 1: SETUP BACKEND (Server)
-------------------------------
1. Open terminal/command prompt
2. Navigate to backend folder:
   cd BE

3. Install required packages:
   npm install

4. Create environment file (.env) in BE folder with these settings:
   DBURL=mongodb://localhost:27017/authsystem
   JWT_SECRET=your-secret-key-12345
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASS=your-gmail-app-password
  

   NOTE: For EMAIL_PASS, you need Gmail App Password (not regular password)
   How to get Gmail App Password:
   - Go to Google Account settings
   - Enable 2-factor authentication
   - Generate App Password for "Mail"

5. Start the backend server:
   npm run dev or npm start

   You should see: "Server running on port 3005" and "MongoDB connected"

STEP 2: SETUP FRONTEND (Website)
--------------------------------
1. Open NEW terminal/command prompt
2. Navigate to frontend folder:
   cd FE

3. Install required packages:
   npm install

4. Start the frontend:
   npm run dev

   You should see: "Local: http://localhost:5173"

STEP 3: OPEN THE WEBSITE
------------------------
1. Open your web browser
2. Go to: http://localhost:5173
3. You should see the login page

HOW TO USE THE SYSTEM:
----------------------

REGISTERING A NEW USER:
1. Click "Register" on the login page
2. Fill in your details (name, email, password)
3. Click "Register"
4. Check your email for verification link
5. Click the link in email to activate account
6. Create your password
7. Now you can login!

LOGGING IN:
1. Go to login page
2. Enter your email and password
3. Click "Login"
4. You'll be taken to the homepage

PASSWORD EXPIRY:
- Passwords expire after 180 days
- System will warn you when password is about to expire
- You'll be forced to change password after 180 days

PROJECT STRUCTURE:
------------------
LoginPage/
├── BE/                    (Backend - Node.js server)
│   ├── app.js            (Main server file)
│   ├── package.json      (Backend dependencies)
│   └── src/              (Server code)
├── FE/                    (Frontend - React website)
│   ├── src/              (Website code)
│   ├── package.json      (Frontend dependencies)
│   └── index.html        (Main HTML file)
└── images/               (Screenshots)

MAIN FEATURES:
--------------
✅ User Registration
✅ Email Verification
✅ Secure Login/Logout
✅ Password Creation
✅ Password Change
✅ Forgot Password
✅ JWT Authentication
✅ Protected Routes
✅ Modern UI with React
✅ Password Expiry (180 days)
✅ Avatar Upload
✅ Responsive Design

TECHNOLOGY USED:
----------------
Backend:
- Node.js (JavaScript runtime)
- Express.js (Web framework)
- MongoDB (Database)
- JWT (Authentication tokens)
- bcrypt (Password encryption)
- Nodemailer (Email sending)

Frontend:
- React (User interface)
- TypeScript (Type-safe JavaScript)
- Tailwind CSS (Styling)
- Vite (Build tool)
- Axios (API calls)

COMMON ISSUES & SOLUTIONS:
--------------------------

ISSUE: "MongoDB connection failed"
SOLUTION: Make sure MongoDB is running or check your DBURL in .env file

ISSUE: "Email not sending"
SOLUTION: Check your EMAIL_USER and EMAIL_PASS in .env file
         Make sure you're using Gmail App Password, not regular password

ISSUE: "Port already in use"
SOLUTION: Change PORT in .env file to different number (like 5001)

ISSUE: "npm install fails"
SOLUTION: Delete node_modules folder and package-lock.json, then run npm install again

ISSUE: "Cannot access website"
SOLUTION: Make sure both backend (npm start in BE folder) and 
         frontend (npm run dev in FE folder) are running

API ENDPOINTS:
--------------
POST /v1/auth/register          - Register new user
POST /v1/auth/login             - Login user
POST /v1/auth/createpassword/:token    - Create password after email verification
POST /v1/auth/changepassword/:id    - Change password (logged in users)
POST /v1/auth/updatepassword/token    - Update password
GET  /v1/auth/password-status   - Check if password expired

DEVELOPMENT COMMANDS:
--------------------
Backend (BE folder):
- npm start              (Start server)
- npm install           (Install packages)

Frontend (FE folder):
- npm run dev           (Start development server)
- npm run build         (Build for production)
- npm install           (Install packages)

FOLDER PURPOSES:
----------------
BE/config/              - Database and cloud storage settings
BE/src/controller/      - Business logic (login, register, etc.)
BE/src/middleware/      - Security and validation
BE/src/modal/           - Database models
BE/src/services/        - Email and authentication services

FE/src/Pages/           - Website pages (Login, Register, etc.)
FE/src/component/       - Reusable UI components
FE/src/Route/           - Page routing and protection
FE/src/hooks/           - Custom React hooks

TESTING THE SYSTEM:
-------------------
1. Start both backend and frontend
2. Register a new user with your real email
3. Check email and click verification link
4. Create password and login
5. Try changing password
6. Test forgot password feature

SECURITY FEATURES:
------------------
- Passwords are encrypted (bcrypt)
- JWT tokens for secure authentication
- Email verification required
- Password strength validation
- Account lockout after failed attempts
- Automatic password expiry
- Protected routes
- XSS protection
- File upload security

SUPPORT:
--------
If you have issues:
1. Check the console for error messages
2. Make sure MongoDB is running
3. Verify your .env file settings
4. Ensure both servers are running
5. Check your email settings

Contact: sandeshbhusal417@gmail.com

Built by Sandesh Bhusal | 2025
=======================================================

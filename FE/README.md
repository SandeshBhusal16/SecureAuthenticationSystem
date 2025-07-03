# Login Page Frontend Application

A modern, secure authentication system built with React, TypeScript, and Vite. This application provides a complete user authentication flow including login, registration, email verification, and password management.

## 🚀 Features

- **User Authentication**: Secure login and registration system
- **Email Verification**: Email-based account verification
- **Password Management**: Create and update password functionality
- **Protected Routes**: Route protection for authenticated users
- **Content Security Policy (CSP)**: Prevents execution of unauthorized scripts
- **Security Middleware**: Helmet (on Express backend for CSP and HTTP headers)
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Form Validation**: Robust form validation with React Hook Form
- **Security**: JWT token-based authentication and Google reCAPTCHA integration
- **Notifications**: Toast notifications for user feedback

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.1.0
- **Language**: TypeScript
- **Build Tool**: Vite 6.3.5
- **Styling**: Tailwind CSS 4.1.10
- **Routing**: React Router DOM 7.6.2
- **Form Handling**: React Hook Form 7.58.0
- **HTTP Client**: Axios 1.10.0
- **Security**: Google reCAPTCHA, JWT Decode
- **Icons**: React Icons 5.5.0
- **Notifications**: React Toastify 11.0.5

## 📁 Project Structure

```
src/
├── assets/                 # Static assets (images, icons)
├── component/             # Reusable UI components
│   └── Input.tsx         # Custom input component
├── Pages/                # Application pages
│   ├── CreatePassword/   # Password creation flow
│   ├── homepage.tsx/     # Protected home page
│   ├── Login/           # Login page
│   ├── Register/        # Registration page
│   ├── UpdatePassword/  # Password update flow
│   └── VarifyMail/      # Email verification flow
├── Route/               # Routing configuration
│   ├── index.tsx       # Main routing setup
│   └── protectedRoute.tsx # Protected route wrapper
├── App.tsx             # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles
```

## 🔑 Key Pages

1. **Login (`/`)** - User authentication
2. **Register (`/register`)** - New user registration
3. **Email Verification (`/verifymail/:token`)** - Account verification
4. **Create Password (`/createpassword/:token`)** - Initial password setup
5. **Update Password (`/updatepassword/:token`)** - Password reset
6. **Home (`/home`)** - Protected dashboard (requires authentication)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd LoginPage/FE
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📜 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application for production
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview the production build locally

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory and configure:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
```

### Backend Integration

This frontend is designed to work with the corresponding backend API. Ensure the backend server is running and accessible at the configured API base URL.

## 🎨 Styling

The application uses Tailwind CSS for styling with a custom gradient background:

- Modern, responsive design
- Custom color scheme with gradients
- Mobile-first approach
- Consistent spacing and typography

## 🔒 Security Features

- JWT token-based authentication
- Google reCAPTCHA integration for bot protection
- Protected routes requiring authentication
- Secure token handling and storage
- Input validation and sanitization
- Content Security Policy (CSP)

```
BE/ index.js

<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data:;
  connect-src 'self' http://localhost:3000;
  object-src 'none';
">

```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📋 Development Guidelines

- Follow TypeScript best practices
- Use React functional components with hooks
- Implement proper error handling
- Write meaningful commit messages
- Ensure responsive design
- Test on multiple browsers

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**: Change the port in `vite.config.ts`
2. **API connection issues**: Verify backend server is running
3. **Build errors**: Clear `node_modules` and reinstall dependencies

### Getting Help

If you encounter issues:

1. Check the browser console for errors
2. Verify all environment variables are set
3. Ensure the backend API is accessible
4. Check network connectivity

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ using React, TypeScript, and Vite

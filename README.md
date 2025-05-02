# Leave Management System Frontend

## Overview
This is a modern, feature-rich Leave Management System built with React, Vite, and TypeScript. It provides a comprehensive solution for managing employee leave requests, balances, and approvals.

## Features
- 🔐 Secure JWT Authentication
- 📋 Role-based Access Control (Admin, Manager, Staff)
- 📅 Leave Request Management
- 📊 Leave Balance Tracking
- 🏢 Department and Employee Management
- 🔔 Real-time Notifications

## Tech Stack
- React
- Vite
- TypeScript
- Redux Toolkit
- Axios
- Socket.IO

## Prerequisites
- Node.js (v16+)
- npm or yarn

## Installation
1. Clone the repository
```bash
git clone https://github.com/your-username/leave-management-system-fn.git
cd leave-management-system-fn
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file with the following variables:
```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_AUTH_TOKEN_KEY=leave_management_token
```

## Running the Application
```bash
npm run dev
```

## Building for Production
```bash
npm run build
```

## Environment Variables
- `VITE_API_BASE_URL`: Base URL for the backend API
- `VITE_AUTH_TOKEN_KEY`: Key for storing authentication token

## Authentication Flows
- User Registration
- User Login
- Token Validation
- Role-based Access Control

## API Endpoints Covered
- Authentication
- Leave Requests
- Leave Balances
- Leave Types
- Departments
- Employee Management
- Reporting

## State Management
Uses Redux Toolkit for centralized state management with slices for:
- Authentication
- Leave Requests
- Notifications
- Leave Balances
- Leave Types
- Departments
- Employees

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
Distributed under the MIT License. See `LICENSE` for more information.

## Contact
Your Name - your.email@example.com

Project Link: [https://github.com/your-username/leave-management-system-fn](https://github.com/your-username/leave-management-system-fn)

npm run dev  # Start development server
```

#### Build
```bash
npm run build  # Build for production
npm run preview  # Preview production build
```

### Environment Variables
- Prefix environment variables with `VITE_` to make them accessible in the application

## Technologies
- React
- TypeScript
- Vite
- React Router
- Redux Toolkit
- Material-UI

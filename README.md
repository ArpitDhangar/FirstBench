# User Management System

This project is a RESTful API for a User Management System, developed using Node.js, Express.js, and MongoDB. The system includes features for user registration, login, profile management, account deactivation/reactivation, and admin-level functionality to manage users.

## Installation

1. Clone the Repository:

```bash
git clone https://github.com/ArpitDhangar/FirstBench.git
```
2. Install Dependencies:
```bash
npm install
```
3. Set Up Environment Variables:
```bash
PORT = 5000
MONGO_URI = mongodb+srv://arpit:gtqxMI7sTznQnnnC@cluster0.8m3q7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
NODE_ENV = Development
JWT_SECRET = ArpitDhangar
```
3. Run the Application:
```bash
npm install
```

## Features

1. Registration: Users can register with their name, email, password, and phone number.

2. Login: Secure login using email and password.

3. Profile Management: Users can view and update their profiles.

4. Account Deactivation: Users can deactivate their account, which can be reactivated automatically after a predefined period (e.g., 1 minute).

5. Logout: Users can securely log out of the system.

# Admin Features
1. Admin Login: Admins can log in with a separate admin route.

2. View All Users: Admins can view a list of all registered users.

3. Account Deactivation: Admins can deactivate any user's account.

# Security
1. Password Hashing: User passwords are securely hashed using bcrypt.

2. Cookies: Secure cookies are used for session management.

# API Endpoints
```

## User Routes

METHOD          EndPoint            Description
POST           /api/v1/login        Login a user
POST           /api/v1/register     Register a new user
PUT            /api/v1/update       Update user profile (authenticated)
GET            /api/v1/me           Get the logged-in user's profile
POST           /api/v1/logout       Logout the user
PUT            /api/v1/deactivate   Deactivate the user's account

## Admin Routes

METHOD        EndPoint              Description
POST          /api/v1/admin/login   Login as admin
GET           /api/v1/admin/users   Get details of all users (admin-only)
```

# Technologies Used
1. Node.js: Runtime environment

2. Express.js: Web framework

3. MongoDB: NoSQL database

4. Mongoose: Object Data Modeling (ODM) library

5. bcrypt: Password hashing

6. jsonwebtoken (JWT): Authentication and authorization

# How the Default Admin is Created
When the application starts, it checks if a user with the email admin@gmail.com exists in the database. If not, a default admin account is created with the following details:

Name: Admin

Email: admin@gmail.com

Password: admin

Role: admin

This is achieved using the createDefaultAdmin function in app.js.

# Questions
## How do you manage a super admin and its login feature? Do we need to create a separate Database table to save their details? Also what is the best way to create a Super Admin account, should Super Admin also register with email and password like normal user?
The Super Admin will be created by default when the projects runs and the login for admin will have an another route (/api/v1/admin/login).The super admin will have power to see all the users through the API route(/api/v1/admin/users) and the super admin should also deactivate the users.
We will not create the separate database table to store admin details. And The best way to create the super admin account will be to create it by default, super admin should not register like a normal user.

## User have the ability to deactivate the account. Does it mean we delete the account from the database or we can keep the user data but not allow them to login, Think of the best possible solution.
We won't delete the account from the database, we will freeze the account for a certain period of time(1 minute) then it will reactivate, so that the user can login again.

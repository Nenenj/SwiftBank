## SwiftBank - ALX Portfolio Project
# Project Title: SwiftBank

## Team Members:
Nnenna Njoku
Ibrahim Fuhad Suma

## Project Overview
SwiftBank is a modern web banking application developed as part of the ALX Full Stack Software Development curriculum. It allows users to securely manage their financial transactions, transfer funds, view transaction history, and more. This project aims to integrate backend and frontend development skills while focusing on core aspects like security, database management, and user experience.

## Features:
User authentication (sign up, log in)
Account creation with unique account numbers
Secure fund transfers between accounts
View transaction history
Responsive and user-friendly interface

## Learning Objectives
The primary goals for this project are to:

Enhance full-stack development skills (frontend and backend)
Implement secure authentication using JWT
Work with relational databases using MySQL
Build RESTful APIs and integrate them with a React frontend
Apply best practices for handling financial transactions
Manage security (e.g., SSL/TLS, password encryption) to protect sensitive data
Collaborate efficiently as a team and apply agile project management techniques

## Technologies Used

* Frontend:
HTML5, CSS3, JavaScript
React.js: For building interactive user interfaces

* Backend:
Node.js: JavaScript runtime for server-side code
Express.js: Framework for building the API

* Database:
MySQL: Relational database for storing user and transaction data

* Security:
JWT (JSON Web Token) for secure user authentication
SSL/TLS encryption for secure data transmission
APIs:
RESTful APIs for interacting between frontend and backend

## Challenges Faced
Some of the challenges we anticipate or have faced include:

Security Concerns: Ensuring that user authentication is secure, and sensitive information (e.g., passwords, transactions) is properly encrypted.
Database Optimization: Managing relational data (users, transactions) efficiently and ensuring scalability for the future.
Handling Concurrency: Properly handling simultaneous transactions to avoid race conditions in the database.
Strategies for Overcoming Challenges:
Implementing thorough validation for each transaction to ensure data integrity.
Using proper indexing in the MySQL database to speed up queries.
Encrypting passwords and securing API routes with proper authentication checks.

## Getting Started
Prerequisites:
To run this project locally, you'll need:
> Node.js installed on your machine
> MySQL installed and configured with a root password
> Git for version control

## Installation:

* Clone the repository:
git clone https://github.com/Nenenj/SwiftBank.git

* Navigate to the project folder:
cd SwiftBank

* Install the backend dependencies:
cd server
npm install

* Install the frontend dependencies:
cd ../client
npm install

* Create a .env file in the server directory and add your environment variables:
DB_NAME=swiftbank_db
DB_USER=root
DB_PASSWORD=yourpassword
JWT_SECRET=yourSecretKey

* Start the MySQL database and create the database:
mysql -u root -p
CREATE DATABASE swiftbank_db;

* Run the backend server:
cd server
node index.js

* Run the frontend server:
cd client
npm start

## License
This project is licensed under the MIT License.

## Contributors
Nnenna Njoku
ibraihim Fuhad Suma

We look forward to sharing this project as a portfolio piece and for future improvements!



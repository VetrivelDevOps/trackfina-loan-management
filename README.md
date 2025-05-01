# TrackFina Loan Management

TrackFina is a comprehensive loan management application built using React, TypeScript, Node.js, and PostgreSQL. This application provides an intuitive user interface for managing loans, users, and authentication, along with robust administrative functionalities.

## Features

- **User Authentication**: Secure login and registration processes.
- **Loan Management**: Apply for loans, view loan details, and manage loan applications.
- **Dashboard**: Overview of loan summaries and recent activities.
- **Settings**: User settings management.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Technologies Used

- **Frontend**: React, TypeScript, Axios for API calls
- **Backend**: Node.js, Express, PostgreSQL
- **Database**: PostgreSQL for data storage
- **Styling**: CSS Modules or styled-components for styling components

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- PostgreSQL (version 12 or higher)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/trackfina-loan-management.git
   ```

2. Navigate to the project directory:
   ```
   cd trackfina-loan-management
   ```

3. Install server dependencies:
   ```
   cd server
   npm install
   ```

4. Install client dependencies:
   ```
   cd ../client
   npm install
   ```

### Configuration

1. Create a `.env` file in the `server` directory based on the `.env.example` file.
2. Set up your PostgreSQL database and update the database configuration in `server/src/config/database.ts`.

### Running the Application

1. Start the server:
   ```
   cd server
   npm run dev
   ```

2. Start the client:
   ```
   cd ../client
   npm start
   ```

### Database Migrations

To set up the database schema, run the migrations:
```
cd database
psql -U yourusername -d yourdatabase -f migrations/001_create_users_table.sql
psql -U yourusername -d yourdatabase -f migrations/002_create_loans_table.sql
psql -U yourusername -d yourdatabase -f migrations/003_create_payments_table.sql
```

### Seeding the Database

To seed initial data, run:
```
psql -U yourusername -d yourdatabase -f seeds/001_seed_users.sql
psql -U yourusername -d yourdatabase -f seeds/002_seed_loans.sql
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
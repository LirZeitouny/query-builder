# Noname-Lir Project

## Description

This project is a web application for creating custom database queries. It allows users to build complex SQL queries using a user-friendly interface.

## Technologies and Libraries Used

### Frontend

- **Vue 3**: A progressive JavaScript framework for building user interfaces.
- **Vuex**: State management library for Vue.js applications.
- **Vue Router**: Official router for Vue.js.
- **Quasar**: A high-performance Vue.js framework that provides a set of pre-made UI components.
- **Axios**: A promise-based HTTP client for making API requests.
- **TypeScript**: A statically typed superset of JavaScript.
- **Prettier and ESLint**: Code formatting and linting tools for maintaining code quality.

### Backend

- **Node.js**: A JavaScript runtime environment for server-side development.
- **Express.js**: A popular web application framework for Node.js.
- **SQLite**: A self-contained, serverless, and zero-configuration SQL database engine.
- **Cors**: Middleware for handling Cross-Origin Resource Sharing (CORS) in Express.
- **Body Parser**: Middleware for parsing JSON request bodies.

## Project Structure

The project is divided into frontend and backend components.

### Frontend

- **app.vue**: The main Vue application component that serves as the entry point for the frontend.
- **package.json**: Configuration file for frontend dependencies and scripts.
- **store**: Contains the Vuex store configuration for managing application state.
- **pages**: Vue components that represent different pages of the application.
- **components**: Reusable Vue components used throughout the application.

### Backend

- **server.js**: The main Node.js server file responsible for handling API requests and serving the frontend.
- **mydatabase.db**: SQLite database file for storing application data.
- **package.json**: Configuration file for backend dependencies and scripts.

## Getting Started

To run the project, follow these steps:

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd noname-lir
   ```

2. Install frontend dependencies:

   ```bash
   cd quasar-project
   npm install
   ```

3. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

4. Start the frontend development server:

   ```bash
   cd quasar-project
   npm run dev
   ```

5. Start the backend server:

   ```bash
   cd backend
   npm start
   ```

6. Access the application in your web browser at `http://localhost:3000`.

## Usage

1. Upon opening the application, you will be presented with a user-friendly interface for creating custom database queries.

2. Start by adding conditions, groups, and values to construct your query.

3. You can select tables and columns from the available options.

4. Use logical operators and containment options to build complex conditions.

5. Click the "Execute Query" button to run your query against the database.

6. View the query results in a table format.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- The project was developed by [Lir Zeitouny](mailto:lirzetouny@gmail.com).

Feel free to customize this README to suit your project's specific details and requirements.

# Custom Query Builder

## Table of Contents

- [Introduction](#introduction)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Component Breakdown](#component-breakdown)
- [Queries and Data Models](#queries-and-data-models)
- [Contributing](#contributing)
- [License](#license)

## Introduction

It is a custom query builder web application built using the Quasar framework. It allows users to create and execute custom database queries using a user-friendly interface. This README provides an overview of the project structure and how to get started with development.

## Project Structure

The project structure follows a typical Quasar project setup with additional directories and components specific to the custom query builder:

- **src**: This directory contains the main source code for the Quasar LIR project.
  - **assets**: Any static assets such as images or fonts are stored here.
  - **components**: Custom Vue components used throughout the application.
    - **query-builder**: Contains components related to the custom query builder interface.
  - **layouts**: Layouts for different sections of the application.
  - **pages**: Vue pages that correspond to different views of the application.
  - **services**: Modules for interacting with external services (e.g., making API requests).
  - **types**: TypeScript type definitions for the project.
  - **App.vue**: The root Vue component.
  - **main.ts**: The entry point for the application.
- **public**: Static files placed here will be accessible as-is from the root URL.
- **quasar.conf.js**: Configuration file for the Quasar app.

## Getting Started

To run this Quasar project locally, follow these steps:

1. Clone the repository:

   ```shell
   git clone https://github.com/yourusername/quasar-lir.git
   cd quasar-lir
   ```

2. Install dependencies:

   ```shell
   npm install
   ```

3. Start the development server:

   ```shell
   npm run dev
   ```

4. Open your browser and visit `http://localhost:8080` to access the Quasar LIR application.

## Usage

Quasar LIR provides a user-friendly interface for creating custom database queries. Users can add conditions, specify logical operators, and execute queries. Here are some key features:

- **Create Conditions**: Users can add conditions to build complex queries. Each condition can have multiple groups and values.

- **Logical Operators**: Logical operators like `AND` and `OR` can be used to connect conditions and groups.

- **Execute Queries**: Users can execute custom queries to fetch data from the connected database.

- **Query Result**: The result of the executed query is displayed in a tabular format.

## Component Breakdown

The application is structured around several Vue components that work together to create the custom query builder interface. Here's an overview of these components:

- **ConditionItem.vue**: Represents a single condition in the query builder. It contains groups of values and logical operators.

- **GroupItem.vue**: Represents a group of values within a condition. Users can add logical operators and values to groups.

- **ValueItem.vue**: Represents a single value within a group. Users can specify the type of containment, logical operators, and input values.

## Queries and Data Models

The application uses TypeScript data models to define queries and query result items. These models are defined in `queryModel.ts`. You can customize these models to fit your database schema.

## Contributing

Contributions to Quasar LIR are welcome! If you find a bug, have an enhancement in mind, or want to contribute in any way, please open an issue or submit a pull request on the GitHub repository.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Feel free to customize this README with your specific project details and branding. It provides a starting point for users and contributors to understand your Quasar-based custom query builder application.

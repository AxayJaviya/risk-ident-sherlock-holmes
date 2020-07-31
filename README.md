# RISK IDENT Sherlock Holmes

Basic Express and TypeScript API endpoint for detection of transaction fraudulent.

- **Problem Statement**: [https://docs.google.com/document/d/1XWnpL1xUNHI1pYZXzqs2BRgq5v7UT9awfRA9w55PD3w/edit](https://docs.google.com/document/d/1XWnpL1xUNHI1pYZXzqs2BRgq5v7UT9awfRA9w55PD3w/edit)

- **Live Demo**: [https://risk-ident-shrelock-holmes.herokuapp.com/api/transactions?transactionId=transactionId&confidenceLevel=0](https://risk-ident-shrelock-holmes.herokuapp.com/api/transactions?transactionId=transactionId&confidenceLevel=0)

## Description

- This API is built using [Express.js](https://www.npmjs.com/package/express) web framework, and have used [Typescript](https://www.npmjs.com/package/typescript) for writing the api's logic.
- For storing configuration into the `env` for production and `.env.development` for development, [DOTENV](https://www.npmjs.com/package/dotenv) for Node.js is used. For demonstration purpose .env.example file is added to this repository
- For API metadata logging, uses a [morgan](https://www.npmjs.com/package/morgan), if Node running environment is production then store metadata into access.log file else display metadata in console.
- Uses [mocha](https://www.npmjs.com/package/mocha) and [chai](https://www.npmjs.com/package/chai) to write API endpoint unit test cases.

## Contents

- [Prerequisites](#prerequisites)
- [App Structure](#app-structure)
- [Install, Configure & Run](#install-configure--run)
- [List of Routes](#list-of-routes)
- [Screenshots](#screenshots)
- [Author](#author)
- [License](#license)

## Prerequisites

- Install [Node.js](https://nodejs.org/en/)

## App Structure

```bash
├── doc
├── src
│   ├── controllers
│   │   ├── Controller.ts
│   │   ├── index.ts
│   │   └── TransactionController.ts
│   ├── routes
│   │   ├── index.ts
│   │   └── TransactionRoutes.ts
│   ├── tests
│   │   ├── TransactionController.spec.ts
│   └── app.ts
│   └── index.ts
├── .env (.gitignore)
├── .env.development (.gitignore)
├── .env.example
├── .gitignore
├── access.log
├── package.json
├── package-lock.json
├── README.md
├── test-data_072020.json
├── tsconfig.json
└── tslint.json
```

## Install, Configure & Run

Below mentioned are the steps to install, configure & run in your platform/distributions.

```bash
# Clone the repo.
git clone https://github.com/AxayJaviya/risk-ident-sherlock-holmes.git

# Goto the cloned project folder.
cd risk-ident-sherlock-holmes;

# Install NPM dependencies.
npm install;

# Edit your DotEnv file using any editor of your choice.
# Please Note: You should add all the configurations details (fields: PORT)
# or else default values will be used!
vim .env;
vim .env.developemt;

# Run the development app
npm run dev;

# Build and Run the app
num run build;
npm run start;

# Run the test cases
npm run test;
```

## List of Routes

```sh

# API Routes:

+--------+-------------------------+
  Method | URI
+--------+-------------------------+
  GET    | /api/transactions?transactionId&confidenceLevel
+--------+-------------------------+
```

## Screenshots

### result of unit test cases

![Unit Test results](/docs/test-cases-result.png)

### Home Screen

![Home Screen](/docs/home_screen.png)

### Transaction API Screen

![Transaction API Screen](/docs/transaction_screen.png)

### No Transaction Found

![Transaction Found](/docs/api-no-transactionId.png)

### Single Transaction Found

![Single Transaction Found](/docs/api-match-transaction-found.png)

### Mutiple Transaction Found

![Mutiple Transaction Found](/docs/api-match-multiple-transaction-found.png)

## Author

**Axay Javiya** - [javiyaaxay@gmail.com](mailto:javiyaaxay@gmail.com)

## License

[ISC](https://opensource.org/licenses/ISC)

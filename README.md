# 🤖 Sales ChatBot Web App

## 🧾 Introduction

The **Sales ChatBot Web App** is a full-stack chatbot system designed to simulate a virtual assistant that helps users with product-related queries in an e-commerce setting. Inspired by the ChatGPT interface, it features a multi-session layout where users can create and view past conversations.

It is built using **React.js** for the frontend and **Flask** for the backend, with **MySQL** as the primary database. The system also supports **JWT-based user authentication**, allowing users to register, login, and maintain personal chat histories securely.

This project is ideal for learning full-stack development, integrating databases, creating REST APIs, and working with conversational UI. It also provides a strong base to expand into more advanced AI-driven assistants.

---

## 🚀 Features

### 🔐 Authentication
- JWT-based login and registration
- Secure token storage in browser localStorage
- Protected routes for logged-in users only

### 💬 Chat Interface
- Responsive chat layout with user and bot messages
- Clean and minimal design using Tailwind CSS
- React state management for dynamic UI updates

### 📜 Multi-Session Support
- Sidebar with list of all previous chat sessions
- Sessions can be started, renamed, or continued
- Switching sessions loads history instantly

### 💾 Persistent Chat History
- Chat messages and sessions saved in MySQL
- Relational schema links users, sessions, and messages
- Auto-fetch on reload to maintain continuity

### 🧠 Rule-Based Response Engine
- Bot replies based on simple hardcoded rules
- Includes product FAQs, delivery info, and greetings
- Easily extendable to use NLP/GPT models

### 📊 MySQL Integration
- Structured schema with user/session/message tables
- Indexed foreign keys for relational integrity
- Efficient queries for chat retrieval and storage

---

## ⚙️ Backend Installation (Flask API)

### 🧾 Prerequisites
- Python 3.9 or above
- MySQL server
- pip (Python package manager)


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

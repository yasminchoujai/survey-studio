# Survey Studio Frontend

A web application for creating, managing, publishing, and collecting responses for surveys.

Built with **SvelteKit**, **Svelte 5**, **Tailwind CSS**, and **Zod**.

> **Note:** This frontend requires the Survey Studio Backend API to be running.
> Backend repository: [Survey Studio Backend](https://github.com/abderrahmane140/survey-studio-backend?utm_source=chatgpt.com)

---

# Features

* Create and manage surveys
* Edit survey title and description
* Create and manage questions
* Support multiple question types
* Edit question settings
* Mark questions as required
* Add descriptions and placeholders
* Add and edit choices for choice-based questions
* Duplicate questions
* Delete questions
* Drag and drop question reordering
* Save survey changes
* Publish surveys
* Access public surveys
* Submit survey responses
* View survey responses
* Display response summaries
* Client-side authentication
* JWT token management
* Runtime API response validation with Zod
* Responsive UI for desktop and mobile

---

# Tech Stack

* SvelteKit
* Svelte 5
* JavaScript
* Tailwind CSS
* Vite
* Zod
* Lucide Svelte

---

# Project Structure

```text
survey-front/
│
├── src/
│   │
│   ├── lib/
│   │   ├── api/
│   │   │   ├── auth.js
│   │   │   ├── http.js
│   │   │   ├── questions.js
│   │   │   ├── responses.js
│   │   │   ├── sections.js
│   │   │   └── surveys.js
│   │   │
│   │   ├── components/
│   │   │   ├── builder/
│   │   │   ├── preview/
│   │   │   ├── responses/
│   │   │   └── ui/
│   │   │
│   │   ├── schemas/
│   │   │   ├── auth.js
│   │   │   ├── question.js
│   │   │   ├── response.js
│   │   │   ├── survey.js
│   │   │   └── ...
│   │   │
│   │   ├── stores/
│   │   │   ├── auth.svelte.js
│   │   │   └── surveys.svelte.js
│   │   │
│   │   └── utils/
│   │       └── validate.js
│   │
│   └── routes/
│       ├── login/
│       ├── dashboard/
│       ├── builder/
│       ├── public/
│       └── ...
│
├── static/
├── .env
├── package.json
├── svelte.config.js
├── vite.config.js
├── tailwind.config.js
└── README.md
```

---

# Prerequisites

Before running the frontend, make sure you have:

* Node.js 20+
* npm
* Git
* PostgreSQL
* Survey Studio Backend

The backend must be running because the frontend communicates with it through its REST API.

---

# Backend Setup

Clone and run the backend first:

```bash
git clone https://github.com/abderrahmane140/survey-studio-backend.git
cd survey-studio-backend
npm install
```

Configure the backend `.env` file and database, then start the server:

```bash
npm run dev
```

The backend should be available at:

```text
http://localhost:3000
```

For complete backend installation and database instructions, see the:

[Survey Studio Backend README](https://github.com/abderrahmane140/survey-studio-backend?utm_source=chatgpt.com)

---

# Frontend Installation

Clone the frontend repository:

```bash
git clone https://github.com/yasminchoujai/survey-studio.git
```

Move into the frontend project:

```bash
cd survey-studio/survey-front
```

Install dependencies:

```bash
npm install
```

---

# Environment Variables

Create a `.env` file in the frontend project root.

Example:

```env
PUBLIC_API_URL=http://localhost:3000/api
```

The variable defines the URL used by the frontend to communicate with the backend API.

If the backend is running on another host or port, update the value accordingly.

---

# Run the Project

Start the development server:

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

---

# Build for Production

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

# Application Architecture

The frontend is organized into several main layers.

## API Layer

The `src/lib/api/` directory contains functions responsible for communicating with the backend.

Examples:

```text
auth.js
surveys.js
questions.js
sections.js
responses.js
http.js
```

The `http.js` file provides a reusable HTTP request function used by the other API modules.

This keeps API communication centralized instead of repeating `fetch()` logic throughout the application.

---

# Authentication

Authentication is handled using **JWT tokens**.

The authentication flow is:

```text
User
 │
 ▼
Login Page
 │
 ▼
auth.js
 │
 ▼
POST /api/auth/login
 │
 ▼
Backend returns JWT
 │
 ▼
Token stored in localStorage
 │
 ▼
GET /api/auth/me
 │
 ▼
Authenticated user
```

The authentication state is managed by:

```text
src/lib/stores/auth.svelte.js
```

The store handles:

* Login
* Logout
* Token storage
* Token restoration
* Current user information
* Authentication state
* Loading state
* Authentication errors

Protected API requests use the JWT token through the `Authorization` header:

```text
Authorization: Bearer <token>
```

---

# Runtime Validation

The frontend uses **Zod** to validate data received from the backend.

Schemas are located in:

```text
src/lib/schemas/
```

For example, the authentication schemas validate:

```text
Login response
User data
```

The validation logic is centralized in:

```text
src/lib/utils/validate.js
```

The flow is:

```text
Backend Response
       │
       ▼
     API
       │
       ▼
     Zod
       │
   ┌───┴───┐
   │       │
Valid    Invalid
   │       │
   ▼       ▼
Return   ZodError
data
```

This helps ensure that the frontend does not blindly trust the structure of API responses.

---

# Survey Management

Survey state is managed through:

```text
src/lib/stores/surveys.svelte.js
```

The store handles:

* Loading surveys
* Creating surveys
* Updating surveys
* Deleting surveys
* Loading questions
* Adding questions
* Updating questions
* Deleting questions
* Duplicating questions
* Reordering questions
* Saving changes
* Publishing surveys
* Loading responses

---

# Draft System

Survey changes are handled locally while editing.

The frontend uses a draft store to keep track of the current survey state before publishing.

```text
Open Survey
     │
     ▼
Load Backend Data
     │
     ▼
Create Local Draft
     │
     ▼
Edit Survey
     │
     ├── Add Question
     ├── Edit Question
     ├── Delete Question
     └── Reorder Questions
     │
     ▼
Save / Publish
     │
     ▼
Synchronize with Backend
```

This allows the builder to manage changes before they are synchronized with the API.

---

# Survey Builder

The survey builder provides an interface for creating and editing surveys.

Main functionality includes:

* Survey information editing
* Question type selection
* Question configuration
* Question duplication
* Question deletion
* Question reordering
* Drag and drop interactions
* Required questions
* Question descriptions
* Placeholders
* Choice options

Supported question types include:

```text
short_text
long_text
email
single_choice
multiple_choice
rating
```

---

# Public Survey

Published surveys can be accessed through the public survey route:

```text
/public/:id
```

The public survey page:

1. Loads the published survey from the backend.
2. Displays its questions.
3. Allows users to provide answers.
4. Validates required answers.
5. Submits the response to the backend.

---

# Responses

The frontend provides a response interface for viewing submitted survey responses.

Response functionality includes:

* Loading responses
* Displaying response data
* Response summaries
* Viewing submitted answers

Responses are retrieved from the backend API.

---

# API Communication

The frontend communicates with the backend through REST endpoints.

Example:

```text
Frontend
   │
   │ HTTP Request
   ▼
Survey Studio Backend
   │
   │
   ▼
PostgreSQL
```

The main backend API groups used by the frontend are:

```text
/api/auth
/api/surveys
/api/questions
/api/sections
/api/responses
/api/public
```

---

# Development Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm install`     | Install dependencies     |
| `npm run dev`     | Start development server |
| `npm run build`   | Create production build  |
| `npm run preview` | Preview production build |

---

# Development Workflow

A typical local development setup requires two terminals.

### Terminal 1 — Backend

```bash
cd survey-studio-backend
npm install
npm run dev
```

Backend:

```text
http://localhost:3000
```

### Terminal 2 — Frontend

```bash
cd survey-studio/survey-front
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

The frontend then communicates with the backend API running on port `3000`.

---

# Related Repository

## Backend

The frontend depends on the Survey Studio Backend API.

[Survey Studio Backend — GitHub](https://github.com/abderrahmane140/survey-studio-backend?utm_source=chatgpt.com)

---

# Future Improvements

* Improved authentication and authorization
* Advanced survey analytics
* Pagination
* Advanced search and filtering
* More question types
* Survey sharing and invitations
* Anonymous survey responses
* Survey expiration
* Automated testing
* Improved accessibility
* Production deployment
* Performance optimization

---

# Author

**Yasmin Choujai**

Frontend Developer

Built as part of the Survey Studio MVP using SvelteKit, Svelte 5, Tailwind CSS, and Zod.

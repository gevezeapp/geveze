# GEVEZE

## Getting Started

This project is a monorepo setup using the MERN stack (MongoDB, Express, React, Node.js) along with NestJS and Redis. It utilizes Turborepo for efficient package management and builds.

### Prerequisites

Make sure you have the following installed:

- Node.js
- pnpm
- MongoDB
- Redis

### Installation

1. Clone the repository:

```bash
git clone https://github.com/gevezeapp/geveze.git
cd geveze
```

2. Install dependencies:

```bash
pnpm install
```

3. Run

```bash
npm run dev
```

### Usage

- The API is available at [http://localhost:4000](http://localhost:4000).
- The WebSocket server is available at [http://localhost:5000](http://localhost:5000).
- The React example can be accessed at [http://localhost:5173](http://localhost:5173).

### Running the Example

1. Register a new user by sending a POST request to [http://localhost:4000/auth/register](http://localhost:4000/auth/register) with the following JSON payload:

   ````json
   {
     "email": "your-email@example.com",
     "name": "Your Name",
     "password": "your-password"
   }```

   ````

2. Create a new project by sending a POST request to http://localhost:4000/projects using the token received from the registration step. Include the token in the Authorization header as a Bearer token, and send the following JSON payload:

   ```json
   {
     "name": "Your Project Name"
   }
   ```

3. Update the project key and project secret in examples/react-example/src/App.tsx to match the newly created project.

4.Finally, go to http://localhost:5173 to use the example application.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

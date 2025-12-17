# NestJS Authentication 🚀

This project implements **Authentication & Authorization** using **NestJS**.  
It includes JWT-based login, signup, and protected routes.  

<details>
<summary>📂 Project Structure</summary>

Nest-auth/
│── src/
│ ├── auth/
│ │ ├── auth.controller.ts
│ │ ├── auth.service.ts
│ │ ├── auth.module.ts
│ │ └── jwt.strategy.ts
│ ├── user/
│ │ ├── user.controller.ts
│ │ ├── user.service.ts
│ │ └── user.module.ts
│ ├── app.module.ts
│ └── main.ts
│
├── .env
├── package.json
├── tsconfig.json
└── README.md


</details>

<details>
<summary>⚙️ Installation</summary>

```bash
# Clone the repository
git clone https://github.com/Aftab1999/Nest-auth.git

# Go inside the project
cd Nest-auth

# Install dependencies
npm install


</details> <details> <summary>🚀 Running the Project</summary>

# Start development server
npm run start:dev


The app will run at:
👉 http://localhost:3000

</details> <details> <summary>🔑 Authentication Features</summary>

User Registration (Signup)

User Login with JWT

Protected Routes using JwtAuthGuard


</details> <details> <summary>📌 API Endpoints</summary>
Auth Routes

POST /auth/signup → Register a new user

POST /auth/login → Login user & return JWT

</details> <details> <summary>🛠️ Technologies Used</summary>

NestJS (Framework)

TypeScript

JWT (Authentication)

bcrypt (Password Hashing)

MongoDB / PostgreSQL (Database – depending on configuration)

</details>
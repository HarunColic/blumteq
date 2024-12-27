# Hour Entry Management

## **Project Introduction**
Hour Entry Management is a system designed to facilitate the tracking and management of time entries. The project includes both a backend for managing data storage and an API and a frontend interface for user interaction.

---

## **Technologies Used**
- **Backend:**
  - Python 3
  - Django + Django REST Framework
  - PostgreSQL
- **Frontend:**
  - React

---

## **Backend Setup and Instructions**

### **1. Create a PostgreSQL Database**
- Open a PostgreSQL manager or use the terminal.
- Create a new database named **`blumteq`** with a PSQL user with the following credentials:
  - **User:** `postgres`
  - **Password:** `postgres`

```sql
CREATE DATABASE blumteq;
```

---

### **2. Setup a Python Virtual Environment**
- Ensure Python 3 is installed.
- Navigate to the root directory (`blumteq`).
- Run the following commands to create and activate a virtual environment:
  ```bash
  python3 -m venv venv
  source venv/bin/activate
  ```

---

### **3. Install Dependencies**
- Navigate to the backend directory (`timemanagement`):
  ```bash
  cd timemanagement
  ```
- Install all required packages:
  ```bash
  pip install -r requirements.txt
  ```

---

### **4. Apply Database Migrations**
- Run the migrations to set up the database schema:
  ```bash
  python3 manage.py migrate
  ```

---

### **5. Seed the Database (Optional)**
- Populate the database with test data:
  ```bash
  python3 manage.py seed
  ```
  - **Flags:**
    - `--mode=refresh`: Clears existing data and creates a fresh dataset (default behavior if no flag is provided).
    - `--mode=clear`: Deletes all existing data without creating a new dataset.
- Seeded users:
  - **Usernames:** `PrviUser`, `DrugiUser`, `TreciUser`
  - **Password:** `DobraSifraPosve123`

---

### **6. Run the Development Server**
- Start the backend server:
  ```bash
  python3 manage.py runserver
  ```
  
#### **Swagger documentation**
The detailed API documentation can be found at
  ```
  http://127.0.0.1:8000/docs/
  ```

---

### **7. Run Unit Tests(Optional)**
For unit testing, I have decided to go for pytest because it is both the simplest and most versatile library for unit testing
- Go to the root directory of the backend project (`timemanagement`):
  ```bash
  pytest
  ```

---

## **Frontend Setup and Instructions**

### **1. Install Dependencies**
- Navigate to the frontend project directory (`timemanagement_FE`):
  ```bash
  cd timemanagement_FE
  ```
- Install all required packages:
  ```bash
  npm install
  ```

---

### **2. Run the Development Server**
- Start the frontend server:
  ```bash
  npm run dev
  ```

---

## **Notes**
- Ensure that both the backend server and frontend server are running for full functionality.
- If you encounter any issues, verify the PostgreSQL credentials, package installations, or seeded test data.


### **Algorithms**
Algorithms part of the task is found in the base directory / `algorithm1.py` and `algorithm2.py`
=======
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Team Feedback Manager

A full-stack application built with **React.js** (frontend), **Django** (backend), and **SQLite** (database) to manage team feedback between managers and employees.

---
deployed URL : [https://feedback-nu-three.vercel.app]


## 🔧 Tech Stack

- **Frontend**: React.js  
- **Backend**: Django & Django REST Framework  
- **Database**: SQLite  
- **Authentication**: Email-based custom user model  
- **Testing Accounts**:
  - **Manager**
    - Email: `v@gmail.com`
    - Password: `123456`
  - **Employees**
    - `v4@gmail.com`
    - `v5@gmail.com`
    - `v6@gmail.com`
    - Password: `123456`

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/vamsi0874/feedback.git

cd backend
python -m venv env
source env/bin/activate   # On Windows: env\Scripts\activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver

cd ../frontend
npm install
npm start

```
```bash
cd backend/my_app
docker compose up --build
```

# Project Overview
This project is a Team Feedback Management System built using React.js for the frontend and Django for the backend with an SQLite database. It facilitates structured communication between managers and their employees through feedback.

# User Authentication & Roles
Uses a custom user model that supports login and registration.

During registration, the user can select a role:

manager

employee (default if none selected)
---
# Roles and Dashboards
# Manager Dashboard
Displays a list of feedback entries given to their assigned employees.

A manager can:

Create new feedback for any employee under them.

Edit/update existing feedback.

Each feedback contains:

Title

Description

Date

---
 Acknowledgment status (whether the employee has acknowledged it)

Comments from the employee (if any)

 Employee Dashboard
Displays feedback addressed to the logged-in employee.

The employee can:

Acknowledge feedback by marking it as seen/read.

Comment on feedback with thoughts, clarifications, or responses.

 ## Feedback Flow
Manager creates feedback for a team member.

Employee logs in, views feedback.

Employee can:

Acknowledge the feedback

Leave a comment

Manager sees updates (acknowledgments and comments).







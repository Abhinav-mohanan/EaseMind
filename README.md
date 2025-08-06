# EaseMind - Mental Health & Therapy Platform
EaseMind is a full-stack mental health management platform built with **Django (REST Framework)** 
for the backend and **React** for the frontend. It provides a secure, interactive environment for users to connect with verified psychologists for counseling, and stress relief.

## Features

### Authentication
- JWT-based login/signup
- Role-base access : User,Psychologist,Admin

### Profile Management
- Users and Psychologists have different profile fields
- Admin approval for psychologist verification
- Profile picture upload via Cloudinary

### Appointment System
- Psychologists set availability
- Users book 1-on-1 sessions
- Razorpay integration for payments
- Slot locking 
- Cancellation & refund

### Articles & Content
- Psychologists can post and edit articles
- Admin can manage article visibility

### Wallet System
- Transactions for credits & refunds


## 🔧 Setup Instructions

## Prerequisites
- Node.js and npm (for frontend)
- Python and pip (for backend)
- PostgreSQL database

### 1️⃣ Backend (Django)

```bash

# Clone the repository
https://github.com/Abhinav-mohanan/EaseMind.git
cd Backend

# Create virtual environment
python -m venv env
source env/bin/activate   # or env\Scripts\activate on Windows

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

### 2️⃣ Frontend (React)

```
# Navigate to the frontend directory
cd frontend

# Install dependencies:
npm install

Start the development server
npm run dev
```

### Technologies Used

- ***Backend***: Django, DRF, JWT,

- ***Frontend***: React, Axios, TailwindCSS

- ***Payments***: Razorpay

- ***Media***: Cloudinary

- ***Database***: PostgreSQL

### Contact 
For any inquiries, reach out to **Abhinav Mohanan** at abhinavmohanan018@gmail.com

# EaseMind - Mental Health & Therapy Platform

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)
![Django](https://img.shields.io/badge/Django-4.0%2B-green.svg)
![React](https://img.shields.io/badge/React-18-blue)
![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED.svg)

**EaseMind** is a comprehensive, full-stack mental health management platform designed to connect users with verified psychologists for counseling and stress relief. 
Built with a robust Django backend and a responsive React frontend, it features secure video consultations, real-time chat, appointment management, and automated background processing.

## Features

### Authentication & Security
* **JWT Authentication:** Secure login and signup processes.
* **Role-Based Access Control (RBAC):** Distinct workflows for **Users**, **Psychologists**, and **Admins**.
* **Verification:** Admin approval workflow to verify psychologist credentials before they go live.

### Appointment & Booking System
* **Slot Management:** Psychologists define their availability.
* **Smart Booking:** Users book 1-on-1 sessions with slot locking to prevent double-booking.
* **Payments:** Integrated **Razorpay** for secure transactions and refunds.
* **Wallet System:** Internal user wallet for managing credits and simplified refunds.

### Real-Time Communication (Telehealth)
* **Video Consultations:** Secure, high-quality video calls powered by **ZEGOCLOUD**.
* **Live Chat:** Real-time messaging between users and psychologists using **WebSockets** (Django Channels & Redis).

### Background Processing & Automation
* **Task Scheduling:** Powered by **Celery & Celery Beat**.
* **Automated Reminders:** Notifications sent before appointments.
* **Housekeeping:** Auto-unlocking of slots and handling expired appointments.

### Content Management
* **Articles:** Psychologists can publish mental health resources.
* **Moderation:** Admin controls for article visibility and content management.


##  Tech Stack

### Backend
| Component | Technology |
| :--- | :--- |
| **Framework** | Django & Django REST Framework (DRF) |
| **Real-Time** | Django Channels (ASGI/Daphne) |
| **Task Queue** | Celery & Celery Beat |
| **Database** | PostgreSQL |
| **Broker** | Redis |
| **Authentication** | Simple JWT |


### Frontend
| Component | Technology |
| :--- | :--- |
| **Framework** | React (Vite) |
| **State Mgmt** | Redux Toolkit |
| **Styling** | Tailwind CSS |
| **HTTP Client** | Axios |


### Third-Party Services
* **Payments:** Razorpay
* **Media Storage:** Cloudinary
* **Video SDK:** ZEGOCLOUD


## 🔧 Installation & Setup


### Prerequisites
- Node.js and npm (for frontend)
- Python and pip (for backend)
- PostgreSQL database
- Docker & Docker Compose

### 1️⃣ Backend (Django)

Option 1: Docker Setup (Recommended)

```bash
# Clone the Repository
git clone https://github.com/Abhinav-mohanan/EaseMind.git
cd Backend

# Configure Environment Variables Create a .env file in the Backend/ directory (see Environment Variables below)

# Build and Run Containers
docker-compose up -d --build

# Initialize Database
docker-compose exec web python manage.py migrate
docker-compose exec web python manage.py createsuperuser

```
Option 2: Manual Local Setup

```bash

# Clone the repository
git clone https://github.com/Abhinav-mohanan/EaseMind.git
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

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies:
npm install

# Start the development server
npm run dev
```
### Environment Variables
Create a .env file in backend directory with the following configurations:



```bash
# General
DEBUG=0
SECRET_KEY=your_django_secret_key
ALLOWED_HOSTS=localhost,127.0.0.1,api.yourdomain.com

# Database 
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=db  # Use 'localhost' if running without Docker
DB_PORT=5432

# Redis & Celery
CELERY_BROKER_URL=redis://redis:6379/0
CELERY_RESULT_BACKEND=redis://redis:6379/0

REDIS_HOST=redis  # Use '127.0.0.1 (localhost)' if running without Docker
REDIS_PORT=6379

# Third-Party Services
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

ZEGO_APP_ID=your_zegocloud_app_id
ZEGO_SERVER_SECRET=your_zegocloud_server_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# OTP Configuration
OTP_EXPIRY_MINUTES=5

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your_email@example.com
EMAIL_HOST_PASSWORD=your_email_password
DEFAULT_FROM_EMAIL=your_email@example.com

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://your-frontend-domain.com
```

## 👨‍💻 Author
Abhinav Mohanan  
*Software Engineer*  
📧 Email: abhinavmohanan018@gmail.com

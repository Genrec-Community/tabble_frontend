# Tabble - Hotel Management App

Tabble is a comprehensive hotel management application that allows chefs to manage dishes, customers to place orders, and administrators to oversee operations.

## Features

### Chef Portal
- Add, edit, and delete dishes
- Upload dish images
- View and manage pending orders
- Mark orders as completed

### Customer Portal
- Browse menu by category
- Add items to cart
- Place orders with special instructions
- Request payment

### Admin Portal
- View order statistics
- Manage all orders
- Mark orders as paid

## Technology Stack

- Backend: FastAPI with Uvicorn
- Frontend: HTML, CSS, JavaScript (with Bootstrap)
- Database: SQLite

## Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/tabble.git
cd tabble
```

2. Create a virtual environment and activate it:
```
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```
pip install -r requirements.txt
```

4. No database configuration needed - SQLite database will be created automatically

5. Run the application:
```
python run.py
```

6. Access the application:
   - From the same computer: http://localhost:8000
   - From other devices on your network: Use the URL displayed in the console when you start the application

7. If you're having trouble accessing the application from other devices, check your firewall settings:
```
python check_firewall.py
```

## Database Setup

The application uses SQLite, which doesn't require any setup. The database file (tabble.db) will be created automatically in the project root directory when you first run the application.

## Project Structure

```
tabble/
├── app/
│   ├── main.py                 # FastAPI application entry point
│   ├── database.py             # Database connection and models
│   ├── routers/                # API route handlers
│   │   ├── chef.py
│   │   ├── customer.py
│   │   └── admin.py
│   ├── models/                 # Pydantic models for request/response
│   │   ├── dish.py
│   │   ├── order.py
│   │   └── user.py
│   └── static/                 # Static files (CSS, JS, images)
│       ├── css/
│       ├── js/
│       └── images/
├── templates/                  # HTML templates
│   ├── chef/
│   │   ├── index.html
│   │   └── orders.html
│   ├── customer/
│   │   ├── login.html
│   │   └── menu.html
│   └── admin/
│       └── index.html
├── requirements.txt            # Project dependencies
└── README.md                   # Project documentation
```
# Hotel and Travel Booking System

Full Stack Java project: React (frontend) + Spring Boot (backend) + MySQL.

```
hotel-travel-booking/
├── backend/    Spring Boot 3, Java 17, Maven   -> http://localhost:8080
└── frontend/   React 18 + Vite + Bootstrap 5   -> http://localhost:5173
```

## 1. Database
Install MySQL and make sure it is running. The database `hotel_booking_db` is created automatically
(`createDatabaseIfNotExist=true`). You can also create it yourself in MySQL Workbench:

```sql
CREATE DATABASE hotel_booking_db;
```

## 2. Run the backend (VS Code terminal)
1. Open `backend/src/main/resources/application.properties` and set `spring.datasource.password`.
2. Run:
```bash
cd backend
mvn spring-boot:run
```
Success looks like: `Started BackendApplication in ... seconds`.

On first start the app adds sample data and an admin account:

| Role  | Email           | Password  |
|-------|-----------------|-----------|
| Admin | admin@hotel.com | Admin@123 |

## 3. Run the frontend (a second VS Code terminal)
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173

## REST API summary
| Method | URL | Who |
|--------|-----|-----|
| POST | /api/auth/register, /api/auth/login | public |
| GET | /api/hotels?city=&name= | public |
| GET | /api/hotels/{id}, /api/hotels/{id}/rooms | public |
| GET | /api/hotels/{id}/availability?checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD | public |
| GET | /api/packages, /api/packages/{id} | public |
| POST | /api/bookings | logged-in user |
| GET | /api/bookings/my | logged-in user |
| PUT | /api/bookings/{id}/cancel | logged-in user (owner) |
| GET | /api/admin/dashboard, /api/admin/bookings | admin |
| POST/PUT/DELETE | /api/admin/hotels, /api/admin/hotels/{id} | admin |
| POST | /api/admin/hotels/{id}/rooms | admin |
| PUT/DELETE | /api/admin/rooms/{id} | admin |
| POST/PUT/DELETE | /api/admin/packages, /api/admin/packages/{id} | admin |

Protected APIs need the header `Authorization: Bearer <token>` (the token comes from the login response).

## Test in Postman
1. POST `http://localhost:8080/api/auth/login` with JSON `{"email":"admin@hotel.com","password":"Admin@123"}`
2. Copy the `token` from the response.
3. GET `http://localhost:8080/api/admin/dashboard` -> Authorization tab -> Bearer Token -> paste it.

## Push to GitHub
```bash
git init
git add .
git commit -m "Hotel and Travel Booking System"
git branch -M main
git remote add origin https://github.com/<your-username>/hotel-travel-booking.git
git push -u origin main
```

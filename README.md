# Ucab – Cab Booking & Car Rental (MERN Stack)

A full-stack cab booking and car rental system: book rides, track drivers, make payments, and rent cars. Built with **MongoDB, Express.js, React.js, and Node.js (MERN)**. Includes JWT authentication, role-based access (User, Driver, Admin), fare estimation, ride status tracking, and payment with receipt generation.

---

## 1. Environment Setup

### Prerequisites

- **Node.js** v16+ and **npm**
- **MongoDB** (local or Atlas)
- **Git** for version control
- **Postman** (or similar) for API testing

### Backend setup

```bash
cd backend
npm install
```

Create `.env` (see `.env.example`):

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/car-rental-db
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
```

- **Express**, **Mongoose**, **JWT**, **Bcrypt** are used for API, DB, auth, and password hashing.

### Frontend setup

```bash
cd frontend
npm install
```

- **React**, **React Router**, **Axios**, **React Hook Form**, **Tailwind CSS** for UI and API calls.

### Admin panel

```bash
cd admin-panel
npm install
```

---

## 2. Database Design (MongoDB)

| Collection   | Purpose |
|-------------|---------|
| **Users**   | User, Driver, Admin accounts (name, email, password hashed with bcrypt, phone, role) |
| **Drivers** | Driver profiles (user ref, license number, vehicle type/number, verified flag) |
| **Rides**   | Cab rides (user, driver, pickup/drop location, fare, status: requested→accepted→pickup→ongoing→completed) |
| **Payments**| Payment records (ride ref, amount, method, status, transactionId) – linked to completed rides |
| **Cars**    | Fleet for car rental (name, brand, model, category, pricePerDay, image, availability) |
| **Categories** | Car categories (Bike, Sedan, SUV, etc.) |
| **Bookings**   | Car rental bookings (user, car, start/end date, total price, status) |

Each ride links to a user and driver; payments map to completed rides.

---

## 3. Application Modules

- **User registration and login** – JWT, bcrypt (backend); Login/Register pages (frontend).
- **Driver registration and verification** – Driver signup with license/vehicle; admin verifies drivers (backend + admin panel).
- **Cab booking and ride management** – Request ride (pickup/drop, fare estimate), driver accepts, status flow: requested → accepted → pickup → ongoing → completed.
- **Search nearby cabs & fare estimation** – Fare estimate API by distance; “available rides” for drivers.
- **Real-time ride tracking** – Status updates from pickup to drop (requested → accepted → pickup → ongoing → completed); track on Ride detail page.
- **Online payment and receipt** – Pay for completed ride (UPI/card/cash/wallet); receipt view by payment ID.
- **Booking history** – My Rides (cab) and My Bookings (car rental); support via booking/ride history.

Full CRUD, routing, and validation are implemented across these modules.

---

## 4. Role-Based Security

- **JWT** for user and driver login; token in `Authorization: Bearer <token>`.
- **Roles:** `user`, `driver`, `admin` with restricted routes:
  - **User:** book cab, my rides, car browse/book, my bookings, payment.
  - **Driver:** driver dashboard, available rides, accept ride, update ride status.
  - **Admin:** verify drivers, view all rides/payments/users; car/category/booking management in admin panel.
- **Passwords** hashed with **bcryptjs**; secure session via JWT.

---

## 5. Frontend Integration

- **React.js** with **Tailwind CSS** for responsive layouts.
- **Axios** for API calls (interceptors for token and error handling).
- **React Router** for navigation; **React Hook Form** for forms.
- **State:** Auth and cab/ride/booking state via React Context and component state; live ride status via ride detail and driver dashboard.

---

## 6. Testing & Validation

- Test CRUD for users, drivers, rides, payments, cars, categories, bookings.
- Test auth: register, login, protected routes, role-based redirects.
- Test ride flow: request → accept → pickup → ongoing → complete → pay → receipt.
- Validate booking details, fare estimation, and payment creation.
- Verify responsive layout on different screen sizes.

Use **Postman** (or similar) for API testing; set `Authorization: Bearer <token>` for protected routes.

---

## 7. Monitoring & Optimization

- **Request logging** in Express (method, URL, status, duration).
- **Error handling** middleware for consistent API error responses.
- Modular **routes and controllers** for scalability; real-time behaviour via polling (e.g. refresh ride detail/driver list).

---

## Run the project

1. Start **MongoDB**.
2. **Backend:**  
   `cd backend && npm install && npm run seed:admin && npm run seed:cars && npm run dev`  
   → API: **http://localhost:5000**
3. **Frontend:**  
   `cd frontend && npm install && npm run dev`  
   → App: **http://localhost:3000**
4. **Admin panel:**  
   `cd admin-panel && npm install && npm run dev`  
   → Admin: **http://localhost:3001**

**Seeded admin:** `admin@carrental.com` / `admin123`

---

## API overview

| Area     | Endpoints |
|----------|-----------|
| Auth     | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` |
| Drivers  | `POST /api/drivers/register`, `GET /api/drivers/profile`, `GET /api/drivers/rides`, `GET /api/drivers/available`, Admin: `GET /api/drivers`, `PUT /api/drivers/:id/verify` |
| Rides    | `GET /api/rides/estimate?estimatedDistance=5`, `POST /api/rides`, `GET /api/rides/my`, `GET /api/rides/:id`, `PUT /api/rides/:id/status`, `PUT /api/rides/:id/accept`, Admin: `GET /api/rides` |
| Payments | `POST /api/payments`, `GET /api/payments/my`, `GET /api/payments/:id/receipt`, Admin: `GET /api/payments` |
| Cars     | `GET /api/cars`, `GET /api/cars/:id`; Admin: CRUD + image upload |
| Bookings | `POST /api/bookings`, `GET /api/bookings/my`, `PUT /api/bookings/:id/cancel`; Admin: list, status |
| Users    | Admin: `GET /api/users` |

Use **Git** for version control and **Postman** to test these endpoints.

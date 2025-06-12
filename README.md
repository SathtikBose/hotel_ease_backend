# 🏨 Hotelease Backend

This is the backend for the Hotelease application, providing RESTful APIs for hotel room booking, user authentication, and management.

## 🚀 Features

- User authentication (signup, login, JWT, password reset)
- Room management (CRUD for rooms)
- Booking system (book, view, cancel)
- User profile and settings
- Centralized error handling
- Email notifications (for password reset)

## 📁 Project Structure

- `index.js`, `server.js` – Server entry and setup
- `controller/` – Route controllers
- `models/` – Mongoose models (User, Room, Booking)
- `routes/` – API route definitions
- `middleware/` – Error handling, validation, auth
- `utils/` – Utility functions (email, error, async)
- `data/` – Static data (rooms)
- `public/` – Static assets (images, audio)

## 🛣️ Main Endpoints

- `/api/users` – User actions
- `/api/rooms` – Room actions
- `/api/bookings` – Booking actions

## 🛠️ Setup

1. Install dependencies:
   ```sh
   npm install
   ```
2. Set up your `.env` file (see `config.env` for required variables).
3. Seed rooms (optional):
   ```sh
   node seedRooms.js
   ```
4. Start the server:
   ```sh
   npm start
   ```

## 📬 Contact

For issues or contributions, open an issue or pull request.

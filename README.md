# Assistance365 web app Development Roadmap

This document outlines the roadmap to develop a web application for managing client-worker relationships, including hour tracking and notifications. The app is designed to facilitate efficient management and reporting for admins, workers, and clients. test

## Project Overview

### **Features**
- **Admin**:
  - Manage worker and client accounts.
  - Assign workers to clients.
  - Receive notifications when workers log hours.
  - Approve or decline work logs submitted by workers.
  - Generate detailed monthly reports for each client and worker.

- **Worker**:
  - Log daily work hours and descriptions for assigned clients.
  - View assigned clients and submitted logs.
  
- **Client**:
  - Review and approve or decline logged hours and descriptions submitted by workers.
  - Receive notifications when workers submit logs.

---

## Technology Stack

### **Frontend**
- Framework: **NextJS** (React-based framework for building server-rendered web apps).
- Styling: **Tailwind CSS** and **DaisyUI** for prebuilt UI components.

### **Backend**
- Framework: **FastAPI** (Python framework for building high-performance APIs).
- Notifications: Email-based notifications using **FastAPI-Mail**.

### **Database**
- Relational Database: **PostgreSQL** for structured data storage.

### **Cache**
- **Redis**: For performance optimization and queuing notifications.

### **Hosting**
- Frontend: **Vercel** (optimized for NextJS).
- Backend: **Render** or **DigitalOcean**.
- Database: **Supabase** or **ElephantSQL**.

---

## Development Roadmap

### **Phase 1: Define Requirements and Architecture**
1. Design a relational database schema:
   - `Users`: Stores user data (roles: Admin, Worker, Client).
   - `Clients`: Stores client details.
   - `Workers`: Stores worker details.
   - `WorkLogs`: Records work hours, descriptions, and statuses (pending, approved, declined).
2. Plan the API endpoints:
   - Authentication: `/auth` (login, logout, registration).
   - CRUD for clients, workers, and assignments.
   - Logging work hours: `/work-logs`.
   - Notifications: `/notifications`.
   - Reports: `/reports` (monthly reports).

### **Phase 2: Backend Development (FastAPI)**
1. **Authentication**:
   - Implement OAuth2 with JWT for secure login.
   - Role-based access control.
2. **API Endpoints**:
   - Manage accounts (Admin-only):
     - Create, update, and delete client/worker accounts.
   - Assign workers to clients.
   - Record and retrieve work logs.
   - Generate monthly reports:
     - Include total hours worked and descriptions for each client and worker.
3. **Notifications**:
   - Integrate `FastAPI-Mail` for email notifications.
   - Notify clients and admins when workers submit logs.
   - Notify workers when clients approve or decline logs.
4. **Database Integration**:
   - Use **SQLAlchemy** or **Tortoise ORM** to interact with PostgreSQL.
5. **Testing**:
   - Write unit tests using `pytest`.

### **Phase 3: Frontend Development (NextJS)**
1. **Authentication**:
   - Build login and registration pages.
   - Implement role-based dashboards:
     - Admin Dashboard: Manage accounts, view reports, and notifications.
     - Worker Dashboard: Log hours, view logs, and notifications.
     - Client Dashboard: Review and manage work logs.
2. **Admin Panel**:
   - Manage accounts (CRUD operations for workers and clients).
   - Assign workers to clients.
   - View reports and logs.
3. **Worker Panel**:
   - Log daily work hours and descriptions.
   - View assigned clients and previous logs.
4. **Client Panel**:
   - Review, approve, or decline logged hours.
   - Notifications for submitted logs.
5. **Styling**:
   - Use Tailwind CSS for custom styles.
   - DaisyUI for prebuilt components (e.g., dropdowns, tables).
6. **API Integration**:
   - Use `axios` or `fetch` for communicating with the FastAPI backend.

### **Phase 4: Notification System**
1. Implement email notifications with **FastAPI-Mail**:
   - Setup email provider (e.g., Gmail or SendGrid).
   - Notify all relevant users upon work log submissions or actions.
2. Ensure notifications are queued efficiently with Redis (optional).

### **Phase 5: Reports**
1. Generate detailed monthly reports for the admin:
   - Total hours worked per client.
   - Total hours logged by each worker.
   - Export reports as CSV or PDF.
2. Display reports in the admin dashboard.

### **Phase 6: Hosting and Deployment**
1. **Frontend**:
   - Deploy the NextJS app on **Vercel**.
2. **Backend**:
   - Host FastAPI on **Render** or **DigitalOcean**.
   - Use **Gunicorn** for serving the app in production.
3. **Database**:
   - Host PostgreSQL on **Supabase** or **ElephantSQL**.
4. **Domain and SSL**:
   - Register a custom domain.
   - Use **Cloudflare** for free SSL.

---

## Future Enhancements
- Add mobile app integration (iOS/Android) using the FastAPI backend.
- Implement real-time notifications with WebSockets.
- Introduce SMS notifications if needed.

---

## License
This project is open-source and available under the MIT License.

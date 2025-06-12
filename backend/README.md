
### **Backend** ✅
- Framework: **FastAPI**
- Notifications: Email-based notifications using **FastAPI-Mail**.

### **Database**
- Relational Database: **PostgreSQL** for structured data storage.

### **Cache**
- **Redis**: For performance optimization and queuing notifications.


### **Phase 1: Define Requirements and Architecture**
1. Design a relational database schema:
   - `Users`: Stores user data (roles: Admin, Worker, Client). ✅
   - `Clients`: Stores client details. ✅
   - `Workers`: Stores worker details. ✅
   - `Contracts`: Contracts between workers and clients with detailed hours count and sessions. ✅
   - `Meetings`: Records work hours, descriptions, and statuses (pending, approved, declined). ✅
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


### **Phase 4: Notification System**
1. Implement email notifications with **FastAPI-Mail**:
   - Setup email provider (e.g., Gmail or SendGrid).
   - Notify all relevant users upon work log submissions or actions.
2. Ensure notifications are queued efficiently with Redis (optional).

<!-- 
{
  "type": "service_account",
  "project_id": "asistanz365",
  "private_key_id": "f4f5b479c06a32f57e1ca698e9753ca44b7cb769",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCs9keH1U4g8f9R\nx469ZUqc7KoC+kflPHUBMxsFlIgW6H+u6imQeqf0xRG3LGv9sFK5lJgf1qjqQkiB\naAFMLpGUEmc7n2rFlwDJzhCrtTfd+oyduZpWXdI+HzAew/Xsh0Ky4iMclf+fS5c/\npEYgsyJ2aJ5WSVkaDe5Igty7yz1Prt8fwHDXUt/aH2/niJzCqG2ZGfTPnTUE5kPu\nSTnYOQvgrLqyRDabZOeYgwFYNGJm7xK+DCxMWaZhjG09F6ybOBKd4lShotNPwrSG\nfW1Knwzn34lV2h4ykWNxXleNQFS2b7ow1yinJAxjbckmKw9s1x63vi7DtQ0LrdFL\nyRevjAkvAgMBAAECggEAMYnGOgLfgjMdl/wqh1dkE+b62Kh7gA4dSu8qvaHpinoj\n2+LIbc+bnFD3Pnn0IjBmuS10lqXiMloyrxGtUXcDDiBpPdvudlJGEQa6optgOW1B\n6gjXSgZMKavAGgexP4IMGfUH7m+Ny7+YPcucpE/6PmS/eOJAKWS1C0Kj2wueb1wj\nlUhiktb9lvxt5DQ4VdMuoRmCcNe938DKe+YX6UIAiOJBJSuVNtY1TkGtcpjZmn6F\nkbXARujKmu4kllh7zuahNBoBwuCjIHLbuaaXpB12e3nBXoReAQ5juy8R+CWkcroe\nwIFlTysuSyW8AccD5pygMWLcW26uosOjntk0mFgcUQKBgQDSf81ZSvewk1ZdoBZK\nA6Tx+fjJp1uPRe56Y9xXVJGkVxuOBbEu+iUlbrcj7/2zfx8wrgFWo8MQSQzv7VZB\nFoguR5h4OfSNhheanpbkSzyITcg6gCcLNGWBLGdwtzioXI1+sLlDaC4rVGefoix6\nUh2MvtXSSGcaNw/Ip6QARLWwHwKBgQDSWVEOTGCiWdvHNh4QhHFzOumcpsHTQCmV\nsRGZQC3T2vNPM2hQ2wy8NClqMxg/ENWvcoOhWl72ORxkeeP2yeOnt8sl86c8MSSt\ntI+pRuPBHA/dDXF+WUcMNN+zXlZwzrrfShRPadHAYGW3uSgfZXFPR75rd16ILcZW\nPLal9ydE8QKBgDh1gvSSQQEhY6bVC2VquNEWRP6BXvN8xEwbgLwDuNSlcISVTkLV\nYSU7HvAKrLd6PzllUoKUhftWPJwVwm7OxlPzbBfDI67Z6nbUVpCBBYlho3Tdbpt4\nwEj3Sf9XhWDTAjia2fYUeV2x0+FjNB7S644WmW8/cDf90MP3Auv3gevtAoGBANCU\nlJWTEveqFw7xENrcGgtjTadyjBxIMXQoAwVt6IN9R2sv1K7opzYwmyidxdszfFDf\nQrtK+4M4mnjfjTd4dnAnBiB5/UjoijBdLV9z1f/1LZ3K6NGbAaKPA4u/bgOqWw9z\nS7R7f+w9KmAGEE0hsDwnLiEuWuS6T0PQLGViMORhAoGAHC+zd9oJmgXdpwkFsNOX\nAAyo7cTxtNLpaLAF/lis4nS3/qUksi93mY8UlUh0MD+OPAoaQMWvo1i6fJLaJiA4\n+pqsKx0uNQmkgYCglLDnJwHYzGTVApXBqz5GCmgv0nn9AC6f9djP1aq3AXcXbEYc\nSuv86jBYIggjyxzy+xpz+zg=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@asistanz365.iam.gserviceaccount.com",
  "client_id": "117182647317301736722",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40asistanz365.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
} -->

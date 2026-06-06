🏙️ CityResolved - Public Infrastructure Issue Reporting System

**CityResolved** is a comprehensive digital platform designed to bridge the gap between citizens and municipal authorities. It enables citizens to report real-world infrastructure issues (like potholes, broken lights, garbage overflow) and allows government staff to track, manage, and resolve them efficiently.


## 🔗 Live Links
- **Live Website:** [(https://city-resolved.web.app/)]
- **Client Repository:** [(https://github.com/S-Arafin/City-Resolved)]
- **Server Repository:** [(https://github.com/S-Arafin/City-Resolved-Backend)]

---

## 🔐 Demo Credentials
Use these credentials to test the different roles and functionalities of the application.

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `arafin@assignment11.com` | `arafin@assignment11` | Full Control, Manage Users/Staff, Analytics |
| **Staff** | `sultan@thetown.com` | `123456` | Manage Assigned Issues, Update Status |

---

## ✨ Key Features

1.  **Role-Based Access Control (RBAC):** Distinct dashboards and functionalities for three specific roles: **Admin**, **Staff**, and **Citizen** (User), secured by JWT verification.
2.  **Issue Reporting System:** Citizens can report issues with detailed descriptions, categories, locations, and image uploads (hosted via ImageBB/Cloudinary).
3.  **Real-Time Status Tracking:** Issues move through a defined lifecycle (`Pending` → `In-Progress` → `Resolved` → `Closed`) with instant status updates in the UI.
4.  **Interactive Timeline:** Every issue has a detailed audit log/timeline tracking who updated the issue, what changed, and when (e.g., "Assigned to Staff", "Priority Boosted").
5.  **Secure Payment Integration:** Integrated **Stripe** payment gateway allowing users to:
    * **Boost** an issue's priority to "High" for faster attention.
    * **Subscribe** to a Premium plan for unlimited reporting limits.
6.  **Admin Management Suite:** Admins can view comprehensive statistics, block/unblock users, add new staff members, and assign specific issues to staff.
7.  **Staff Workflow:** Staff members have a dedicated view to see tasks assigned specifically to them and can update the status as they work on the fix.
8.  **Public Upvote System:** A community-driven feature where logged-in users can upvote issues to highlight their importance.
9.  **Advanced Search & Filtering:** Users can search for issues by title and filter by category, status, or priority on the "All Issues" page.
10. **Data Visualization:** Admin and Staff dashboards feature graphical charts (Recharts) to visualize stats like "Total Revenue", "Resolved vs Pending Issues", and "User Growth".
11. **Responsive Design:** Fully responsive interface built with **Tailwind CSS** and **DaisyUI**, ensuring a seamless experience on mobile, tablet, and desktop.
12. **Secure API:** Backend routes are protected using JWT tokens and Admin/Staff verification middleware to prevent unauthorized access.

---

## 🛠️ Technology Stack

### Frontend
* **React.js:** Component-based UI architecture.
* **Tailwind CSS & DaisyUI:** For rapid, responsive, and modern styling.
* **TanStack Query (React Query):** For efficient data fetching, caching, and state synchronization.
* **Axios (Secure):** Custom hooks with interceptors to handle JWT tokens and 401/403 errors automatically.
* **React Router DOM:** For seamless client-side navigation.
* **Recharts:** For data visualization on dashboards.
* **Stripe.js:** For secure payment processing.
* **SweetAlert2:** For beautiful, interactive popup notifications.

### Backend
* **Node.js & Express.js:** Robust REST API server.
* **MongoDB:** NoSQL database for flexible data storage.
* **Firebase Admin SDK:** For secure server-side user verification and management.
* **JWT (JSON Web Tokens):** For secure authentication and authorization.

### Authentication
* **Firebase Authentication:** Google Sign-in and Email/Password authentication.

---

## 🛡️ Security Measures

The application employs a multi-layered security strategy to protect user data and prevent unauthorized access:

* **Environment Variables:** Sensitive keys (Firebase Config, Stripe Secret, MongoDB URI) are stored strictly in `.env` files and are never committed to version control.
* **JWT Verification:** All private and admin routes on the server are protected by a `verifyToken` middleware that validates the Firebase ID token before processing the request.
* **Role-Based Middleware:** Critical actions (like managing users or resolving issues) are guarded by specific checks (e.g., `verifyAdmin`) to ensure only authorized personnel can execute them.
* **Axios Interceptors:** The client-side `useAxiosSecure` hook automatically attaches the access token to the `Authorization` header and intercepts 401/403 errors to log out users with invalid sessions.
* **Secure Payment Handling:** Stripe integration ensures that credit card information is never stored on our servers; payments are processed securely via `clientSecret`.
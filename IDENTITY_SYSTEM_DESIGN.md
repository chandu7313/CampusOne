# CampusOne Identity & Access Management (IAM) Architecture

As Senior ERP Architect, I have designed the following identity system to support the full institutional lifecycle of CampusOne.

## 1. Role Hierarchy & RBAC
The system uses **Hierarchical Role-Based Access Control (HRBAC)**.

| Role                | Access Level | Description                                                            |
| :------------------ | :----------- | :--------------------------------------------------------------------- |
| **Super Admin**     | Level 10     | Complete system control, multi-campus management, database migrations. |
| **Admin**           | Level 8      | Campus-wide management, user lifecycle, system configuration.          |
| **HOD**             | Level 6      | Departmental oversight, academic scheduling, faculty management.       |
| **Finance Officer** | Level 6      | Fee management, payroll, financial auditing.                           |
| **Faculty**         | Level-4      | Course management, grading, attendance.                                |
| **Student**         | Level 1      | Self-service, academic records, fee payments.                          |
| **Librarian**       | Level 4      | Inventory management, fine collection.                                 |
| **Hostel Warden**   | Level 4      | Room allotment, visitor logs, discipline.                              |
| **Lab Assistant**   | Level 3      | Equipment tracking, lab scheduling.                                    |
| **IT Support**      | Level 5      | Resetting credentials, hardware logs, network monitoring.              |

## 2. Database Schema (Normalization)
We follow **Table-per-Role** (Class Table Inheritance) for profiles.

- **Users Table**: Central identity (Auth, UUID, Basic common info).
- **Profiles**: Separate tables linked via `userId` (1:1 relationship).
  - `student_profiles`
  - `faculty_profiles`
  - `staff_profiles` (Shared properties for Warden, Librarian, etc.) OR individual tables for highly specialized roles.

## 3. Business Logic: Registration & Identity
- **Auto-Generation**: 
  - **Usernames**: `firstname.lastname.YEAR` (Collision check included).
  - **Registration IDs**: Prefix-based (`STU-`, `FAC-`, `STF-`).
- **Activation**: Double-opt-in via email for faculty/staff; auto-active for students upon payment.
- **Deactivation**: Soft-delete strategy using `isActive` and `deletedAt` for audit trail compliance.

## 4. Security Framework
- **Bcrypt**: 12 rounds for password hashing.
- **Session**: JWT with Refresh Tokens + HTTP-only Cookies.
- **Audit Logging**: Every write operation captured in `audit_logs` including IP, UserAgent, and Delta (before/after).

## 5. API Strategy
`POST /api/v1/admin/users`
- Accepts `role` as a discriminator.
- Uses **Transactions** to ensure both User and Profile records are created atomically.

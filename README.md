# Leave Management System - Refactored with Clean Architecture & DDD

This project has been refactored using Clean Architecture principles and Domain-Driven Design (DDD) to improve maintainability, testability, and scalability.

## Architecture Overview

### Clean Architecture Layers

```
┌─────────────────────────────────────┐
│         Presentation Layer          │  ← React Components (Web) / React Native (Mobile)
│         Application Layer           │  ← Use Cases, Custom Hooks
│         Domain Layer                │  ← Entities, Business Rules
│         Infrastructure Layer        │  ← API Calls, Repositories
└─────────────────────────────────────┘
```

### DDD Concepts Applied

- **Entities**: User, LeaveRequest, AdvanceRequest, SalaryInfo
- **Value Objects**: Money, DateRange, Status enums
- **Aggregates**: Employee (manages leave and advance requests)
- **Repositories**: Abstract data access patterns
- **Use Cases**: Application-specific business logic
- **Domain Services**: Cross-entity business rules

## Project Structure

```
├── client/                          # Web Application (React)
│   └── src/
│       ├── domain/                  # Domain Layer
│       │   └── entities.js          # Domain entities and value objects
│       ├── application/             # Application Layer
│       │   ├── useCases.js          # Business use cases
│       │   └── hooks.js             # Custom React hooks
│       ├── infrastructure/          # Infrastructure Layer
│       │   └── repositories.js      # API repositories
│       ├── presentation/            # Presentation Layer
│       │   ├── components/          # Reusable UI components
│       │   └── pages/               # Page components
│       └── shared/                  # Shared utilities
│           └── utils.js             # Common utilities and constants
├── mobile-app/                      # Mobile Application (React Native)
│   └── src/                         # Same layered structure as web
├── server/                          # Backend API (Node.js/Express)
│   └── src/                         # Clean Architecture layers
└── README.md
```

## Key Improvements

### 1. Separation of Concerns
- **Before**: Monolithic components with 500+ lines mixing UI, business logic, and API calls
- **After**: Small, focused components with clear responsibilities

### 2. Reusable Components
- Created shared components: `LeaveRequestForm`, `LeaveRequestList`, `SalaryInfo`, etc.
- Components can be used across different pages and platforms

### 3. Business Logic Isolation
- Domain rules are now in entities (e.g., `LeaveRequest.canBeModifiedBy(user)`)
- Use cases handle complex business workflows
- UI components focus only on presentation

### 4. Testability
- Business logic separated from UI allows for unit testing
- Repositories can be mocked for testing
- Use cases can be tested independently

### 5. Cross-Platform Compatibility
- Shared domain, application, and infrastructure layers between web and mobile
- Only presentation layer differs between platforms

## Running the Applications

### Web Application
```bash
cd client
npm install
npm start
```

### Mobile Application
```bash
cd mobile-app
npm install
npx expo start
```

### Backend API
```bash
cd server
npm install
npm start
```

## Development Guidelines

### Adding New Features
1. **Define Domain Entities**: Add new entities or extend existing ones in `domain/entities.js`
2. **Create Use Cases**: Implement business logic in `application/useCases.js`
3. **Add Repository Methods**: Define data access in `infrastructure/repositories.js`
4. **Create UI Components**: Build presentation components in `presentation/components/`
5. **Connect with Hooks**: Use custom hooks in `application/hooks.js` to connect UI to business logic

### Code Organization Rules
- **Max file length**: 200 lines per file
- **Single Responsibility**: Each function/class has one clear purpose
- **Dependency Direction**: Inner layers don't depend on outer layers
- **Shared Logic**: Common utilities go in `shared/` directory

### Naming Conventions
- **Use Cases**: `VerbNounUseCase` (e.g., `CreateLeaveRequestUseCase`)
- **Hooks**: `useNoun` (e.g., `useLeaveRequests`)
- **Components**: `PascalCase` (e.g., `LeaveRequestForm`)
- **Entities**: `PascalCase` (e.g., `LeaveRequest`)

## Benefits Achieved

1. **Maintainability**: Changes to business logic don't affect UI
2. **Reusability**: Components and logic can be reused across platforms
3. **Testability**: Each layer can be tested independently
4. **Scalability**: Easy to add new features without affecting existing code
5. **Developer Experience**: Clear structure makes onboarding easier

## Future Enhancements

- Add unit tests for all layers
- Implement error boundaries and global error handling
- Add TypeScript for better type safety
- Implement caching and offline support for mobile
- Add more domain validation rules
- Implement event sourcing for audit trails
   ```bash
   npm run dev
   ```

   Or run separately:
   ```bash
   # Terminal 1 - Backend
   npm run server

   # Terminal 2 - Frontend
   npm run client
   ```

3. **Access the application:**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:5000

## Default Accounts

- **Manager:**
  - Username: `admin`
  - Password: `admin123`

## Project Structure

```
HTTDD/
├── client/                 # Frontend React
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   └── App.js
│   └── package.json
├── server/                 # Backend Express
│   ├── index.js           # Main server
│   ├── database.json      # Database (auto-created)
│   └── package.json
└── package.json           # Root package.json
```

## API Endpoints

### Authentication
- `POST /api/login` - Login
- `GET /api/me` - Get current user info

### Users (Manager only)
- `GET /api/users` - Get list of users
- `POST /api/users` - Create new user
- `DELETE /api/users/:id` - Delete users

### Leave Requests
- `GET /api/leave-requests` - Get list of leave requests
- `POST /api/leave-requests` - Create new leave request
- `GET /api/leave-requests/:id` - Get request details
- `PUT /api/leave-requests/:id` - Update request (only when canEdit = true)
- `DELETE /api/leave-requests/:id` - Delete request (only when canEdit = true)
- `PATCH /api/leave-requests/:id/status` - DApprove/reject request (Manager only)

## Note

- Database is stored in `server/database.json` (auto-created on first run)
- Default JWT secret key is 'your-secret-key-change-in-production' - should be changed in production environment
- Leave requests are automatically locked (canEdit = false) after being approved/rejected

## Future Development

Possible features to add:
- More detailed permissions
- Statistics and reports
- Email notifications
- Leave calendar
- Export data to Excel/PDF


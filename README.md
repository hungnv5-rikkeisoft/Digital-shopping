# AngularWebshop

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.3.

## 🛠️ Project Tech Stack

### Frontend Framework

- **Angular 20.0** - Modern web application framework
- **TypeScript 5.8.2** - Strongly typed programming language
- **SCSS** - Enhanced CSS with variables, nesting, and mixins

### State Management

- **NgRx Store 19.2.1** - Predictable state container
- **NgRx Effects 19.2.1** - Side effect model for NgRx
- **NgRx Entity 19.2.1** - Entity management utilities
- **NgRx Store DevTools 19.2.1** - Development tools for debugging

### UI & Styling

- **Angular Material 20.0.3** - Material Design components
- **Angular CDK 20.0.3** - Component Development Kit
- **Inter Font** - Modern typography
- **Material Icons** - Icon library
- **Custom SCSS** - Dark theme with modern design

### HTTP & Authentication

- **Angular HttpClient** - HTTP communication
- **RxJS 7.8.0** - Reactive programming with observables
- **JWT Token Authentication** - Secure user authentication
- **HTTP Interceptors** - Request/response middleware

### Development Tools

- **Angular CLI 20.0.3** - Command-line interface
- **Karma & Jasmine** - Unit testing framework
- **Cypress** - End-to-end testing framework
- **TypeScript Compiler** - Code compilation
- **Path Mapping** - Clean import paths (@app, @core, @features, @shared)

### External APIs

- **DummyJSON API** - Mock e-commerce data source

## 📋 Business Flow

### 1. Authentication Flow

```
User Access → Login Component → Auth Service → API Login → JWT Token → Session Storage → Route Guard Protection
```

### 2. Product Management Flow

```
Product List → API Service → NgRx Store → Product Effects → State Update → UI Rendering
```

### 3. Favorites System Flow

```
Product Card → Add/Remove Favorite → Favorites Service → NgRx Store → Session Storage → Favorites List
```

### 4. Core Features

#### 🔐 Authentication System

- **Login/Logout functionality** with JWT token management
- **Route protection** using Angular Guards
- **Persistent sessions** with sessionStorage
- **Auto-redirect** for unauthorized access

#### 🛍️ Product Catalog

- **Product browsing** with pagination and search
- **Category filtering** and product search
- **Product details** with images, ratings, and reviews
- **Real-time product information** from DummyJSON API

#### ❤️ Favorites Management

- **Add/Remove products** to/from favorites
- **Persistent favorites** stored locally
- **Favorites list view** with complete product information
- **Toggle functionality** across the application

#### 🎨 User Experience

- **Modern dark theme** with smooth animations
- **Responsive design** for all device sizes
- **Material Design** components and patterns
- **Loading states** and error handling
- **Optimistic UI updates** for better performance

### 5. Application Architecture

The application follows **Angular's recommended architecture** with:

- **Feature-based modules** (products, favorites, auth)
- **Lazy loading** for optimal performance
- **Barrel exports** for clean imports
- **Reactive programming** with RxJS streams
- **Immutable state management** with NgRx
- **Separation of concerns** with services, guards, and interceptors

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## 🧪 Testing Strategy

### Unit Tests

The application uses **Karma** and **Jasmine** for unit testing Angular components, services, and utilities.

#### Running Unit Tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner:

```bash
# Run tests once
ng test

# Run tests with code coverage
ng test --code-coverage

# Run tests in headless mode (CI/CD)
ng test --watch=false --browsers=ChromeHeadless
```

#### Unit Test Coverage

- **Components**: Testing component logic, templates, and user interactions
- **Services**: Testing business logic, API calls, and data transformations
- **Guards**: Testing route protection and authentication logic
- **Pipes**: Testing data transformation and formatting
- **Reducers/Effects**: Testing NgRx state management

### End-to-End (E2E) Tests

The application uses **Cypress** for comprehensive end-to-end testing, providing real user scenario validation.

#### Cypress Setup

The project includes a complete Cypress testing suite with:

- **Comprehensive Login Tests**: Full authentication flow testing
- **API Mocking**: Independent testing without backend dependencies
- **Custom Commands**: Reusable test utilities for common operations
- **Visual Regression**: UI component and interaction testing

#### Running E2E Tests

```bash
# Interactive mode - opens Cypress Test Runner
npx cypress open

# Headless mode - runs all tests in terminal
npx cypress run

# Run specific test file
npx cypress run --spec "cypress/e2e/login.cy.ts"

# Run tests with specific browser
npx cypress run --browser chrome
```

#### E2E Test Features

**📋 Login Form Testing:**

- ✅ Form validation (required fields, error messages)
- ✅ API integration (success/failure scenarios)
- ✅ Authentication flow (token storage, redirects)
- ✅ Error handling (network issues, server errors)
- ✅ UI/UX validation (accessibility, responsiveness)

**🛠️ Custom Commands Available:**

```typescript
cy.login(username, password); // Complete login flow
cy.mockSuccessfulLogin(); // Mock successful API response
cy.mockFailedLogin(message); // Mock failed API response
cy.fillLoginForm(username, password); // Fill form without submitting
cy.shouldBeLoggedIn(); // Verify login state
cy.shouldBeLoggedOut(); // Verify logout state
```

**🎯 Test Organization:**

- **Form Validation Tests**: Input validation and error handling
- **Form Interaction Tests**: User interface and accessibility
- **API Integration Tests**: Backend communication and responses
- **State Management Tests**: Form state and data persistence
- **UI/UX Tests**: Visual elements and user experience

#### Prerequisites for E2E Tests

1. **Start the development server:**

   ```bash
   ng serve
   ```

2. **Ensure application is running** on `http://localhost:4200`

3. **Run Cypress tests** in a separate terminal

#### Test Data & Mocking

E2E tests use **intercepted API calls** with mock data, ensuring:

- **Fast execution** - No dependency on external APIs
- **Reliable results** - Consistent test data
- **Isolated testing** - No side effects between tests
- **Comprehensive coverage** - All scenarios including edge cases

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

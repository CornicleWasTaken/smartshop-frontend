# Spec for Feature: Product Management System with Create Dialog

branch: claude/feature/product-management-create

## Description
A product management system that displays products in a modern data table with the ability to create new products via a dialog form. The system integrates with a backend service to fetch and persist product data.

## User Stories
- [ ] As an admin user, I want to view all products in a modern table format so that I can easily browse and manage inventory.
- [ ] As an admin user, I want to click a "Create New Product" button to open a dialog so that I can add new products to the system.
- [ ] As an admin user, I want to enter product details (name, SKU, price, stock quantity) in a form so that I can create complete product records.
- [ ] As an admin user, I want the created product to be sent to the backend service so that it is persisted in the database.

## Possible edge cases
- [ ] Backend service is unavailable (localhost:8087 not running)
- [ ] Duplicate SKU values submitted
- [ ] Negative price or stock quantity values
- [ ] Empty required fields submitted
- [ ] Very long product names or SKUs
- [ ] Special characters in product name or SKU
- [ ] Network timeout during API call
- [ ] User closes dialog without saving

## Acceptance Criteria
- [ ] Products are displayed in a table with a modern aesthetic
- [ ] "Create New Product" button is positioned in the top-right corner of the table component
- [ ] Clicking the button opens a dialog with form fields for: name (string), SKU (string), price (float/double), stockQuantity (int/bigint)
- [ ] Form validates that all fields are required before submission
- [ ] On submission, product data is sent via POST request to backend at localhost:8087
- [ ] Submitted values are logged to the browser console after submission
- [ ] Table refreshes to show the newly created product after successful creation
- [ ] Dialog closes automatically after successful creation
- [ ] Error handling displays user-friendly messages for API failures

## Technical Constraints
- Backend API base URL: http://localhost:8087
- Product data structure: { name: string, sku: string, price: number, stockQuantity: number }
- GET endpoint for fetching products: /api/products (assumed)
- POST endpoint for creating products: /api/products (assumed)
- Modern UI component library should be used for table and dialog

## Dependencies
- Backend service running on localhost:8087
- API endpoints for product CRUD operations
- UI component library (e.g., Material-UI, Ant Design, or similar)
- HTTP client for API communication

## Open questions
- What authentication/authorization is required for the API endpoints?
- Should the dialog support editing existing products as well?
- What is the expected response format from the backend after creation?
- Should there be a confirmation message after successful creation?
- Are there any specific validation rules for SKU format?

## Testing guidelines
Create test file(s) in the src\test\java folder in the respective packages for the class to be tested, create meaningful test classes without going too heavy. Focus on:
- Form validation logic
- API service integration
- Component rendering and user interactions
- Error state handling

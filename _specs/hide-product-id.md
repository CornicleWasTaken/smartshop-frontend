# Spec for Feature: Hide Product ID Column

branch: claude/feature/hide-product-id

## Description
Remove the ID column from the product table display to improve UI clarity. The product ID is an internal database field that end users don't need to see during normal product management operations.

## User Stories
- [ ] As an inventory manager, I want to see only relevant product information in the table so that I can focus on the data that matters for my daily tasks.

## Possible edge cases
- [ ] Ensure the ID field is still available in the data model for API operations (edit, delete)
- [ ] Verify that existing tests expecting the ID column are updated
- [ ] Confirm responsive layout works correctly without the ID column

## Acceptance Criteria
- [ ] The product table no longer displays the ID column
- [ ] All other columns (Name, SKU, Price, Stock, Category, Actions) remain visible and functional
- [ ] Table layout adjusts properly to use the freed-up space
- [ ] Product functionality (edit, delete) continues to work correctly

## Technical Constraints
- The Product type must retain the id field for internal operations
- No backend changes required
- CSS may need adjustment for column widths

## Dependencies
- ProductTable component
- ProductTable CSS

## Open questions
- Should the ID be completely hidden or accessible via a toggle/expand option?

## Testing guidelines
Create a test file in the src/tests/components folder for the ProductTable component update. Verify that:
- The ID column is not rendered in the table
- Other columns render correctly
- Table functionality remains intact

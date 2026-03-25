---
name: Product Edit and Delete Actions
description: Add inline edit and delete actions to product table rows with icon buttons
type: feature
---

# Spec for Feature: Product Edit and Delete Actions

branch: claude/feature/product-edit-delete-actions

## Description
Add update and delete functionality to the product management system. Each product row in the table should display edit (pencil) and delete (trash can) icons for inline actions. The create new product button should be simplified to a plus (+) icon button.

## User Stories
- [ ] As a user, I want to click an edit icon on a product row so that I can modify the product details.
- [ ] As a user, I want to click a delete icon on a product row so that I can remove the product from the system.
- [ ] As a user, I want to see action icons automatically appear on newly created products so that I can manage them immediately.
- [ ] As a user, I want a clean plus icon for creating products so that the interface is less cluttered.

## Possible edge cases
- [ ] User clicks delete on a product that has already been deleted by another user
- [ ] User attempts to edit a product that is being edited by another user
- [ ] User cancels an edit after making changes
- [ ] Delete confirmation dialog handling (confirm/cancel)
- [ ] Network failure during update or delete operations
- [ ] Edit form validation errors (similar to create form)
- [ ] Editing a product to have the same SKU as another product
- [ ] Attempting to delete the last product on the current page of a paginated table

## Acceptance Criteria
- [ ] Each product row displays a pencil/edit icon button at the end
- [ ] Each product row displays a trash can/delete icon button next to the edit icon
- [ ] Clicking the edit icon opens the product dialog in edit mode with pre-filled data
- [ ] Clicking the delete icon shows a confirmation dialog before deleting
- [ ] After successful edit, the product table updates to show the modified data
- [ ] After successful delete, the product is removed from the table
- [ ] Newly created products automatically show the edit and delete icons
- [ ] The "Create New Product" button is replaced with a floating + icon button
- [ ] Both icons are visible and accessible on all screen sizes
- [ ] Loading states are shown during edit/delete operations
- [ ] Error messages are displayed if edit/delete operations fail

## Technical Constraints
- Use existing MUI IconButton component for action icons
- Maintain consistent styling with the existing product table
- Reuse the existing ProductDialog component for editing (with mode prop)
- Follow existing error handling patterns from product creation
- Icons should have appropriate aria-labels for accessibility

## Dependencies
- Product table component (ProductTable)
- Product dialog component (ProductDialog)
- Product API service (productApi.ts)
- Existing product types and form validation

## Open questions
- Should the delete confirmation use a dialog or a inline confirmation pattern?
- Should edits be done inline in the table row or in the existing dialog?
- Is there a bulk delete feature planned that might affect this design?

## Testing guidelines
Create test files in the src\test\java folder in the respective packages for the class to be tested, create meaningful test classes without going too heavy. Focus on:
- Edit icon click opens dialog with pre-filled data
- Delete icon click shows confirmation
- Successful edit updates table data
- Successful delete removes row from table
- API error handling for both operations
- Accessibility of action icons

# Form Text Guidelines

## Overview

Forms are critical for user input and data collection. Clear, helpful text ensures users can complete forms successfully and understand what information is needed.

## General Principles

### Clarity

- Use clear, specific labels
- Provide helpful instructions
- Explain why information is needed
- Use consistent terminology

### Helpfulness

- Anticipate user questions
- Provide examples when helpful
- Give clear error messages
- Offer guidance for complex fields

### Accessibility

- Use proper labels and descriptions
- Provide clear error messages
- Ensure keyboard navigation works
- Use consistent patterns

## Field Labels

### Basic Guidelines

- **Be specific**: "Email address" not "Email"
- **Be clear**: "Full name" not "Name"
- **Be consistent**: Use the same label style throughout
- **Be helpful**: "Password (minimum 8 characters)" not "Password"

### Common Field Types

#### Personal Information

- **Full name**: "Full name" or "Full name (as it appears on your ID)"
- **First name**: "First name"
- **Last name**: "Last name"
- **Email**: "Email address" or "Email"
- **Phone**: "Phone number" or "Phone"
- **Date of birth**: "Date of birth" or "Birth date"

#### Authentication

- **Username**: "Username" or "Username (choose a unique name)"
- **Password**: "Password" or "Password (minimum 8 characters)"
- **Confirm password**: "Confirm password" or "Re-enter password"
- **Current password**: "Current password" or "Enter current password"

#### Address Information

- **Street address**: "Street address" or "Address line 1"
- **City**: "City"
- **State/Province**: "State" or "Province"
- **ZIP/Postal code**: "ZIP code" or "Postal code"
- **Country**: "Country"

#### Content Fields

- **Title**: "Title" or "Item title"
- **Description**: "Description" or "Item description"
- **Tags**: "Tags" or "Tags (separate with commas)"
- **Category**: "Category" or "Select category"

## Required and Optional Fields

### Required Fields

- **Indicator**: Use asterisk (\*) or "Required"
- **Placement**: After the label
- **Consistency**: Use the same indicator throughout
- **Accessibility**: Include in label for screen readers

**Examples:**

- "Email address \*"
- "Full name (Required)"
- "Password \* (minimum 8 characters)"

### Optional Fields

- **Indicator**: Use "(Optional)" or "(Leave blank if not applicable)"
- **Placement**: After the label
- **Consistency**: Use the same indicator throughout
- **Clarity**: Make it clear what happens if left blank

**Examples:**

- "Phone number (Optional)"
- "Company name (Optional)"
- "Additional notes (Optional)"

## Help Text and Instructions

### When to Use Help Text

- Complex or unfamiliar fields
- Fields with specific requirements
- Fields that need examples
- Fields that might be confusing

### Help Text Guidelines

- **Be concise**: 1-2 sentences maximum
- **Be specific**: Explain exactly what's needed
- **Be helpful**: Provide examples when appropriate
- **Be contextual**: Explain why the information is needed

### Common Help Text Examples

#### Email Fields

- "We'll use this to send you important updates"
- "Enter a valid email address"
- "This will be your username for signing in"

#### Password Fields

- "Must be at least 8 characters long"
- "Include at least one number and one special character"
- "Choose a strong password to protect your account"

#### File Upload Fields

- "Supported formats: JPG, PNG, GIF (max 5MB)"
- "Choose a clear, well-lit photo"
- "This will be your profile picture"

#### Date Fields

- "Use the format MM/DD/YYYY"
- "Select your birth date"
- "When did this event occur?"

## Error Messages

### Error Message Structure

1. **Problem**: What went wrong
2. **Cause**: Why it happened (if helpful)
3. **Solution**: What the user can do
4. **Action**: Specific steps to fix it

### Common Error Types

#### Validation Errors

- **Required field**: "This field is required"
- **Invalid format**: "Please enter a valid email address"
- **Too short**: "Password must be at least 8 characters"
- **Too long**: "Description must be less than 500 characters"
- **Invalid characters**: "Username can only contain letters and numbers"

#### Format Errors

- **Email format**: "Please enter a valid email address (example@domain.com)"
- **Phone format**: "Please enter a valid phone number (123-456-7890)"
- **Date format**: "Please enter date in MM/DD/YYYY format"
- **URL format**: "Please enter a valid URL (https://example.com)"

#### Business Logic Errors

- **Duplicate email**: "This email address is already registered"
- **Weak password**: "Password is too weak. Try adding numbers or symbols"
- **Invalid credentials**: "Email or password is incorrect"
- **Account locked**: "Account is temporarily locked. Try again in 15 minutes"

### Error Message Examples

#### Good Examples

- "Please enter a valid email address"
- "Password must be at least 8 characters long"
- "This email address is already registered. Try signing in instead"
- "Please select a file smaller than 5MB"

#### Avoid

- "Invalid input"
- "Error"
- "Something went wrong"
- "Please try again"

## Success Messages

### Success Message Guidelines

- **Be specific**: "Profile updated successfully"
- **Be positive**: "Great! Your changes have been saved"
- **Be helpful**: "You can now share your profile"
- **Be concise**: 1-2 sentences maximum

### Common Success Messages

- "Changes saved successfully"
- "Account created successfully"
- "File uploaded successfully"
- "Settings updated successfully"
- "Password changed successfully"

## Form Instructions

### Overall Form Instructions

- **Purpose**: Explain what the form is for
- **Requirements**: List any special requirements
- **Time**: Estimate how long it will take
- **Privacy**: Explain how data will be used

### Step-by-Step Instructions

- **Break down complex forms**: Use clear steps
- **Show progress**: "Step 2 of 4"
- **Provide context**: Explain what each step accomplishes
- **Offer help**: "Need help? Contact support"

### Example Form Instructions

- "Create your account in just 2 minutes"
- "All fields marked with \* are required"
- "We'll use this information to personalize your experience"
- "Your information is secure and will never be shared"

## Accessibility Considerations

### Labels and Descriptions

- **Use proper labels**: Associate labels with form controls
- **Provide descriptions**: Use aria-describedby for help text
- **Use fieldsets**: Group related fields together
- **Use legends**: Provide context for field groups

### Error Handling

- **Announce errors**: Use aria-live regions for error messages
- **Associate errors**: Link error messages to specific fields
- **Provide context**: Explain what went wrong and how to fix it
- **Use consistent patterns**: Same error handling throughout

### Keyboard Navigation

- **Logical tab order**: Follow reading flow
- **Clear focus indicators**: Show which field is active
- **Skip links**: Jump to main content
- **Keyboard shortcuts**: Provide alternative input methods

## Common Patterns

### Login Form

```
Email address *
Password *
[Remember me] [Forgot password?]
[Sign In]
```

### Registration Form

```
Full name *
Email address *
Password * (minimum 8 characters)
Confirm password *
[I agree to the terms and conditions]
[Create Account]
```

### Profile Form

```
Full name *
Email address
Phone number (Optional)
Bio (Optional)
[Save Changes] [Cancel]
```

### Search Form

```
Search term
Category (Optional)
Date range (Optional)
[Search] [Clear]
```

## Testing Guidelines

### User Testing

- Test with real users to ensure clarity
- Verify that instructions are helpful
- Check that error messages are actionable
- Ensure forms are easy to complete

### Accessibility Testing

- Test with screen readers
- Verify keyboard navigation
- Check color contrast and readability
- Validate ARIA labels and descriptions

### Consistency Testing

- Ensure same fields use same labels
- Verify terminology is consistent
- Check that patterns are followed
- Validate error message consistency

## Review Checklist

Before finalizing form text, verify:

- [ ] Are labels clear and specific?
- [ ] Is help text helpful and concise?
- [ ] Are error messages actionable?
- [ ] Is the form accessible to all users?
- [ ] Is terminology consistent throughout?
- [ ] Are required/optional fields clearly marked?
- [ ] Do instructions provide enough context?
- [ ] Are success messages positive and helpful?

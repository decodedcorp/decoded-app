# Error Handling Patterns

## Overview

Effective error handling helps users understand what went wrong and how to fix it. These patterns ensure consistent, helpful error messages across the application.

## Core Principles

### 1. Be Specific

- Tell users exactly what went wrong
- Avoid generic error messages
- Provide context about the problem

### 2. Be Helpful

- Explain how to fix the problem
- Provide actionable next steps
- Offer alternative solutions when possible

### 3. Be Positive

- Use encouraging language
- Focus on solutions, not problems
- Maintain a helpful tone

### 4. Be Consistent

- Use the same patterns for similar errors
- Follow established terminology
- Maintain consistent tone and style

## Error Message Structure

### Basic Structure

1. **Problem**: What went wrong
2. **Cause**: Why it happened (if helpful)
3. **Solution**: What the user can do
4. **Action**: Specific steps to fix it

### Example Structure

```
Problem: Unable to save changes
Cause: Your session has expired
Solution: Please sign in again to continue
Action: [Sign In] button
```

## Common Error Types

### Validation Errors

These occur when user input doesn't meet requirements.

**Pattern:**

- **Problem**: "Please enter a valid [field name]"
- **Cause**: Specific requirement not met
- **Solution**: What format is expected
- **Action**: Clear instructions to fix

**Examples:**

- "Please enter a valid email address"
- "Password must be at least 8 characters long"
- "Please select a date in the future"
- "Username can only contain letters and numbers"

### Network Errors

These occur when there are connection or server issues.

**Pattern:**

- **Problem**: "Unable to [action]"
- **Cause**: Connection or server issue
- **Solution**: What the user can try
- **Action**: Retry or alternative action

**Examples:**

- "Unable to load content. Please check your internet connection"
- "Server is temporarily unavailable. Please try again in a few minutes"
- "Unable to save changes. Please check your connection and try again"
- "Request timed out. Please try again"

### Permission Errors

These occur when users don't have access to perform an action.

**Pattern:**

- **Problem**: "You don't have permission to [action]"
- **Cause**: Insufficient access rights
- **Solution**: What the user can do instead
- **Action**: Contact admin or request access

**Examples:**

- "You don't have permission to edit this item"
- "This feature requires a premium account"
- "You need to verify your email address first"
- "Contact your administrator to request access"

### System Errors

These occur when there are unexpected technical issues.

**Pattern:**

- **Problem**: "Something went wrong"
- **Cause**: Technical issue (keep it simple)
- **Solution**: What the user can try
- **Action**: Retry or contact support

**Examples:**

- "Something went wrong. Please try again"
- "An unexpected error occurred. Please refresh the page"
- "We're experiencing technical difficulties. Please try again later"
- "Something went wrong. Please contact support if the problem persists"

## Error Message Templates

### Form Validation

```
[Field name] is required
Please enter a valid [field name]
[Field name] must be at least [number] characters
[Field name] must be less than [number] characters
[Field name] can only contain [allowed characters]
```

### File Upload

```
File is too large. Maximum size is [size]
File type not supported. Please use [supported types]
Unable to upload file. Please try again
File upload failed. Please check your connection
```

### Authentication

```
Email or password is incorrect
Account not found. Please check your email address
Account is temporarily locked. Try again in [time]
Please verify your email address before signing in
```

### Network Issues

```
Unable to connect. Please check your internet connection
Request timed out. Please try again
Server is temporarily unavailable. Please try again later
Connection lost. Please refresh the page
```

## Error Message Examples

### Good Examples

#### Validation Error

```
Problem: "Please enter a valid email address"
Context: "Email must contain @ symbol and a valid domain"
Action: "Try: example@domain.com"
```

#### Network Error

```
Problem: "Unable to save changes"
Context: "Your internet connection appears to be unstable"
Action: "Check your connection and try again"
```

#### Permission Error

```
Problem: "You can't edit this item"
Context: "Only the creator can make changes"
Action: "Contact the creator to request edit access"
```

#### System Error

```
Problem: "Something went wrong"
Context: "We're working to fix this issue"
Action: "Please try again in a few minutes"
```

### Avoid These Patterns

#### Too Generic

- ❌ "Error"
- ❌ "Invalid input"
- ❌ "Something went wrong"
- ❌ "Please try again"

#### Too Technical

- ❌ "HTTP 500 Internal Server Error"
- ❌ "Database connection failed"
- ❌ "Authentication token expired"
- ❌ "Validation constraint violation"

#### Blaming the User

- ❌ "You entered the wrong password"
- ❌ "Your file is corrupted"
- ❌ "You don't have permission"
- ❌ "Your request was invalid"

## Error Prevention

### Proactive Validation

- Validate input in real-time
- Show requirements before submission
- Provide examples of correct format
- Use clear field labels and help text

### Clear Instructions

- Explain what information is needed
- Show format requirements
- Provide examples when helpful
- Use consistent terminology

### Helpful Defaults

- Pre-fill fields when possible
- Use sensible default values
- Remember user preferences
- Suggest common options

## Error Recovery

### Retry Mechanisms

- Provide retry buttons for failed actions
- Show progress indicators for long operations
- Allow users to cancel if needed
- Save work automatically when possible

### Alternative Actions

- Offer different ways to complete tasks
- Provide workarounds for common issues
- Suggest contacting support when appropriate
- Offer to save work for later

### Clear Next Steps

- Tell users exactly what to do next
- Provide links to relevant help
- Offer to contact support
- Explain when to try again

## Accessibility Considerations

### Screen Reader Support

- Use aria-live regions for error announcements
- Associate error messages with specific fields
- Provide clear error summaries
- Use consistent error patterns

### Visual Accessibility

- Ensure error text has sufficient contrast
- Use icons to reinforce error messages
- Provide clear visual hierarchy
- Use consistent error styling

### Cognitive Accessibility

- Use simple, clear language
- Avoid technical jargon
- Provide step-by-step instructions
- Use consistent terminology

## Testing Guidelines

### User Testing

- Test error messages with real users
- Verify that errors are clear and actionable
- Check that recovery actions work
- Ensure error prevention is effective

### Accessibility Testing

- Test with screen readers
- Verify keyboard navigation
- Check color contrast and readability
- Validate ARIA labels and descriptions

### Consistency Testing

- Ensure similar errors use same patterns
- Verify terminology is consistent
- Check that tone is appropriate
- Validate error styling consistency

## Common Patterns by Context

### Login Errors

```
Email or password is incorrect
Account not found. Please check your email address
Account is temporarily locked. Try again in 15 minutes
Please verify your email address before signing in
```

### Form Errors

```
This field is required
Please enter a valid email address
Password must be at least 8 characters long
Please select a valid option
```

### File Upload Errors

```
File is too large. Maximum size is 5MB
File type not supported. Please use JPG, PNG, or GIF
Unable to upload file. Please try again
File upload failed. Please check your connection
```

### Network Errors

```
Unable to load content. Please check your internet connection
Server is temporarily unavailable. Please try again later
Request timed out. Please try again
Connection lost. Please refresh the page
```

## Review Checklist

Before finalizing error messages, verify:

- [ ] Is the error message specific and clear?
- [ ] Does it explain what went wrong?
- [ ] Does it provide actionable next steps?
- [ ] Is the tone helpful and positive?
- [ ] Is it accessible to all users?
- [ ] Does it follow established patterns?
- [ ] Is the terminology consistent?
- [ ] Does it match user expectations?

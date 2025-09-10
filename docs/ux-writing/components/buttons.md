# Button Text Guidelines

## Overview

Buttons are the primary way users interact with our app. Clear, actionable button text helps users understand what will happen when they click.

## General Principles

### Length

- **Primary buttons**: 1-3 words
- **Secondary buttons**: 1-4 words
- **Icon buttons**: 1-2 words (if text is present)

### Tone

- **Action-oriented**: Use verbs when possible
- **Clear**: Avoid ambiguous terms
- **Confident**: Use decisive language
- **Consistent**: Use the same words for the same actions

## Button Types

### Primary Actions

These are the main actions users want to take.

**Good Examples:**

- "Save"
- "Continue"
- "Get Started"
- "Sign In"
- "Create Account"
- "Upload Image"
- "Send Message"

**Avoid:**

- "Submit" (use "Save" instead)
- "OK" (use "Continue" instead)
- "Yes" (use "Confirm" instead)
- "Proceed" (use "Continue" instead)

### Secondary Actions

These are alternative or less important actions.

**Good Examples:**

- "Cancel"
- "Back"
- "Skip"
- "Learn More"
- "View Details"
- "Edit"
- "Delete"

**Avoid:**

- "No" (use "Cancel" instead)
- "Previous" (use "Back" instead)
- "Abort" (use "Cancel" instead)
- "Discard" (use "Cancel" instead)

### Destructive Actions

These are actions that permanently delete or remove something.

**Good Examples:**

- "Delete"
- "Remove"
- "Discard"
- "Clear All"
- "Reset"

**Avoid:**

- "Destroy" (use "Delete" instead)
- "Eliminate" (use "Remove" instead)
- "Wipe" (use "Clear" instead)

## Context-Specific Guidelines

### Forms

- **Save**: "Save Changes" or "Save"
- **Cancel**: "Cancel" or "Discard Changes"
- **Submit**: "Submit" or "Send"
- **Reset**: "Reset Form" or "Clear Form"

### Navigation

- **Next**: "Next" or "Continue"
- **Previous**: "Back" or "Previous"
- **Skip**: "Skip" or "Skip This Step"
- **Finish**: "Finish" or "Complete"

### Content Actions

- **Edit**: "Edit" or "Edit Item"
- **Delete**: "Delete" or "Remove Item"
- **Share**: "Share" or "Share Item"
- **Download**: "Download" or "Download File"

### Authentication

- **Sign In**: "Sign In" or "Log In"
- **Sign Up**: "Sign Up" or "Create Account"
- **Sign Out**: "Sign Out" or "Log Out"
- **Forgot Password**: "Forgot Password?" or "Reset Password"

## Special Cases

### Loading States

- **Loading**: "Saving..." or "Uploading..."
- **Processing**: "Processing..." or "Working..."
- **Sending**: "Sending..." or "Sending Message..."

### Disabled States

- **Disabled**: "Please fill in all required fields"
- **Loading**: "Please wait..."
- **Error**: "Please fix errors above"

### Confirmation Dialogs

- **Confirm**: "Confirm" or "Yes, Delete"
- **Cancel**: "Cancel" or "No, Keep It"

## Accessibility Considerations

### Screen Readers

- Use descriptive text that explains the action
- Avoid generic terms like "Click here"
- Use consistent terminology

### Keyboard Navigation

- Ensure button text is clear when focused
- Use meaningful labels for icon buttons
- Provide context for ambiguous actions

## Common Patterns

### Save/Cancel Pattern

```
[Cancel] [Save Changes]
```

### Next/Back Pattern

```
[Back] [Next]
```

### Delete/Keep Pattern

```
[Cancel] [Delete Item]
```

### Edit/Save Pattern

```
[Cancel] [Save Changes]
```

## Examples by Context

### Profile Settings

- "Save Changes"
- "Cancel"
- "Reset to Defaults"

### Image Upload

- "Upload Image"
- "Choose File"
- "Remove Image"

### Channel Management

- "Create Channel"
- "Edit Channel"
- "Delete Channel"

### Search

- "Search"
- "Clear Search"
- "Advanced Search"

## Testing Guidelines

### User Testing

- Test with real users to ensure clarity
- Verify that button text matches user expectations
- Check that actions are clear and unambiguous

### Accessibility Testing

- Test with screen readers
- Verify keyboard navigation
- Check color contrast and readability

### Consistency Testing

- Ensure same actions use same text
- Verify terminology is consistent
- Check that patterns are followed

## Review Checklist

Before finalizing button text, verify:

- [ ] Is the action clear and specific?
- [ ] Is the text concise but descriptive?
- [ ] Does it match our established patterns?
- [ ] Is it accessible to all users?
- [ ] Does it use consistent terminology?
- [ ] Is the tone appropriate for the context?
- [ ] Does it match user expectations?

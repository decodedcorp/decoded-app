# Accessibility Writing Guidelines

## Overview

Accessible writing ensures that all users, including those with disabilities, can understand and interact with our content effectively. These guidelines focus on making text clear, inclusive, and usable for everyone.

## Core Principles

### 1. Clarity and Simplicity

- Use simple, everyday language
- Avoid jargon and technical terms
- Write in short, clear sentences
- Use active voice when possible

### 2. Consistency

- Use the same words for the same concepts
- Follow established patterns
- Maintain consistent terminology
- Use consistent formatting

### 3. Inclusivity

- Use gender-neutral language
- Avoid assumptions about user abilities
- Provide multiple ways to understand information
- Consider diverse cultural backgrounds

## Writing for Screen Readers

### Alt Text Guidelines

- **Be descriptive**: "Woman smiling while using laptop" not "Image"
- **Be concise**: Keep under 125 characters when possible
- **Be specific**: "Red error icon" not "Icon"
- **Avoid redundancy**: Don't start with "Image of" or "Picture of"

### ARIA Labels

- **Be clear**: "Close dialog" not "Close"
- **Be specific**: "Save changes to profile" not "Save"
- **Be descriptive**: "Navigate to home page" not "Home"
- **Be consistent**: Use the same labels for similar actions

### Heading Structure

- **Use proper hierarchy**: H1 → H2 → H3 → H4
- **Be descriptive**: "User Account Settings" not "Settings"
- **Be consistent**: Use the same heading style throughout
- **Be logical**: Follow a clear information hierarchy

## Cognitive Accessibility

### Language Complexity

- **Use simple words**: "Use" instead of "Utilize"
- **Use short sentences**: Maximum 20 words per sentence
- **Use common words**: "Help" instead of "Assistance"
- **Use familiar terms**: "Save" instead of "Persist"

### Information Organization

- **Group related information**: Use headings and sections
- **Provide clear structure**: Use lists and bullet points
- **Use visual hierarchy**: Different text sizes and weights
- **Provide context**: Explain why information is needed

### Instructions and Guidance

- **Be step-by-step**: Break complex tasks into steps
- **Be specific**: "Click the Save button" not "Save it"
- **Be clear**: "Enter your email address" not "Input email"
- **Be helpful**: Provide examples when appropriate

## Visual Accessibility

### Text Formatting

- **Use sufficient contrast**: Ensure text is readable
- **Use appropriate font sizes**: Minimum 16px for body text
- **Use clear fonts**: Avoid decorative or script fonts
- **Use proper spacing**: Adequate line height and letter spacing

### Color and Visual Cues

- **Don't rely on color alone**: Use text and icons too
- **Provide text alternatives**: "Required field" not just red color
- **Use meaningful icons**: Clear, recognizable symbols
- **Use consistent patterns**: Same visual cues for same actions

### Focus and Navigation

- **Provide clear focus indicators**: Visible keyboard navigation
- **Use logical tab order**: Follow reading flow
- **Provide skip links**: Jump to main content
- **Use meaningful link text**: "Learn more about pricing" not "Click here"

## Inclusive Language

### Gender-Neutral Terms

- **Use "they/them"**: Instead of "he/she" or "his/her"
- **Use "person"**: Instead of "man" or "woman" when appropriate
- **Use "staff"**: Instead of "guys" or "ladies"
- **Use "everyone"**: Instead of "all users" when possible

### Ability-Inclusive Terms

- **Use "person with disability"**: Not "disabled person"
- **Use "accessible"**: Not "handicapped" or "special needs"
- **Use "assistive technology"**: Not "special equipment"
- **Use "inclusive"**: Not "accommodating"

### Age-Inclusive Terms

- **Use "people"**: Instead of "users" when possible
- **Use "everyone"**: Instead of "all ages"
- **Use "adults"**: Instead of "grown-ups"
- **Use "young people"**: Instead of "kids" or "children"

## Error Messages and Feedback

### Clear Error Messages

- **Be specific**: "Please enter a valid email address" not "Invalid input"
- **Be helpful**: "Email must contain @ symbol" not "Format error"
- **Be actionable**: "Click here to try again" not "Error occurred"
- **Be positive**: "Please check your connection" not "Connection failed"

### Success Messages

- **Be clear**: "Changes saved successfully" not "Success"
- **Be specific**: "Your profile has been updated" not "Updated"
- **Be helpful**: "You can now share your profile" not "Done"
- **Be encouraging**: "Great! You're all set" not "Complete"

### Loading States

- **Be descriptive**: "Loading your data..." not "Loading..."
- **Be specific**: "Uploading 3 of 5 files..." not "Uploading..."
- **Be helpful**: "This may take a few minutes" not "Please wait"
- **Be informative**: "Preparing your content..." not "Processing..."

## Form Accessibility

### Field Labels

- **Be clear**: "Email address" not "Email"
- **Be specific**: "Password (minimum 8 characters)" not "Password"
- **Be helpful**: "Optional: Phone number" not "Phone"
- **Be consistent**: Use the same label style throughout

### Help Text

- **Be contextual**: Explain why information is needed
- **Be specific**: "We'll use this to send you updates" not "For notifications"
- **Be helpful**: "Enter your full name as it appears on your ID" not "Enter name"
- **Be concise**: One or two sentences maximum

### Validation Messages

- **Be immediate**: Show errors as soon as possible
- **Be specific**: "Password must be at least 8 characters" not "Invalid password"
- **Be helpful**: "Try adding numbers or symbols" not "Make it stronger"
- **Be positive**: "Almost there! Just add a number" not "Still not strong enough"

## Navigation and Menus

### Menu Items

- **Be descriptive**: "Account Settings" not "Settings"
- **Be specific**: "Sign Out" not "Logout"
- **Be clear**: "Help Center" not "Help"
- **Be consistent**: Use the same terminology throughout

### Breadcrumbs

- **Be clear**: "Home > Settings > Account" not "Home > Settings > Account"
- **Be descriptive**: "Home > User Profile > Edit" not "Home > Profile > Edit"
- **Be helpful**: Show the full path to current page
- **Be consistent**: Use the same separator and style

### Links and Buttons

- **Be descriptive**: "Learn more about our privacy policy" not "Learn more"
- **Be specific**: "Download your data" not "Download"
- **Be clear**: "Contact support" not "Contact"
- **Be consistent**: Use the same link style throughout

## Testing and Validation

### Screen Reader Testing

- **Test with actual screen readers**: NVDA, JAWS, VoiceOver
- **Verify alt text**: Ensure images have meaningful descriptions
- **Check heading structure**: Ensure proper hierarchy
- **Validate ARIA labels**: Ensure they're helpful and accurate

### Cognitive Testing

- **Test with real users**: Get feedback from diverse users
- **Check comprehension**: Ensure instructions are clear
- **Verify navigation**: Ensure it's intuitive and logical
- **Test error handling**: Ensure errors are helpful and actionable

### Visual Testing

- **Check contrast ratios**: Ensure text is readable
- **Test font sizes**: Ensure text is large enough
- **Verify spacing**: Ensure adequate white space
- **Check color usage**: Ensure information isn't color-dependent

## Common Mistakes to Avoid

### Language Issues

- ❌ "Click here to learn more"
- ✅ "Learn more about our privacy policy"

### Assumptions

- ❌ "As you can see in the image above"
- ✅ "The chart shows your monthly progress"

### Technical Jargon

- ❌ "Invalid authentication credentials"
- ✅ "Please check your email and password"

### Inconsistent Terminology

- ❌ "Login" in one place, "Sign in" in another
- ✅ "Sign in" consistently throughout

## Review Checklist

Before publishing any content, verify:

- [ ] Is the language simple and clear?
- [ ] Are instructions step-by-step and specific?
- [ ] Is the terminology consistent throughout?
- [ ] Are error messages helpful and actionable?
- [ ] Is the content inclusive and respectful?
- [ ] Are alt texts descriptive and meaningful?
- [ ] Is the heading structure logical and clear?
- [ ] Are links and buttons descriptive?
- [ ] Is the content accessible to screen readers?
- [ ] Is the content accessible to users with cognitive disabilities?

// Debug script to set a test access token for API testing
// Run this in browser console to simulate being logged in

// This is a sample JWT token for testing purposes
// In production, you would get this from the login API
const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LXVzZXIiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpYXQiOjE3MDg0NzYwMDAsImV4cCI6MTcwODU2MjQwMH0.test-signature';

// Set the token in localStorage
localStorage.setItem('ACCESS_TOKEN', testToken);

console.log('Test token set in localStorage');
console.log('Token:', testToken);

// Reload the page to apply the changes
location.reload();
#!/usr/bin/env node

/**
 * Test script for invite codes
 * Validates all generated invite codes work correctly
 */

const {
  validateInviteCode,
  getAllValidCodes,
  getValidCodesCount,
} = require('../src/lib/invite/validation');

console.log('🧪 Testing Invite Code System\n');

// Get all valid codes
const validCodes = getAllValidCodes();
const totalCount = getValidCodesCount();

console.log(`📊 Total valid codes: ${totalCount}\n`);

// Test each code
let passedTests = 0;
let failedTests = 0;

console.log('🔍 Testing individual codes:');
console.log('─'.repeat(50));

validCodes.forEach((code, index) => {
  const isValid = validateInviteCode(code);
  const status = isValid ? '✅' : '❌';
  const paddedIndex = (index + 1).toString().padStart(2, '0');

  console.log(`${status} ${paddedIndex}. ${code}`);

  if (isValid) {
    passedTests++;
  } else {
    failedTests++;
  }
});

console.log('─'.repeat(50));

// Test case sensitivity
console.log('\n🔤 Testing case sensitivity:');
const testCode = validCodes[0];
const variations = [
  testCode.toLowerCase(),
  testCode.toUpperCase(),
  testCode.charAt(0).toLowerCase() + testCode.slice(1).toUpperCase(),
];

variations.forEach((variation) => {
  const isValid = validateInviteCode(variation);
  const status = isValid ? '✅' : '❌';
  console.log(`${status} "${variation}" -> ${isValid ? 'Valid' : 'Invalid'}`);
});

// Test invalid codes
console.log('\n❌ Testing invalid codes:');
const invalidCodes = ['INVALID', 'WRONG_CODE', 'TEST123', '', '   '];
invalidCodes.forEach((code) => {
  const isValid = validateInviteCode(code);
  const status = isValid ? '❌' : '✅';
  console.log(`${status} "${code}" -> ${isValid ? 'Valid (ERROR!)' : 'Invalid (Expected)'}`);
});

// Summary
console.log('\n📈 Test Summary:');
console.log(`✅ Passed: ${passedTests}`);
console.log(`❌ Failed: ${failedTests}`);
console.log(`📊 Total: ${passedTests + failedTests}`);

if (failedTests === 0) {
  console.log('\n🎉 All tests passed! Invite code system is working correctly.');
} else {
  console.log('\n⚠️  Some tests failed. Please check the implementation.');
  process.exit(1);
}

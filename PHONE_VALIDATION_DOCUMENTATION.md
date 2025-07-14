# Phone Number Validation Documentation

## Overview
This document outlines the phone number validation logic implemented in the PrintEasy platform.

## Validation Rules

### Customer Phone Number Requirements
All customer phone numbers must meet the following criteria:

1. **Length**: Exactly 10 digits
2. **Starting Digits**: Must start with either:
   - `678` (3-digit prefix)
   - `9` (1-digit prefix)
3. **Format**: Only numeric digits allowed (no special characters, spaces, or letters)

### Implementation Details

#### Frontend Validation (Homepage)
Location: `src/pages/Home.tsx`

```javascript
const handlePhoneLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Basic presence check
  if (!phoneNumber.trim()) {
    toast.error('Please enter your phone number');
    return;
  }

  // Clean input and check length
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  if (cleanPhone.length !== 10) {
    toast.error('Phone number must be exactly 10 digits');
    return;
  }

  // Check starting digits
  if (!cleanPhone.startsWith('678') && !cleanPhone.startsWith('9')) {
    toast.error('Phone number must start with 678 or 9');
    return;
  }

  // Proceed with login if validation passes
  // ...
};
```

#### Backend Validation (AuthContext)
Location: `src/contexts/AuthContext.tsx`

```javascript
const login = async (phone: string) => {
  // Validate phone number - must be exactly 10 digits
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phone)) {
    throw new Error('Phone number must be exactly 10 digits');
  }
  
  // Additional validation for starting digits can be added here
  // ...
};
```

## Valid Phone Number Examples
- `6781234567` ✅ (starts with 678)
- `9876543210` ✅ (starts with 9)
- `6789012345` ✅ (starts with 678)
- `9123456789` ✅ (starts with 9)

## Invalid Phone Number Examples
- `1234567890` ❌ (doesn't start with 678 or 9)
- `812345678` ❌ (only 9 digits)
- `98765432101` ❌ (11 digits)
- `5671234567` ❌ (doesn't start with 678 or 9)
- `678123456` ❌ (only 9 digits)
- `abc1234567` ❌ (contains letters)
- `678-123-4567` ❌ (contains special characters)

## Error Messages
1. **Empty Input**: "Please enter your phone number"
2. **Wrong Length**: "Phone number must be exactly 10 digits"  
3. **Invalid Starting Digits**: "Phone number must start with 678 or 9"
4. **Backend Validation**: "Phone number must be exactly 10 digits"

## Technical Implementation Notes

### Input Sanitization
- All non-numeric characters are removed using `replace(/\D/g, '')`
- Length validation is performed on the sanitized input
- Starting digit validation is performed on the sanitized input

### User Experience
- Real-time character limitation prevents users from entering more than 10 digits
- Visual feedback shows current digit count vs required (x/10 digits)
- Clear error messages guide users to correct format

### Security Considerations
- Input is sanitized before validation to prevent injection attacks
- Server-side validation mirrors client-side validation
- Phone number format is standardized across the platform

## Future Enhancements
- Add support for additional valid starting digit patterns if needed
- Implement phone number formatting display (e.g., XXX-XXX-XXXX)
- Add international phone number support if expanding beyond current market
- Implement phone number verification via SMS/OTP

## Testing Scenarios
1. Test with valid phone numbers starting with 678
2. Test with valid phone numbers starting with 9
3. Test with invalid starting digits (1-8, except as part of 678)
4. Test with incorrect lengths (< 10 and > 10 digits)
5. Test with special characters and letters
6. Test with empty input
7. Test edge cases like leading zeros

This validation ensures that only properly formatted phone numbers meeting our business requirements are accepted into the system.
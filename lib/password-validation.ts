export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: "weak" | "medium" | "strong";
}

export const validatePassword = (password: string): PasswordValidationResult => {
  const errors: string[] = [];
  
  // Check minimum length
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  
  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  
  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  
  // Check for number
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  
  // Check for special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character (!@#$%^&*...)");
  }
  
  // Determine strength
  let strength: "weak" | "medium" | "strong" = "weak";
  if (errors.length === 0) {
    if (password.length >= 12) {
      strength = "strong";
    } else {
      strength = "medium";
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    strength,
  };
};

# JavaScript/TypeScript Defect Patterns

This document describes common defect patterns in JavaScript and TypeScript code, along with their fixes.

## 1. Common Defects

### 1.1 Undefined Variable Usage
- **Description**: Accessing variables that are not defined or initialized
- **Fix**: Ensure variables are properly declared and initialized before use
- **Example**: 
  ```javascript
  // Bad
  console.log(undeclaredVar); // ReferenceError: undeclaredVar is not defined
  
  // Good
  const declaredVar = 'value';
  console.log(declaredVar); // value
  ```

### 1.2 Null/Undefined Property Access
- **Description**: Trying to access properties of null or undefined values
- **Fix**: Use optional chaining (?.) or null checks
- **Example**: 
  ```javascript
  // Bad
  const user = null;
  console.log(user.name); // TypeError: Cannot read property 'name' of null
  
  // Good
  const user = null;
  console.log(user?.name); // undefined
  ```

### 1.3 Asynchronous Code Errors
- **Description**: Improper handling of promises and async/await
- **Fix**: Use try/catch with async/await, handle promise rejections
- **Example**: 
  ```javascript
  // Bad
  async function fetchData() {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } // No error handling
  
  // Good
  async function fetchData() {
    try {
      const response = await fetch('/api/data');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
  ```

### 1.4 Incorrect Comparison Operators
- **Description**: Using == instead of ===, leading to type coercion issues
- **Fix**: Use strict equality (===) unless type coercion is explicitly needed
- **Example**: 
  ```javascript
  // Bad
  console.log(0 == ''); // true (unexpected)
  console.log(1 == true); // true (unexpected)
  
  // Good
  console.log(0 === ''); // false (expected)
  console.log(1 === true); // false (expected)
  ```

### 1.5 Memory Leaks
- **Description**: Accumulating unused memory that is not released
- **Fix**: Clean up event listeners, timers, and references when no longer needed
- **Example**: 
  ```javascript
  // Bad
  function setup() {
    const element = document.getElementById('myElement');
    element.addEventListener('click', handleClick);
  } // No cleanup
  
  // Good
  function setup() {
    const element = document.getElementById('myElement');
    element.addEventListener('click', handleClick);
    
    return () => {
      element.removeEventListener('click', handleClick);
    };
  }
  ```

## 2. TypeScript Specific Defects

### 2.1 Incorrect Type Annotations
- **Description**: Using wrong types for variables, parameters, or return values
- **Fix**: Use correct type annotations, leverage TypeScript's type inference
- **Example**: 
  ```typescript
  // Bad
  function add(a: string, b: string): number {
    return a + b; // Returns string, not number
  }
  
  // Good
  function add(a: number, b: number): number {
    return a + b; // Returns number
  }
  ```

### 2.2 Ignoring Type Errors
- **Description**: Using @ts-ignore or any type to bypass TypeScript errors
- **Fix**: Fix the underlying issue instead of ignoring it
- **Example**: 
  ```typescript
  // Bad
  // @ts-ignore
  const result: number = someFunction(); // Ignores type error
  
  // Good
  const result: string = someFunction(); // Fix type to match actual return value
  ```

### 2.3 Unused Variables/Imports
- **Description**: Declaring variables or importing modules that are not used
- **Fix**: Remove unused variables and imports
- **Example**: 
  ```typescript
  // Bad
  import { unusedFunction } from './utils';
  const unusedVar = 'value';
  
  // Good
  // No unused imports or variables
  ```

## 3. Best Practices

### 3.1 Use TypeScript Strict Mode
- Enable strict mode in tsconfig.json for better type checking
- Configuration: `"strict": true`

### 3.2 Use ESLint and Prettier
- Install and configure ESLint for code quality
- Use Prettier for consistent formatting
- Example configuration:
  ```json
  {
    "extends": [
      "eslint:recommended",
      "@typescript-eslint/recommended",
      "prettier"
    ]
  }
  ```

### 3.3 Write Unit Tests
- Use Jest or Mocha for unit testing
- Test edge cases and error scenarios
- Example test:
  ```typescript
  test('add function should return correct sum', () => {
    expect(add(1, 2)).toBe(3);
    expect(add(-1, 1)).toBe(0);
    expect(add(0, 0)).toBe(0);
  });
  ```

### 3.4 Use Type Guards
- Implement type guards for runtime type checking
- Example:
  ```typescript
  function isString(value: unknown): value is string {
    return typeof value === 'string';
  }
  
  function processValue(value: unknown) {
    if (isString(value)) {
      // value is now typed as string
      console.log(value.toUpperCase());
    }
  }
  ```

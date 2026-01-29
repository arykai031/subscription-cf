# Python Defect Patterns

This document describes common defect patterns in Python code, along with their fixes.

## 1. Common Defects

### 1.1 Indentation Errors
- **Description**: Incorrect indentation level, mixing spaces and tabs
- **Fix**: Use consistent indentation (4 spaces recommended), avoid mixing spaces and tabs
- **Example**: 
  ```python
  # Bad
  def function():
  print("Hello")  # Wrong indentation level
      print("World")  # Inconsistent indentation
  
  # Good
  def function():
      print("Hello")
      print("World")
  ```

### 1.2 Name Errors
- **Description**: Using variables or functions that are not defined
- **Fix**: Ensure names are properly defined before use, check for typos
- **Example**: 
  ```python
  # Bad
  print(undefined_variable)  # NameError: name 'undefined_variable' is not defined
  
  # Good
  defined_variable = "value"
  print(defined_variable)  # value
  ```

### 1.3 Attribute Errors
- **Description**: Trying to access attributes that don't exist on an object
- **Fix**: Check object type, ensure attribute exists before access
- **Example**: 
  ```python
  # Bad
  my_list = [1, 2, 3]
  my_list.append(4)
  my_list.push(5)  # AttributeError: 'list' object has no attribute 'push'
  
  # Good
  my_list = [1, 2, 3]
  my_list.append(4)
  my_list.append(5)  # Correct method for lists
  ```

### 1.4 Type Errors
- **Description**: Operations on incompatible types
- **Fix**: Ensure proper type conversion, check types before operations
- **Example**: 
  ```python
  # Bad
  result = "10" + 5  # TypeError: can only concatenate str (not "int") to str
  
  # Good
  result = "10" + str(5)  # "105"
  result = int("10") + 5  # 15
  ```

### 1.5 Index Errors
- **Description**: Accessing list/dict elements with invalid indices/keys
- **Fix**: Check indices/keys exist before access, use proper bounds checking
- **Example**: 
  ```python
  # Bad
  my_list = [1, 2, 3]
  print(my_list[5])  # IndexError: list index out of range
  
  # Good
  my_list = [1, 2, 3]
  if len(my_list) > 5:
      print(my_list[5])
  else:
      print("Index out of range")
  ```

### 1.6 Unhandled Exceptions
- **Description**: Exceptions that are not caught and handled
- **Fix**: Use try/except blocks to handle expected exceptions
- **Example**: 
  ```python
  # Bad
  with open("non_existent_file.txt", "r") as f:
      content = f.read()  # FileNotFoundError: [Errno 2] No such file or directory
  
  # Good
  try:
      with open("non_existent_file.txt", "r") as f:
          content = f.read()
  except FileNotFoundError:
      print("File not found, creating new file")
      with open("non_existent_file.txt", "w") as f:
          f.write("")
  ```

## 2. Python-Specific Issues

### 2.1 Mutable Default Arguments
- **Description**: Using mutable objects as default arguments leads to unexpected behavior
- **Fix**: Use None as default and create mutable objects inside the function
- **Example**: 
  ```python
  # Bad
  def append_to_list(item, my_list=[]):
      my_list.append(item)
      return my_list
  
  append_to_list(1)  # [1]
  append_to_list(2)  # [1, 2]  # Unexpected: uses same list
  
  # Good
  def append_to_list(item, my_list=None):
      if my_list is None:
          my_list = []
      my_list.append(item)
      return my_list
  
  append_to_list(1)  # [1]
  append_to_list(2)  # [2]  # Expected: new list each time
  ```

### 2.2 Unused Variables
- **Description**: Variables that are declared but not used
- **Fix**: Remove unused variables, use _ for intentionally unused variables
- **Example**: 
  ```python
  # Bad
  def calculate(a, b):
      c = a + b  # Unused variable
      return a * b
  
  # Good
  def calculate(a, b):
      return a * b
  
  # Using _ for intentionally unused variable
  for _ in range(5):
      print("Hello")
  ```

### 2.3 Import Issues
- **Description**: Incorrect import statements, circular imports
- **Fix**: Use proper import syntax, avoid circular dependencies
- **Example**: 
  ```python
  # Bad
  from module import *  # Wildcard import
  import non_existent_module  # Module not found
  
  # Good
  from module import specific_function  # Specific import
  import existing_module  # Correct module
  ```

### 2.4 Memory Leaks
- **Description**: Objects not being garbage collected due to circular references
- **Fix**: Use weak references, avoid circular references, explicitly delete references
- **Example**: 
  ```python
  # Bad - Circular reference
  class Node:
      def __init__(self, value):
          self.value = value
          self.parent = None
  
  parent = Node(1)
  child = Node(2)
  parent.child = child
  child.parent = parent  # Circular reference
  
  # Good - Using weakref for circular reference
  import weakref
  
  class Node:
      def __init__(self, value):
          self.value = value
          self.parent = None
  
  parent = Node(1)
  child = Node(2)
  parent.child = child
  child.parent = weakref.ref(parent)  # Weak reference to break circularity
  ```

## 3. Best Practices

### 3.1 Use Type Hints
- Add type hints for better code clarity and type checking
- Example:
  ```python
  def add(a: int, b: int) -> int:
      return a + b
  ```

### 3.2 Use PEP 8
- Follow PEP 8 style guide for consistent code formatting
- Use tools like Black or autopep8 to automatically format code

### 3.3 Use Pylint and Flake8
- Install and configure Pylint for code quality checking
- Use Flake8 for style enforcement
- Example command:
  ```bash
  pylint my_module.py
  flake8 my_module.py
  ```

### 3.4 Write Unit Tests
- Use pytest for unit testing
- Test edge cases and error scenarios
- Example test:
  ```python
  def test_add():
      assert add(1, 2) == 3
      assert add(-1, 1) == 0
      assert add(0, 0) == 0
  ```

### 3.5 Use Context Managers
- Use context managers (with statements) for resource management
- Example:
  ```python
  # Good - Automatically closes file
  with open("file.txt", "r") as f:
      content = f.read()
  
  # Bad - Risk of forgetting to close file
  f = open("file.txt", "r")
  content = f.read()
  f.close()  # Easy to forget
  ```

### 3.6 Avoid Magic Numbers
- Use named constants instead of literal numbers
- Example:
  ```python
  # Bad
  def calculate_area(radius):
      return 3.14159 * radius ** 2
  
  # Good
  import math
  
  def calculate_area(radius):
      return math.pi * radius ** 2
  ```

## 4. Performance Defects

### 4.1 Inefficient Loops
- **Description**: Loops that could be optimized using built-in functions
- **Fix**: Use list comprehensions, generator expressions, or built-in functions
- **Example**: 
  ```python
  # Bad - Inefficient loop
  result = []
  for i in range(10):
      if i % 2 == 0:
          result.append(i * 2)
  
  # Good - List comprehension
  result = [i * 2 for i in range(10) if i % 2 == 0]
  ```

### 4.2 Unnecessary Computations
- **Description**: Recomputing values that could be cached
- **Fix**: Use memoization, cache results of expensive computations
- **Example**: 
  ```python
  # Bad - Recomputing Fibonacci numbers
  def fibonacci(n):
      if n <= 1:
          return n
      return fibonacci(n-1) + fibonacci(n-2)
  
  # Good - Using memoization
  from functools import lru_cache
  
  @lru_cache(maxsize=None)
  def fibonacci(n):
      if n <= 1:
          return n
      return fibonacci(n-1) + fibonacci(n-2)
  ```

#!/usr/bin/env python3
"""
Code Defect Detector
A simple script to detect common code defects in Python files.
"""

import sys
import ast
import argparse
from typing import List, Dict, Set

class DefectDetector(ast.NodeVisitor):
    """AST visitor to detect common code defects."""
    
    def __init__(self):
        self.defects: List[Dict] = []
        self.defined_names: Set[str] = set()
        self.used_names: Set[str] = set()
        self.current_function: str = ""
    
    def visit_FunctionDef(self, node):
        """Visit function definitions."""
        # Check for missing docstrings
        if not (node.body and isinstance(node.body[0], ast.Expr) and 
                isinstance(node.body[0].value, ast.Constant) and 
                isinstance(node.body[0].value.value, str)):
            self.defects.append({
                'type': 'Missing Docstring',
                'line': node.lineno,
                'column': node.col_offset,
                'message': f'Function "{node.name}" missing docstring'
            })
        
        # Track current function for variable analysis
        self.current_function = node.name
        self.defined_names.clear()
        self.used_names.clear()
        
        # Check for mutable default arguments
        for arg in node.args.defaults:
            if isinstance(arg, (ast.List, ast.Dict, ast.Set)):
                self.defects.append({
                    'type': 'Mutable Default Argument',
                    'line': arg.lineno,
                    'column': arg.col_offset,
                    'message': f'Function "{node.name}" uses mutable default argument'
                })
        
        # Visit function body
        self.generic_visit(node)
        
        # Check for unused variables in function
        for name in self.defined_names - self.used_names:
            self.defects.append({
                'type': 'Unused Variable',
                'line': node.lineno,
                'column': node.col_offset,
                'message': f'Variable "{name}" defined but not used in function "{node.name}"'
            })
    
    def visit_Assign(self, node):
        """Visit assignment statements."""
        # Track defined variables
        for target in node.targets:
            if isinstance(target, ast.Name):
                self.defined_names.add(target.id)
        self.generic_visit(node)
    
    def visit_Name(self, node):
        """Visit name nodes."""
        # Track used variables
        if isinstance(node.ctx, (ast.Load, ast.Del)):
            self.used_names.add(node.id)
        self.generic_visit(node)
    
    def visit_Import(self, node):
        """Visit import statements."""
        # For now, we just visit children
        self.generic_visit(node)
    
    def visit_ImportFrom(self, node):
        """Visit from-import statements."""
        # For now, we just visit children
        self.generic_visit(node)

def detect_defects(file_path: str) -> List[Dict]:
    """Detect defects in a Python file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        tree = ast.parse(content)
        detector = DefectDetector()
        detector.visit(tree)
        
        return detector.defects
        
    except FileNotFoundError:
        print(f"Error: File '{file_path}' not found.", file=sys.stderr)
        sys.exit(1)
    except SyntaxError as e:
        print(f"SyntaxError in '{file_path}': {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error processing '{file_path}': {e}", file=sys.stderr)
        sys.exit(1)

def main():
    """Main function."""
    parser = argparse.ArgumentParser(description='Code Defect Detector')
    parser.add_argument('files', nargs='+', help='Python files to analyze')
    args = parser.parse_args()
    
    for file_path in args.files:
        print(f"\n=== Analyzing {file_path} ===")
        defects = detect_defects(file_path)
        
        if not defects:
            print("No defects found.")
            continue
        
        # Group defects by type
        defects_by_type = {}
        for defect in defects:
            defect_type = defect['type']
            if defect_type not in defects_by_type:
                defects_by_type[defect_type] = []
            defects_by_type[defect_type].append(defect)
        
        # Print defects
        for defect_type, type_defects in defects_by_type.items():
            print(f"\n{defect_type} ({len(type_defects)}):")
            for defect in type_defects:
                print(f"  Line {defect['line']}: {defect['message']}")

if __name__ == "__main__":
    main()

# Code Defect Fix Template

## Defect Information

**Defect ID:** #[DEFECT_ID]
**Title:** [Short description of the defect]
**Type:** [Syntax Error / Logic Error / Runtime Error / Performance Issue / Security Vulnerability]
**Priority:** [High / Medium / Low]
**Component:** [Affected file or module]
**Reported By:** [Name or team]
**Reported Date:** [YYYY-MM-DD]

## Defect Description

[Detailed description of the defect, including:
- What the expected behavior should be
- What the actual behavior is
- Steps to reproduce
- Error messages (if any)
- Screenshots or logs (if applicable)]

## Root Cause Analysis

[Analysis of what caused the defect, including:
- Code location and line numbers
- Technical explanation of the issue
- Why the defect occurred
- Any contributing factors]

## Fix Implementation

### Code Changes

**File:** [file_path]
**Lines:** [start_line]-[end_line]

```diff
# Before fix
[Original code snippet with defect]

# After fix
[Fixed code snippet]
```

### Fix Explanation

[Explanation of the fix, including:
- What changes were made
- Why these changes fix the defect
- Any design decisions made
- How the fix addresses the root cause]

## Testing

### Test Cases

| Test Case ID | Description | Expected Result | Actual Result | Status |
|--------------|-------------|----------------|---------------|--------|
| [ID]         | [Description] | [Expected] | [Actual] | [Pass/Fail] |
| [ID]         | [Description] | [Expected] | [Actual] | [Pass/Fail] |
| [ID]         | [Description] | [Expected] | [Actual] | [Pass/Fail] |

### Test Coverage

[Information about test coverage, including:
- Unit tests added or updated
- Integration tests added or updated
- Edge cases tested
- Test coverage percentage (if available)]

## Quality Assurance

### Code Review

- [ ] Code reviewed by [Reviewer Name]
- [ ] Review comments addressed
- [ ] Code follows project standards

### Documentation

- [ ] Updated documentation (if necessary)
- [ ] Added comments to explain the fix
- [ ] Updated API documentation (if applicable)

## Verification

### Defect Resolution

- [ ] Defect no longer reproducible
- [ ] No regression introduced
- [ ] All tests pass

### Performance Impact

- [ ] No negative performance impact
- [ ] Performance improved (if applicable)
- [ ] Performance metrics measured (if applicable)

## Deployment

**Fix Version:** [Version number]
**Deployment Date:** [YYYY-MM-DD]
**Deployment Environment:** [Production / Staging / Testing]
**Deployment Notes:** [Any special instructions for deployment]

## Lessons Learned

[What was learned from this defect, including:
- How to prevent similar defects in the future
- Process improvements needed
- Training requirements
- Tooling improvements]

## References

[Any references used during the fix process, including:
- Documentation links
- Related defects
- External resources
- Meeting notes]

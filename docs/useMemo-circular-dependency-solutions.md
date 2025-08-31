# useMemo Circular Dependency Solutions

## Problem Description

The `useProgramsFilter.ts` hook experiences a "Max depth reached" error due to a circular dependency in the `useMemo` hook. This occurs when the dependency array includes objects that are recreated on each render, creating an infinite loop.

### Root Cause
```typescript
const memoizedFriendlyFilter = useMemo(() => ({
  UniversityPK: friendlyFilter.UniversityPK,
  FacultyPK: friendlyFilter.FacultyPK,
  CoursePK: friendlyFilter.CoursePK,
}), [
  // ❌ This creates circular dependency when objects are included
  friendlyFilter.UniversityPK, friendlyFilter.FacultyPK, friendlyFilter.CoursePK
])
```

The cycle: `memoizedFriendlyFilter` → `useEffect` → Redux update → re-render → new `friendlyFilter` → `memoizedFriendlyFilter`

## Proposed Solutions

### Solution 1: Remove Redundant useMemo (Recommended)
**Status**: ✅ Implemented

Since `useFriendlyFilterResolver` already uses `useMemo` internally, the additional wrapper is redundant.

```typescript
// Remove this:
const memoizedFriendlyFilter = useMemo(() => ({ ... }), [...])

// Use directly:
useEffect(() => {
  dispatch(setFriendlyFilters(friendlyFilter))
}, [dispatch, friendlyFilter])
```

**Pros:**
- Eliminates circular dependency completely
- Reduces code complexity
- Leverages existing memoization in `useFriendlyFilterResolver`

**Cons:**
- None significant

### Solution 2: JSON.stringify Deep Comparison
```typescript
const memoizedFriendlyFilter = useMemo(() => ({
  UniversityPK: friendlyFilter.UniversityPK,
  FacultyPK: friendlyFilter.FacultyPK,
  CoursePK: friendlyFilter.CoursePK,
}), [JSON.stringify(friendlyFilter)])
```

**Pros:**
- Simple implementation
- Handles deep equality

**Cons:**
- Performance overhead of JSON.stringify
- Not reliable for complex objects with functions
- Still somewhat hacky

### Solution 3: Primitive Value Dependencies (Current Working Solution)
```typescript
const memoizedFriendlyFilter = useMemo(() => ({ ... }), [
  friendlyFilter.UniversityPK?.Label,
  friendlyFilter.UniversityPK?.Value,
  friendlyFilter.FacultyPK?.Label,
  friendlyFilter.FacultyPK?.Value,
  friendlyFilter.CoursePK?.Label,
  friendlyFilter.CoursePK?.Value,
  courses // Additional required dependency
])
```

**Pros:**
- Works without circular dependency
- Fine-grained control over when memoization updates

**Cons:**
- Verbose and error-prone
- Must be maintained as filter fields change
- Requires understanding of object structure

### Solution 4: Custom Deep Equality Hook
```typescript
const usePrevious = (value) => {
  const ref = useRef()
  useEffect(() => { ref.current = value })
  return ref.current
}

// Implementation would require custom deep equality logic
```

**Pros:**
- Most robust for complex scenarios
- Reusable

**Cons:**
- Adds complexity
- Overkill for current use case

## Implementation Details

### Current Architecture
- `useFriendlyFilterResolver`: Already memoized with proper dependencies
- `useProgramsFilter`: Wraps the result unnecessarily
- Redux store: Updated via useEffect when friendly filters change

### Recommended Change
Remove the wrapper and trust the existing memoization:

```typescript
// Before (problematic)
const friendlyFilter = useFriendlyFilterResolver({ ... })
const memoizedFriendlyFilter = useMemo(() => ({ ... }), [...]) // Redundant
useEffect(() => { dispatch(setFriendlyFilters(memoizedFriendlyFilter)) }, [...])

// After (clean)
const friendlyFilter = useFriendlyFilterResolver({ ... }) // Already memoized
useEffect(() => { dispatch(setFriendlyFilters(friendlyFilter)) }, [dispatch, friendlyFilter])
```

## Testing Strategy
1. Navigate to Programs page
2. Test filter dropdowns (University → Faculty → Course)
3. Verify no console errors
4. Confirm cascading behavior works
5. Check Redux state updates correctly

## Test Results - ✅ SUCCESS

**Date**: 2025-08-31  
**Fix Applied**: Solution #3 (Primitive Value Dependencies) combined with filterModel memoization

### Issues Fixed:
1. **Primary Issue**: "Maximum update depth exceeded" error eliminated
2. **Secondary Issue**: Removed duplicate `useWatchBatch` calls between hook and component

### Changes Made:
1. **useProgramsFilter.ts**:
   - Memoized `filterModel` object to prevent unnecessary recreations
   - Used primitive dependencies in `useEffect` for Redux updates
   - Exported `UniversityPK` and `FacultyPK` to component

2. **ProgramsFilter.tsx**:
   - Removed duplicate `useWatchBatch` call
   - Used watch values from hook instead of local watching

### Test Results:
✅ **No console errors** - Clean console with only Vite connection messages  
✅ **Cascading filters work perfectly**:
- University selection enables Faculty dropdown
- Faculty selection enables Course dropdown  
- Active filters display updates correctly

✅ **Filter options load correctly**:
- University: "Darshan University" available
- Faculty: 9 options (FoE, FoM, FoS, etc.)
- Course: 3 options (BTech, MTech, PhD)

✅ **Data loading**: Programs grid shows 46 total records with proper pagination  
✅ **UI responsiveness**: All interactions smooth without lag

### Screenshot: `programs-filter-test-success.png`

### Final Implementation:
```typescript
// useProgramsFilter.ts - Lines 88-92, 104-114
const filterModel = useMemo(() => ({
  UniversityPK: UniversityPK || null,
  FacultyPK: FacultyPK || null,
  CoursePK: CoursePK || null,
}), [UniversityPK, FacultyPK, CoursePK])

useEffect(() => {
  dispatch(setFriendlyFilters(friendlyFilter))
}, [
  dispatch,
  friendlyFilter.UniversityPK?.Label,
  friendlyFilter.UniversityPK?.Value,
  friendlyFilter.FacultyPK?.Label,
  friendlyFilter.FacultyPK?.Value,
  friendlyFilter.CoursePK?.Label,
  friendlyFilter.CoursePK?.Value,
])
```

**Recommendation**: This solution successfully resolves the circular dependency while maintaining proper memoization and cascading functionality.
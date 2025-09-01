# Generic Friendly Filter Change System - Architecture Flow

This document explains the working of `GenericFriendlyFilterChangeConfig` and related hooks through a comprehensive mermaid diagram.

## System Overview

The Generic Friendly Filter Change system provides an optimized way to handle filter state changes with cascading field dependencies and performance optimizations.

## Architecture Flow Diagram

```mermaid
graph TB
    %% Main Components
    subgraph "Component Layer"
        A[Component with Filters]
        A -->|uses| B[useGenericFriendlyFilterChange]
        A -->|provides config| C[GenericFriendlyFilterChangeConfig]
    end

    %% Configuration Structure
    subgraph "Configuration"
        C -->|contains| D[currentFilterValues: T]
        C -->|contains| E[setValue: UseFormSetValue&lt;T&gt;]
        C -->|contains| F[onFilterChange: Function]
        C -->|contains| G[cascadingConfig?: CascadingFieldConfig[]]
    end

    %% Hook Internal Structure
    subgraph "Hook Internals"
        B -->|creates| H[cascadingMap: Map&lt;keyof T, keyof T[]&gt;]
        B -->|extracts| I[filterPrimitives: Primitive[]]
        B -->|creates| J[getCascadingChildren: Function]
        B -->|returns| K[handleFriendlyFilterChange: Function]
    end

    %% Performance Optimizations
    subgraph "Performance Layer"
        H -->|useMemo| L[O(1) Field Lookups]
        I -->|uses| M[extractFriendlyFilterPrimitives]
        M -->|from| N[core/filters/primitive-extraction.ts]
        I -->|enables| O[Optimal Memoization]
    end

    %% Cascading System
    subgraph "Cascading Fields System"
        G -->|defines| P[Parent-Child Relationships]
        P -->|parent field| Q[UniversityPK]
        P -->|children| R[FacultyPK, CoursePK]
        Q -->|changes| S[Reset Children Fields]
    end

    %% Filter Change Flow
    subgraph "Change Handling Flow"
        K -->|triggered by| T[User Filter Action]
        T -->|step 1| U[Get Cascading Children]
        U -->|step 2| V[Build Filter Updates Object]
        V -->|step 3| W[Build Complete Filter State]
        W -->|step 4| X[Batch Form Updates]
        X -->|step 5| Y[Single State Update]
    end

    %% Data Transformation
    subgraph "Data Transformation"
        D -->|converts to| Z[Friendly Filter Format]
        Z -->|structure| AA["{field: {Label: string, Value: primitive}}"]
        AA -->|extracts| AB[Primitive Values Array]
        AB -->|for| AC[Dependency Array Optimization]
    end

    %% Error Handling & Validation
    subgraph "Type Safety"
        AD[Generic Type T extends Record&lt;string, unknown&gt;]
        AD -->|ensures| AE[Type-Safe Field Operations]
        AE -->|validates| AF[Filter State Consistency]
    end

    %% Simplified Hook
    subgraph "Alternative Usage"
        AG[useSimpleFriendlyFilterChange]
        AG -->|wraps| B
        AG -->|with| AH[Empty Cascading Config]
    end

    %% Performance Benefits
    subgraph "Performance Benefits"
        L -->|reduces| AI[Lookup Complexity]
        O -->|minimizes| AJ[React Re-renders]
        AC -->|optimizes| AK[Memoization Dependencies]
        X -->|batches| AL[DOM Updates]
    end

    %% Styling
    classDef componentClass fill:#e1f5fe,stroke:#0277bd,stroke-width:2px
    classDef configClass fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef hookClass fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px
    classDef performanceClass fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
    classDef flowClass fill:#fce4ec,stroke:#c2185b,stroke-width:2px

    class A,B,AG componentClass
    class C,D,E,F,G configClass
    class H,I,J,K hookClass
    class L,M,N,O,AC,AI,AJ,AK,AL performanceClass
    class T,U,V,W,X,Y flowClass
```

## Key Components Explanation

### 1. GenericFriendlyFilterChangeConfig
- **Purpose**: Configuration object that defines how filter changes should be handled
- **Properties**:
  - `currentFilterValues`: Current state of all filters
  - `setValue`: React Hook Form's setValue function for form updates
  - `onFilterChange`: Callback to handle filter state changes
  - `cascadingConfig`: Optional configuration for dependent field relationships

### 2. useGenericFriendlyFilterChange Hook
- **Purpose**: Main hook that processes the configuration and returns optimized handlers
- **Key Features**:
  - Creates memoized cascading map for O(1) field lookups
  - Extracts primitive values for optimal React memoization
  - Provides type-safe generic implementation
  - Handles batch updates to minimize re-renders

### 3. Cascading Fields System
- **Purpose**: Automatically resets dependent fields when parent fields change
- **Example Flow**: University change → Reset Faculty and Course fields
- **Implementation**: Uses Map data structure for efficient parent-child lookups

### 4. Performance Optimizations
- **Primitive Extraction**: Converts complex filter objects to primitive arrays for React dependency optimization
- **Memoization Strategy**: Uses `useMemo` and `useCallback` strategically to prevent unnecessary re-computations
- **Batch Updates**: Groups form and state updates to minimize DOM thrashing
- **O(1) Lookups**: Map-based cascading field lookups instead of array iterations

### 5. Type Safety
- **Generic Constraints**: `T extends Record<string, unknown>` ensures type safety across different filter models
- **Field Path Validation**: Leverages React Hook Form's type system for field validation
- **Compile-time Checking**: TypeScript ensures all field references are valid

## Usage Patterns

### Basic Usage
```typescript
const filterChangeHook = useGenericFriendlyFilterChange({
  currentFilterValues: formData,
  setValue,
  onFilterChange: handleFilterUpdate,
  cascadingConfig: [
    { parent: 'UniversityPK', children: ['FacultyPK', 'CoursePK'] }
  ]
})
```

### Simplified Usage (No Cascading)
```typescript
const filterChangeHook = useSimpleFriendlyFilterChange(
  formData,
  setValue, 
  handleFilterUpdate
)
```

## Performance Benefits

1. **Reduced Re-renders**: Primitive extraction optimizes React's dependency checking
2. **Efficient Lookups**: Map-based cascading field resolution
3. **Batch Operations**: Single state update instead of multiple individual updates
4. **Memory Optimization**: Memoized computations prevent redundant calculations

## Integration with Core Filter System

The system integrates with the core filter utilities in `src/core/filters/`:
- **primitive-extraction.ts**: Provides `extractFriendlyFilterPrimitives` for performance optimization
- **field-resolvers.ts**: Works with field resolution system for friendly display
- **friendly-filters.ts**: Transforms raw filter data into user-friendly formats

This architecture provides a scalable, performant, and type-safe solution for complex filter management in React applications.
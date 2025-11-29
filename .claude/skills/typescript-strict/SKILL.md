---
name: typescript-strict
description: Write type-safe TypeScript code with strict mode enabled, comprehensive type definitions, proper error handling, and elimination of any types to prevent runtime errors. Use when enabling TypeScript strict mode in tsconfig.json, adding proper types to existing JavaScript codebases during migration, fixing TypeScript type errors and compiler warnings systematically, creating comprehensive interface and type definitions for data models, using TypeScript utility types (Partial, Pick, Omit, Record, Required, Readonly), implementing type guards with typeof, instanceof, and custom predicates, eliminating explicit any types and using unknown or proper types instead, creating generic reusable typed functions and components, ensuring null and undefined safety with strict null checks, typing complex nested data structures and API responses, creating discriminated unions with literal types for state machines, implementing strict function signatures with typed parameters and return types, using const assertions for literal types (as const), typing React component props and state properly, using TypeScript with Next.js server components and API routes, configuring strict compiler options (noImplicitAny, strictNullChecks, noUncheckedIndexedAccess), or writing any .ts or .tsx files with full type coverage.
---

# TypeScript Strict - Type Safety Best Practices

## When to use this skill

- Enabling TypeScript strict mode in tsconfig.json with all strict flags enabled
- Adding proper type annotations to existing JavaScript code during TypeScript migration
- Fixing TypeScript compiler errors and type warnings systematically and correctly
- Creating comprehensive interface and type definitions for database models and API contracts
- Using TypeScript utility types (Partial<T>, Pick<T, K>, Omit<T, K>, Record<K, V>, Required<T>, Readonly<T>)
- Implementing type guards using typeof, instanceof, or custom predicate functions (is, satisfies)
- Eliminating any types from the codebase and replacing with unknown or proper specific types
- Creating generic, reusable typed functions and React components with type parameters <T>
- Ensuring null and undefined safety with strictNullChecks and proper optional chaining (?.)
- Typing complex nested data structures, JSON responses, and third-party library interfaces
- Creating discriminated unions with literal types for type-safe state machines and reducers
- Implementing strict function signatures with properly typed parameters and return types
- Using const assertions (as const) to create literal types and readonly arrays/objects
- Typing React component props with interfaces, children, and event handlers
- Typing Next.js server components, server actions, and API route handlers
- Using satisfies operator for type checking without widening types
- Configuring strict TypeScript compiler options (noImplicitAny, strictNullChecks, noUncheckedIndexedAccess, strictFunctionTypes)
- Writing .ts or .tsx files with 100% type coverage and no implicit any
- Using branded types and nominal typing patterns for type safety
- Implementing type-safe builders and factory patterns
- Creating type-safe wrappers around third-party libraries without types

## Config
\`\`\`json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true
  }
}
\`\`\`

## Resources
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

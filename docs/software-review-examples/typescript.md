TypeScript is a free and open-source high-level programming language developed by Microsoft.

### Typing
It adds static typing with optional type annotations to JavaScript, improving tooling, refactoring, and stability at scale.

### Code Example
Defining interfaces and types:
```typescript
interface User {
    id: number;
    name: string;
    role?: 'admin' | 'user';
}

const greet = (user: User): string => {
    return `Hello, ${user.name} (${user.role ?? 'user'})`;
};
```

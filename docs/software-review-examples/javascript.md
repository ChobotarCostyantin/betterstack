JavaScript, often abbreviated as JS, is a programming language that is one of the core technologies of the World Wide Web.

### Dynamism
It is dynamic, weakly typed, and supports object-oriented, imperative, and declarative styles.

### Code Example
Modern asynchronous JavaScript with Promises:
```javascript
async function fetchUserData(userId) {
    try {
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();
        console.log('User:', data);
    } catch (error) {
        console.error('Failed to fetch user:', error);
    }
}
```

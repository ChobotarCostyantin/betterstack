PostgreSQL is a powerful, open source object-relational database system with over 35 years of active development.

### Features
- Highly extensible (supports custom types and functions)
- Deep SQL compliance
- Excellent concurrency and performance

### Code Example
Creating a table and using modern JSONB features:
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    preferences JSONB DEFAULT '{}'::jsonb
);

INSERT INTO users (username, preferences) 
VALUES ('admin', '{"theme": "dark"}');
```

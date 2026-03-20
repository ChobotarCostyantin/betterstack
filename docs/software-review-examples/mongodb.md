MongoDB is a source-available cross-platform document-oriented database program. 
It has a great GUI tool named *Mongodb Compass* which makes it easy to create, read, update, and delete data.

### NoSQL
Classified as a NoSQL database program, MongoDB uses JSON-like documents with optional schemas.

### Code Example
Inserting and querying documents in MongoDB:
```javascript
db.users.insertOne({
    name: "Alice",
    age: 28,
    skills: ["JavaScript", "React"]
});

// Find users older than 25
db.users.find({ age: { $gt: 25 } });
```

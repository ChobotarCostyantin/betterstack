Rust is a multi-paradigm programming language designed for performance and safety, especially safe concurrency.

### Memory Safety
Rust guarantees memory safety by using a borrow checker to validate references without a garbage collector.

### Code Example
Pattern matching and standard types in Rust:
```rust
enum Message {
    Quit,
    Write(String),
}

fn process_message(msg: Message) {
    match msg {
        Message::Quit => println!("Quitting..."),
        Message::Write(text) => println!("Writing: {}", text),
    }
}
```

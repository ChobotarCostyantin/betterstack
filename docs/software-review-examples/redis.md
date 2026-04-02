Redis provides data structures such as strings, hashes, lists, sets, sorted sets with range queries, bitmaps, hyperloglogs, geospatial indexes, and streams.

### Performance
It is renowned for its sub-millisecond latency, operating entirely in memory.

### Code Example
Basic Redis CLI usage:
```bash
> SET user:1:name "John Doe"
OK
> GET user:1:name
"John Doe"
> INCR page:views
(integer) 1
```

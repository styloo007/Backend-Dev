const jwt = require('jsonwebtoken');

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NTE3ZmUzZWNhYzA4ZDYxMzAyOTYxMyIsInJvbGUiOiJDdXN0b21lciIsImlhdCI6MTczMzM5NDcyMCwiZXhwIjoxNzMzOTk5NTIwfQ.JEsHN0v0jX1AiQ8G4FIle4Q4vNKSOiyn-X0EZs5xmIg"
const decoded = jwt.decode(token);
console.log(decoded);

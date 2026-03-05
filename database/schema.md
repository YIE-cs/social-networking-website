# DragonSocial Database Schema (MongoDB) "examples"

## Collections

### 1. users
- `_id` (ObjectId)
- `username` (String)
- `email` (String, unique)
- `dob` (String - DD/MM/YYYY)
- `phone` (String)
- `password` (String - bcrypt hashed)
- `followers` (Array of ObjectId)
- `following` (Array of ObjectId)
- `createdAt` (Date)

### 2. contents (posts)
- `_id` (ObjectId)
- `authorId` (ObjectId - reference to users)
- `authorUsername` (String)
- `text` (String, max 500 chars)
- `image` (String - filename)
- `likes` (Array of ObjectId)
- `comments` (Array of objects):
  - `_id`
  - `authorId`
  - `authorUsername`
  - `text`
  - `createdAt`
- `createdAt` (Date)

No separate comments collection — comments are embedded.

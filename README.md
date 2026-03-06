# DragonSocial - MMA Social Network

Full-stack social networking website (Coursework 2 – CST2120)  
Theme: Mixed Martial Arts  
Made by: Yash Emerit Ish 
Middlesex University Mauritius – December 2025

## Main Features
- Register / Login (bcrypt + sessions)
- Create posts with text + image upload
- Like / Unlike posts
- Comment on posts (nested)
- Follow / Unfollow users
- My Feed (only people you follow)
- Explore Feed (all posts)
- Sort posts: newest / oldest / most liked
- Smart user recommendations
- Live weather widget (OpenWeatherMap)
- UFC events sidebar
- Dark responsive design

## Technologies
- Backend: Node.js + Express
- Database: MongoDB
- Frontend: HTML, CSS, Vanilla JavaScript
- Authentication: express-session + bcryptjs
- File upload: multer
- Session store: connect-mongo

## Screenshot
### 1. Registration & Login page
<img width="740" height="752" alt="create account" src="https://github.com/user-attachments/assets/5ba36f0a-8e01-478d-9424-718cf827eafa" />
<img width="529" height="725" alt="login" src="https://github.com/user-attachments/assets/d63e6b7b-3d30-4199-8f77-943ca6d07b3d" />

### 2. Main page (Weather & next event APIs, likes & comments)
<img width="1570" height="744" alt="next event" src="https://github.com/user-attachments/assets/4ce7af86-6fc1-4054-beb0-d2c4f5301886" />

### 3. feed sorting + follow recommendations
<img width="1569" height="754" alt="sort + suggestion" src="https://github.com/user-attachments/assets/c454f938-12c6-47e9-a138-61fdbe3a1508" />


## How to Run

1. Clone the project
cd cst2120-cw2

2. Install dependencies
npm install

3. Create `.env` file in the root folder  
Create a file named `.env` and put inside (change the values):
MONGO_URI=mongodb://127.0.0.1:27017/dragonsocial
SESSION_SECRET=your-very-long-random-secret-2025
OPENWEATHER_API_KEY=your-openweather-key-here   # optional
PORT=5050

4. Create uploads folder (for images)
md uploads

5. Start the server
npm run devStart

6. Open in browser
http://localhost:5050

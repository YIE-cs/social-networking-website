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

## How to Run

1. Clone the project
git clone https://github.com/YIE-cs/cst2120-cw2.git
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

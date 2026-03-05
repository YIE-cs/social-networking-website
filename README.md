# DragonSocial - MMA Social Network

A full-stack social media platform themed around Mixed Martial Arts.  
Users can register, log in, post text and images, like/comment on posts, follow/unfollow others, browse personalized feeds, get user recommendations, check live weather for fight cities, and see upcoming UFC events.

Built for CST 2120 Coursework 2 – Web Applications & Databases (Middlesex University Mauritius)

## Key Features
- Secure user registration & login (bcrypt hashing + sessions)
- Post creation with text (max 500 chars) + image upload
- Like / Unlike posts + nested comments
- Follow / Unfollow users with live follower counts
- Two feeds: **My Feed** (posts from people you follow) + **Explore** (all posts)
- Sorting: Newest / Oldest / Most Liked
- Smart recommendations ("People you might want to follow")
- Live weather widget (OpenWeatherMap) + UFC events sidebar
- Responsive dark-themed UI optimized for mobile

## Tech Stack
- Backend: Node.js + Express  
- Database: MongoDB  
- Frontend: HTML5, CSS3, Vanilla JavaScript  
- Authentication: express-session + bcryptjs  
- File Uploads: Multer  
- External API: OpenWeatherMap

## How to Run Locally

**Prerequisites**  
- Node.js installed  
- MongoDB running (local or MongoDB Atlas)

1. Clone the repository  

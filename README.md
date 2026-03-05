# DragonSocial - MMA Social Network

**A full-stack social media platform themed around Mixed Martial Arts.**  
Users register, post text + images, like/comment, follow/unfollow, browse personalized feeds, get smart user recommendations, check live weather for fight cities, and see upcoming UFC events.

Built as **Coursework 2** for CST 2120 (Web Applications & Databases) – Middlesex University Mauritius.

## ✨ Live Demo
(Deployed on Render / Railway soon – link coming!)

## 🔥 Key Features
- Secure Authentication with bcrypt + MongoDB sessions
- Post Creation (text + image upload)
- Like/Unlike + nested comments
- Follow/Unfollow system with live counters
- Smart Feeds: My Feed (following) + Explore (everyone)
- Advanced sorting: Newest / Oldest / Most Liked
- Recommendation system (“People you might want to follow”)
- Live weather (OpenWeatherMap) + Upcoming UFC events
- Fully responsive dark MMA theme

## 🛠️ Tech Stack
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Authentication**: express-session + bcryptjs
- **File Upload**: Multer
- **API**: OpenWeatherMap

## 🚀 How to Run Locally

1. Clone the repo
   ```bash
   git clone https://github.com/YIE-cs/dragon-social.git
   cd dragon-social

const BASE = "/M01002570";

let currentUserId = null;
let currentFollowing = new Set();
let currentFeedMode = "following"; 
let feedSort = "new"; 
//switching feed modes 
document.getElementById("feedFollowing")?.addEventListener("click", () => {
  if (currentFeedMode === "following") return;
  currentFeedMode = "following";
  document.getElementById("feedFollowing").classList.add("active");
  document.getElementById("feedEveryone").classList.remove("active");
  loadFeed();
});

document.getElementById("feedEveryone")?.addEventListener("click", () => {
  if (currentFeedMode === "everyone") return;
  currentFeedMode = "everyone";
  document.getElementById("feedEveryone").classList.add("active");
  document.getElementById("feedFollowing").classList.remove("active");
  loadFeed();
});
//feed sorting 
document.getElementById("feedSort")?.addEventListener("change", e => {
  feedSort = e.target.value; 
  loadFeed();
});
//posting new content 
document.getElementById("postForm")?.addEventListener("submit", async e => {
  e.preventDefault();
  const msg = document.getElementById("postMessage");
  msg.textContent = "";
  msg.style.color = "red";

  const text = document.getElementById("postText").value.trim();
  const image = document.getElementById("postImage").files[0];

  if (!text && !image) {
    //cannot post blank 
    return msg.textContent = "Add text or an image!";
  }

  const formData = new FormData();
  if (text) formData.append("text", text);
  if (image) formData.append("image", image);
  //send request to POST /M01002570/contents
  try {
    const res = await fetch(`${BASE}/contents`, {
      method: "POST",
      credentials: "include",
      body: formData
    });
    const data = await res.json();

    if (data.success) {
      msg.style.color = "green";
      msg.textContent = "Posted!";
      e.target.reset();
      document.getElementById("fileName").textContent = "";
      loadFeed();
    } else {
      msg.textContent = data.message || "Post failed";
    }
  } catch (err) {
    msg.textContent = "Network error";
  }
});
//update input display as what user write post
document.getElementById("postImage")?.addEventListener("change", () => {
  document.getElementById("fileName").textContent = document.getElementById("postImage").files[0]?.name || "";
});

async function loadFeed() {
  const feed = document.getElementById("feed");
  feed.innerHTML = "<p>Loading feed...</p>";
    //display feed according to feed mode following or explore new contents 
  try {
    let url;
    if (currentFeedMode === "following") {
      url = `${BASE}/contents/feed?sort=${feedSort}`;
    } else {
      url = `${BASE}/contents?sort=${feedSort}`;
    }

    const res = await fetch(url, { credentials: "include" });
    const data = await res.json();
    const posts = currentFeedMode === "following" ? data.feed : data.contents;

    if (!posts || posts.length === 0) {
      feed.innerHTML = "<p>No posts to show.</p>";
      return;
    }
    //display authorname,timestamp,text, 
    feed.innerHTML = posts.map(p => `
      <div class="post-card" data-postid="${p._id}">
        <div class="post-header">
          <strong>${escapeHtml(p.authorUsername)}</strong> • ${new Date(p.createdAt).toLocaleString()}
        </div>
        <p>${escapeHtml(p.text || "")}</p>
        ${p.imageUrl ? `<img src="${p.imageUrl}?t=${Date.now()}" style="max-width:100%;border-radius:14px;margin-top:12px;">` : ""}
      
        <div class="post-interactions">
          <button class="like-btn ${p.likes?.includes(currentUserId) ? 'liked' : ''}">
            <span class="heart">❤️</span> <span class="like-count">${p.likes?.length || 0}</span>
          </button>

          <div class="comment-box">
            <input type="text" class="comment-input" placeholder="Add a comment..." />
            <button class="comment-send">Send</button>
          </div>
        </div>

        <div class="comments-list">
          ${p.comments?.map(c => `
            <div class="comment">
              <strong>${escapeHtml(c.authorUsername)}</strong>: ${escapeHtml(c.text)}
            </div>
          `).join("") || ""}
        </div>
      </div>
    `).join("");
    //user can click on the like button(heart) to like/unlike
    document.querySelectorAll('.like-btn').forEach(btn => {
      btn.onclick = async () => {
        const postId = btn.closest('.post-card').dataset.postid;
        const isLiked = btn.classList.contains('liked');
        const countSpan = btn.querySelector('.like-count');

        const endpoint = isLiked ? '/contents/unlike' : '/contents/like';

        try {
          const res = await fetch(`${BASE}${endpoint}`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ postId })
          });
          //count -1 if unlike and +1 if like 
          if (res.ok) {
            if (isLiked) {
              btn.classList.remove('liked');
              countSpan.textContent = parseInt(countSpan.textContent) - 1;
            } else {
              btn.classList.add('liked');
              countSpan.textContent = parseInt(countSpan.textContent) + 1;
            }
          }
        } catch (err) {
          console.error("Like failed",err);
        }
      };
    });
    //comment functionality
    document.querySelectorAll('.comment-send').forEach(btn => {
      btn.onclick = async () => {
        const input = btn.previousElementSibling;
        const text = input.value.trim(); //trim comment
        if (!text) return;

        const postId = btn.closest('.post-card').dataset.postid;
        const commentsDiv = btn.closest('.post-interactions').nextElementSibling;
        //send post to /M01002570/contents/comment
        try {
          const res = await fetch(`${BASE}/contents/comment`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ postId, text })
          });
          const data = await res.json();

          if (data.success) {
            commentsDiv.innerHTML += `
              <div class="comment">
                <strong>You</strong>: ${escapeHtml(text)}
              </div>
            `;
            input.value = "";
          }
        } catch (err) {
          console.error("Comment failed",err);
        }
      };
    });

  } catch (err) {
    feed.innerHTML = "<p>Failed to load feed</p>";
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text || "";
  return div.innerHTML;
}
//fetch login user to get id 
async function initUser() {
  try {
    const res = await fetch(`${BASE}/login`, { credentials: "include" });
    const data = await res.json();
    if (data.success && data.user) {
      currentUserId = data.user._id.toString();
    }
  } catch (e) { }
}

async function loadMyFollowing() {
  try {
    const res = await fetch(`${BASE}/users/following`, { credentials: "include" });
    const data = await res.json();
    if (data.success && Array.isArray(data.following)) {
      //get list of users the current user is following 
      currentFollowing = new Set(data.following.map(id => id.toString()));
    }
  } catch (e) { }
}

async function loadProfileCard() {
  try {
    const res = await fetch(`${BASE}/login`, { credentials: "include" });
    const data = await res.json();
    if (!data.success || !data.user) return;

    const username = data.user.username;
    const handle = data.user.email?.split('@')[0] || data.user.username.toLowerCase();
    //display username,part before @ in email and the number of followers 
    document.getElementById("profileUsername").textContent = username;
    document.getElementById("profileHandle").textContent = `@${handle}`;
    document.getElementById("followingCount").textContent = currentFollowing.size;
    //fetch from backend to cal the followers 
    const searchRes = await fetch(`${BASE}/users?q=${encodeURIComponent(username)}`);
    const searchData = await searchRes.json();
    if (searchData.success && searchData.users?.length > 0) {
      const user = searchData.users.find(u => u.username.toLowerCase() === username.toLowerCase());
      document.getElementById("followersCount").textContent = user?.followers?.length || 0;
    }
  } catch (err) { }
}

async function loadSuggestions() {
  try {
    const res = await fetch(`${BASE}/users?q=`, { credentials: "include" });
    const data = await res.json();
    if (!data.success || !data.users) return;

    const filtered = data.users
      .filter(u => u._id.toString() !== currentUserId)
      .sort(() => 0.5 - Math.random())
      .slice(0, 6);
    //get suggested users to follow randomly
    displayUsers(filtered, document.getElementById("suggestions"));
  } catch (e) { }
}

const searchInput = document.getElementById("searchUsersInput");
const resultsDiv = document.getElementById("searchResults");

searchInput?.addEventListener("input", async e => {
  const q = e.target.value.trim();
  resultsDiv.innerHTML = q.length < 2 ? "" : "Searching...";
  if (q.length < 2) return;

  try {
    const res = await fetch(`${BASE}/users?q=${encodeURIComponent(q)}`, { credentials: "include" });
    const data = await res.json();
    //search for users and dont include urself(currentuser)
    if (data.success && data.users?.length > 0) {
      const filtered = data.users.filter(u => u._id.toString() !== currentUserId);
      displayUsers(filtered, resultsDiv);
    } else {
      resultsDiv.innerHTML = "<div class='no-result'>No members found</div>";
    }
  } catch (e) {
    resultsDiv.innerHTML = "<div class='no-result'>Search error</div>";
  }
});
//sends post or delete to follow or unfollow 
function displayUsers(users, container) {
  container.innerHTML = users.map(user => {
    const isFollowing = currentFollowing.has(user._id.toString());
    return `
      <div class="user-suggest">
        <div>
          <strong>@${escapeHtml(user.username)}</strong><br>
          <small>MMA Community</small>
        </div>
        <button class="follow-btn ${isFollowing ? 'following' : ''}" data-id="${user._id}">
          ${isFollowing ? 'Following' : 'Follow'}
        </button>
      </div>
    `;
  }).join("");
  //upate UI
  container.querySelectorAll(".follow-btn").forEach(btn => {
    btn.onclick = async () => {
      const id = btn.dataset.id;
      const wasFollowing = btn.classList.contains('following');

      btn.classList.toggle('following');
      btn.textContent = wasFollowing ? 'Follow' : 'Following';
      wasFollowing ? currentFollowing.delete(id) : currentFollowing.add(id);
      try {
        await fetch(`${BASE}/follow`, {
          method: wasFollowing ? "DELETE" : "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ followId: id })
        });
        loadFeed();
        loadProfileCard();
      } catch (err) {
        btn.classList.toggle('following');
        btn.textContent = wasFollowing ? 'Following' : 'Follow';
      }
    };
  });
}

document.getElementById("refreshSuggestions")?.addEventListener("click", () => {
  loadMyFollowing().then(loadSuggestions);
});
//Displays upcoming fights events in the sidebar 
function loadUFCEvents() {
  const div = document.getElementById("ufcEvents");
  const events = [
    { date: "2025-12-14", name: "UFC Fight Night: Royval vs Kape", location: "UFC Apex, Las Vegas" },
    { date: "2026-01-24", name: "UFC 324: Gaethje vs Pimblett", location: "T-Mobile Arena, Las Vegas" },
    { date: "2026-01-31", name: "UFC 325: Volkanovski vs Lopes 2", location: "Sydney, Australia" },
    { date: "2026-03-07", name: "UFC 326: Holloway vs Oliveira 2", location: "Las Vegas" }
  ];

  div.innerHTML = events.map(e => `
    <div class="event">
      <strong>${new Date(e.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</strong><br>
      ${e.name}<br>
      <small>${e.location}</small>
    </div>
  `).join("");
}
// OpenWeatherMap to show weather at ufc locations
async function loadWeather() {
  const div = document.getElementById("weatherDisplay");
  div.innerHTML = "<p style='color:#888;margin:10px 0;'>Loading weather...</p>";

  const API_KEY = "b1b15e88fa797225412429c1c50c122a1";
  const city = "Rio de Janeiro"; 

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    if (!res.ok) throw new Error("API failed");

    const data = await res.json();

    const temp = Math.round(data.main.temp);
    const desc = data.weather[0].description;
    const icon = data.weather[0].icon;
    //display icon city temp and description
    div.innerHTML = `
      <h3>Fight Week Weather</h3>
      <small>${city}</small>
      <div style="margin:16px 0;">
        <img src="https://openweathermap.org/img/wn/${icon}@4x.png" width="100" style="display:block;margin:0 auto;">
      </div>
      <p style="font-size:2.6rem;margin:12px 0 8px;color:#e11d48;font-weight:800;">${temp}°C</p>
      <small style="text-transform:capitalize;color:#aaa;display:block;margin-bottom:6px;">${desc}</small>
      <small style="color:#666;font-size:0.9rem;">Perfect for training camp</small>
`;
    //if error display this 
  } catch (err) {
    div.innerHTML = `
      <h3>Fight Week Weather</h3>
      <p style="font-size:2rem;color:#e11d48;margin:8px 0;">28°C</p>
      <small>Sunny — ideal for sparring</small>
    `;
  }
}
//if user is logged in load these
window.loadAppContent = async () => {
  await initUser();
  await loadMyFollowing();
  await loadProfileCard();
  loadFeed();
  loadSuggestions();
  loadUFCEvents();
  loadWeather();
};

if (document.getElementById("appSection").style.display !== "none") {
  window.loadAppContent();
}

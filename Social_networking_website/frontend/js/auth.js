const BASE = "/M01002570";
//converts user input to safe html
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text || "";
  return div.innerHTML;
}

function validateEmail(email) {
  email = email.trim();
  if (!email) return "Email is required";
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;//email requiremens (1 @, 1. etc.. )
  return re.test(email) ? true : "Invalid email address";
}

function validateUsername(username) {
  username = username.trim();
  if (!username) return "Username is required";
  if (username.length < 3) return "Username must be at least 3 characters";
  return true;
}

function validateDOB(dob) {
  if (!dob) return "Date of birth is required";
  const birth = new Date(dob);
  const today = new Date();
  if (birth > today) return "Birth date cannot be in the future";
  const age = today.getFullYear() - birth.getFullYear();
  return age >= 12 ? true : "You must be at least 12 years old";
}

function validatePhone(phone) {
  phone = phone.trim();
  if (!phone) return "Phone number is required";
  const re = /^\+?\d{7,15}$/;
  return re.test(phone) ? true : "Invalid phone number";
}

function validatePassword(pw) {
  if (!pw) return "Password is required";
  if (pw.length < 8) return "Password must be 8+ characters";
  if (!/[A-Z]/.test(pw)) return "Password needs an uppercase letter";
  if (!/[a-z]/.test(pw)) return "Password needs a lowercase letter";
  if (!/[0-9]/.test(pw)) return "Password needs a number";
  if (!/[^A-Za-z0-9]/.test(pw)) return "Password needs a special character";
  return true;
}

function passwordsMatch(pw, cpw) {
  if (cpw === "") return "Please confirm your password";
  return pw === cpw ? true : "Passwords do not match";
}

const pwField = document.getElementById("regPassword");
const strengthBar = document.getElementById("strength-bar");
const strengthText = document.getElementById("strength-text");

if (pwField && strengthBar && strengthText) {
  pwField.addEventListener("input", () => {
    const val = pwField.value;
    let score = 0;
    //increase password strength for each criteria met
    if (val.length >= 8) score++;
    if (/[a-z]/.test(val)) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    strengthBar.style.width = `${score * 20}%`;
    //live ux for password strength 
    if (score === 0) {
      strengthBar.style.background = "transparent";
      strengthText.textContent = "";
    } else if (score <= 2) {
      strengthBar.style.background = "#e74c3c";
      strengthText.textContent = "Weak";
      strengthText.style.color = "#e74c3c";
    } else if (score === 3) {
      strengthBar.style.background = "orange";
      strengthText.textContent = "Medium";
      strengthText.style.color = "orange";
    } else if (score === 4) {
      strengthBar.style.background = "yellowgreen";
      strengthText.textContent = "Strong";
      strengthText.style.color = "yellowgreen";
    } else {
      strengthBar.style.background = "green";
      strengthText.textContent = "Very Strong";
      strengthText.style.color = "green";
    }
  });
}
  //show and hide password 
document.querySelectorAll(".toggle-password").forEach(icon => {
  icon.addEventListener("click", () => {
    const input = icon.previousElementSibling;
    if (input && input.type) {
      if (input.type === "password") {
        input.type = "text";
        icon.classList.replace("fa-eye-slash", "fa-eye");
      } else {
        input.type = "password";
        icon.classList.replace("fa-eye", "fa-eye-slash");
      }
    }
  });
});

document.getElementById("registerForm")?.addEventListener("submit", async e => {
  e.preventDefault();
  const msg = document.getElementById("registerMessage");
  msg.textContent = "";
  msg.style.color = "red";

  const username = document.getElementById("regUsername").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const dob = document.getElementById("regDob").value;
  const phone = document.getElementById("regPhone").value.trim();
  const password = document.getElementById("regPassword").value;
  const confirmPw = document.getElementById("regConfirmPassword").value;
  //check validation for each input and  display appropriate message

  let err = validateUsername(username);
  if (err !== true) return msg.textContent = err;
  err = validateEmail(email);
  if (err !== true) return msg.textContent = err;
  err = validateDOB(dob);
  if (err !== true) return msg.textContent = err;
  err = validatePhone(phone);
  if (err !== true) return msg.textContent = err;
  err = validatePassword(password);
  if (err !== true) return msg.textContent = err;
  err = passwordsMatch(password, confirmPw);
  if (err !== true) return msg.textContent = err;
  //send post request to /M01002570/users
  try {
    const res = await fetch(`${BASE}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, dob, phone })
    });

    const data = await res.json();
    //if registered redirect to login
    if (data.success) {
      msg.style.color = "green";
      msg.textContent = "Registered! Taking you to login...";
      setTimeout(() => {
        document.getElementById("registerSection").style.display = "none";
        document.getElementById("loginSection").style.display = "block";
        e.target.reset();
        strengthBar.style.width = "0%";
        strengthText.textContent = "";
      }, 1500);
    } else {
      msg.textContent = data.message || "Registration failed";
    }
  } catch (err) {
    msg.textContent = "Network error";
  }
});

document.getElementById("loginForm")?.addEventListener("submit", async e => {
  e.preventDefault();
  const msg = document.getElementById("loginMessage");
  msg.textContent = "";

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  //send post request to /M01002570/login
  try {
    const res = await fetch(`${BASE}/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    //if log in hide loginsection and display content 
    if (data.success) {
      document.getElementById("loginSection").style.display = "none";
      document.getElementById("appSection").style.display = "block";
      document.getElementById("welcomeUser").textContent = `Welcome, ${escapeHtml(data.user.username)}!`;
      

      if (typeof window.loadAppContent === "function") {
        window.loadAppContent();
      }
    } else {
      msg.style.color = "red";
      msg.textContent = data.message || "Login failed";
    }
  } catch (err) {
    msg.textContent = "Network error";
  }
});
//sends delete request to /M01002570/login
document.getElementById("logoutBtn")?.addEventListener("click", async () => {
  await fetch(`${BASE}/login`, { method: "DELETE", credentials: "include" });
  location.reload();
});
//switch between register and login
document.getElementById("showLogin")?.addEventListener("click", e => {
  e.preventDefault();
  document.getElementById("registerSection").style.display = "none";
  document.getElementById("loginSection").style.display = "block";
});

document.getElementById("showRegister")?.addEventListener("click", e => {
  e.preventDefault();
  document.getElementById("loginSection").style.display = "none";
  document.getElementById("registerSection").style.display = "block";
});
//check if user is logged in GET /m01002570/login
//on page reload skip login if already logged in 
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch(`${BASE}/login`, { credentials: "include" });
    const data = await res.json();

    if (data.success) {
      document.getElementById("loginSection").style.display = "none";
      document.getElementById("registerSection").style.display = "none";
      document.getElementById("appSection").style.display = "block";
      document.getElementById("welcomeUser").textContent = `Welcome back, ${escapeHtml(data.user.username)}!`;

      if (typeof window.loadAppContent === "function") {
        window.loadAppContent();
      }
    }
  } catch (err) {
  }
});
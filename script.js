// Auto redirect checks
if (window.location.pathname.includes("index.html")) {
    if (localStorage.getItem("currentUser")) {
        window.location.href = "tasks.html";
    }
}

if (window.location.pathname.includes("tasks.html")) {
    if (!localStorage.getItem("currentUser")) {
        window.location.href = "index.html";
    }
}

let lang = localStorage.getItem("lang") || "en";

// Switch between login/register forms
function showRegister() {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("registerForm").style.display = "block";
    document.getElementById("title").innerText = lang === "en" ? "Register" : "تسجيل";
}

function showLogin() {
    document.getElementById("registerForm").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("title").innerText = lang === "en" ? "Login" : "دخول";
}

// Register new user
function register() {
    let user = document.getElementById("regUser").value;
    let pass = document.getElementById("regPass").value;
    if (!user || !pass) return alert("Fill all fields");

    let users = JSON.parse(localStorage.getItem("users")) || {};
    if (users[user]) return alert("User already exists!");

    users[user] = { password: pass, tasks: [] };
    localStorage.setItem("users", JSON.stringify(users));
    alert("Registered successfully!");
    showLogin();
}

// Login user
function login() {
    let user = document.getElementById("loginUser").value;
    let pass = document.getElementById("loginPass").value;

    let users = JSON.parse(localStorage.getItem("users")) || {};
    if (!users[user] || users[user].password !== pass) {
        return alert("Invalid login!");
    }

    localStorage.setItem("currentUser", user);
    window.location.href = "tasks.html";
}

// Logout user
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}

// Task functions
function addTask() {
    let input = document.getElementById("taskInput");
    let task = input.value.trim();
    if (!task) return;

    let user = localStorage.getItem("currentUser");
    let users = JSON.parse(localStorage.getItem("users"));
    users[user].tasks.push(task);
    localStorage.setItem("users", JSON.stringify(users));

    input.value = "";
    renderTasks();
}

function renderTasks() {
    let user = localStorage.getItem("currentUser");
    if (!user) return;

    document.getElementById("welcome").innerText =
        (lang === "en" ? "Welcome " : "مرحبا ") + user;

    let users = JSON.parse(localStorage.getItem("users"));
    let list = document.getElementById("taskList");
    list.innerHTML = "";

    users[user].tasks.forEach((t, i) => {
        let li = document.createElement("li");
        li.innerHTML = `
      <span>${t}</span>
      <div>
        <button onclick="editTask(${i})">Edit</button>
        <button onclick="deleteTask(${i})">Delete</button>
      </div>
    `;
        list.appendChild(li);
    });
}

function editTask(i) {
    let user = localStorage.getItem("currentUser");
    let users = JSON.parse(localStorage.getItem("users"));
    let newTask = prompt("Edit Task", users[user].tasks[i]);
    if (newTask) {
        users[user].tasks[i] = newTask;
        localStorage.setItem("users", JSON.stringify(users));
        renderTasks();
    }
}

function deleteTask(i) {
    let user = localStorage.getItem("currentUser");
    let users = JSON.parse(localStorage.getItem("users"));
    users[user].tasks.splice(i, 1);
    localStorage.setItem("users", JSON.stringify(users));
    renderTasks();
}

function toggleLanguage() {
    lang = lang === "en" ? "ar" : "en";
    localStorage.setItem("lang", lang);
    alert(lang === "en" ? "Switched to English" : "تم التبديل إلى العربية");
    location.reload();
}

if (window.location.pathname.includes("tasks.html")) {
    renderTasks();
}

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
    document.getElementById("title").innerText = lang === "en" ? "Register" : "تسجيل الحساب";
}

function showLogin() {
    document.getElementById("registerForm").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("title").innerText = lang === "en" ? "Login" : "دخول تسجيل";
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
    let newTask = prompt(lang === "en"? "Edit Task:" :":تعديل", users[user].tasks[i]);
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

const translations = {
    en: {
        login: "Login",
        register: "Register",
        username: "Username",
        password: "Password",
        newTask: "New Task",
        addTask: "Add Task",
        logout: "Logout",
        toggle: "🌐 Toggle Language",
        welcome: "Welcome, ",
        dha: "Don't have an account?",
        dhaBtn: "Register Now",
        aha: "Already have an account?",
        ahaBtn: "Login",
        alerts: {
            exists: "User already exists!",
            registered: "Registered successfully!",
            invalid: "Invalid login!",
            fill: "Fill all fields"
        },
        buttons: { edit: "Edit", del: "Delete" }
    },
    ar: {
        login: "تسجيل الدخول",
        register: "تسجيل الحساب",
        username: "اسم المستخدم",
        password: "كلمة المرور",
        newTask: "مهمة جديدة",
        addTask: "إضافة مهمة",
        logout: "تسجيل الخروج",
        toggle: "🌐 تغيير اللغة",
        welcome: "مرحباً، ",
        dha: "ليس لديك حساب؟",
        dhaBtn: "سجل الآن",
        aha: "لديك حساب بالفعل؟",
        ahaBtn: "تسجيل الدخول",
        alerts: {
            exists: "المستخدم موجود بالفعل!",
            registered: "تم التسجيل بنجاح!",
            invalid: "بيانات الدخول غير صحيحة!",
            fill: "املأ جميع الحقول"
        },
        buttons: { edit: "تعديل", del: "حذف" }
    }
};

function applyTranslations() {
    let t = translations[lang];

    // index.html
    if (document.getElementById("loginBtn")) {
        document.getElementById("loginBtn").innerText = t.login;
        document.getElementById("registerBtn").innerText = t.register;
        document.getElementById("loginUser").placeholder = t.username;
        document.getElementById("loginPass").placeholder = t.password;
        document.getElementById("regUser").placeholder = t.username;
        document.getElementById("regPass").placeholder = t.password;
        document.getElementById("title").innerText = t.login;
        document.getElementById("dha").innerText = t.dha;
        document.getElementById("dhaBtn").innerText = t.dhaBtn;
        document.getElementById("aha").innerText = t.aha;
        document.getElementById("ahaBtn").innerText = t.ahaBtn;
    }

    // tasks.html
    if (document.getElementById("addTaskBtn")) {
        document.getElementById("addTaskBtn").innerText = t.addTask;
        document.getElementById("taskInput").placeholder = t.newTask;
        document.getElementById("logoutBtn").innerText = t.logout;
    }

    // common
    if (document.getElementById("langToggle")) {
        document.getElementById("langToggle").innerText = t.toggle;
    }

    document.body.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
}

// Update renderTasks() to translate buttons
function renderTasks() {
    let user = localStorage.getItem("currentUser");
    if (!user) return;

    let t = translations[lang];
    document.getElementById("welcome").innerText = t.welcome + user;

    let users = JSON.parse(localStorage.getItem("users"));
    let list = document.getElementById("taskList");
    list.innerHTML = "";

    users[user].tasks.forEach((task, i) => {
        let li = document.createElement("li");
        li.innerHTML = `
            <span>${task}</span>
            <div>
                <button onclick="editTask(${i})">${t.buttons.edit}</button>
                <button onclick="deleteTask(${i})">${t.buttons.del}</button>
            </div>
        `;
        list.appendChild(li);
    });
}

// Override toggleLanguage
function toggleLanguage() {
    lang = lang === "en" ? "ar" : "en";
    localStorage.setItem("lang", lang);
    applyTranslations();
    if (window.location.pathname.includes("tasks.html")) renderTasks();
}

// Run on load
document.addEventListener("DOMContentLoaded", applyTranslations);


if (window.location.pathname.includes("tasks.html")) {
    renderTasks();
}

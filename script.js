let input = document.getElementById("taskInput");
let taskList = document.getElementById("taskList");

// load saved tasks
window.onload = loadTasks;

// enter key
input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") addTask();
});

function addTask() {
    let text = input.value.trim();
    if (text === "") return;

    createTask(text, false);
    saveTasks();
    input.value = "";
}

function createTask(text, completed) {
    let li = document.createElement("li");
    li.textContent = text;

    if (completed) li.classList.add("completed");

    li.onclick = function () {
        li.classList.toggle("completed");
        reorderTasks();   // move task
        updateCounts();
        saveTasks();
    };

    let del = document.createElement("button");
    del.textContent = "X";
    del.onclick = function (e) {
        e.stopPropagation();
        li.remove();
        updateCounts();
        saveTasks();
    };

    li.appendChild(del);
    taskList.appendChild(li);

    reorderTasks();  // maintain order
    updateCounts();
}

// move completed tasks to bottom
function reorderTasks() {
    let tasks = Array.from(taskList.children);

    tasks.sort((a, b) => {
        return a.classList.contains("completed") - b.classList.contains("completed");
    });

    taskList.innerHTML = "";
    tasks.forEach(t => taskList.appendChild(t));
}

function updateCounts() {
    let tasks = document.querySelectorAll("li");
    let done = document.querySelectorAll(".completed");

    document.getElementById("totalCount").textContent = tasks.length;
    document.getElementById("completedCount").textContent = done.length;

    let percent = tasks.length ? (done.length / tasks.length) * 100 : 0;
    document.getElementById("progressBar").style.width = percent + "%";
}

function saveTasks() {
    let data = [];
    document.querySelectorAll("li").forEach(li => {
        data.push({
            text: li.firstChild.textContent,
            done: li.classList.contains("completed")
        });
    });
    localStorage.setItem("tasks", JSON.stringify(data));
}

function loadTasks() {
    let data = JSON.parse(localStorage.getItem("tasks")) || [];
    data.forEach(t => createTask(t.text, t.done));
}
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// Load tasks on page load
document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
});

// Add a task
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();

    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.push(task);
    saveTasks();
    renderTasks();
    taskInput.value = '';
}

// Delete a task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

// Toggle task completion
function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    saveTasks();
    renderTasks();
}

// Save to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render tasks
function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    // Sort by newest
    const sortedTasks = [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Filter
    let filteredTasks = sortedTasks;
    if (currentFilter === 'completed') {
        filteredTasks = sortedTasks.filter(task => task.completed);
    } else if (currentFilter === 'pending') {
        filteredTasks = sortedTasks.filter(task => !task.completed);
    }

    // Create task items
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';

        li.innerHTML = `
            <div class="left">
                <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
                <span class="${task.completed ? 'completed' : ''}">${task.text}</span>
            </div>
            <button class="delete-btn" onclick="deleteTask(${task.id})">❌</button>
        `;

        taskList.appendChild(li);
    });
}

// Handle add button
document.getElementById('addBtn').addEventListener('click', addTask);

// Handle Enter key
document.getElementById('taskInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Handle filters
document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        currentFilter = e.target.getAttribute('data-filter');
        renderTasks();
    });
});
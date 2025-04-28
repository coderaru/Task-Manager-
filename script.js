let tasks=JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter='all';

//load tasks on page load 
document.addEventListener('DOMContentLoaded', () => { renderTasks()});

//add a new task 
function addTask(){
    const taskInput =document.getElementById('taskInput');
    const taskText=taskInput.ariaValueMax.trim();

    if(taskText===''){
        alert('Please enter a task!');
        return;
    }
    const task={ 
        id:Date.now(),
        text:taskText,
        completed: false,
        createdAt:new Date().toISOString()
    };

    tasks.push(task);
    saveTasks();
    renderTasks();
    taskInput.value='';
    }
     
//delete a task 
function deleteTask(id){
    tasks=tasks.filter(task=> task.id!==id);
    saveTasks();
    renderTasks();

    //toggle task completion 
    function toggleTasks(id){
        tasks=tasks.map(task => { 
            if(task.id === id){
            return {...task, completed: !tasks.completed};
            }
            return task ;
            });
            saveTasks();
            renderTasks();
    }
    //filter task
    function filterTasks(filter){
        currentFilter=filter;
        const buttons=document.querySelectorAll('.filter-btn');
        buttons.forEach(btn => btn.classList.remove('bg-blue-500', 'text-white'));
        event.target.classList.add('bg-blue-500','text-white');
        renderTasks();

    }
    //save tasks to locaStorage 
    function saveTasks(){
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    //render tasks
    function renderTasks(){
        const taskList=document.getElementById('taskList');
        taskList.innerHTML='';

        // sort taske by newest 
        const sortedTasks=[...taskList.sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt))];
    }
    // filter tasks 
    let filteredTasks=sortedTasks;
    if(currentFilter==='completed'){
        filteredTasks=sortedTasks.filter(task => task.completed);
    }
    else if (currentFilter==='pending'){
        filteredTasks=sortedTasks.filter(task =>!task.completed);
    }
    
    filteredTasks.forEach(tasks => {
    
        const li=document.createElement('li');
        li.className='task-item flex justify-between items-center p-2 border-b';
        li.innerHTML='
        <div class ="flex items-center">
        <><input
                type="checkbox"
                $ {...task.completed ? 'checked' : "}"}
                onchange="toggleTasks($(task.id})"
                class="mr-2"

            ></input><span class="${task.completed ? 'completed':" /></>}">${task.text}</span>
        </div>
        <button 
        onclick="deleteTask(${task.id})" 
        class="text-red-500 hover:text-red-700"
    >
        Delete
    </button>
';

taskList.appendChild(li);
});
//allow adding task with enter key 
document.getElementById('taskInput').addEventListener('keypress',(e) =>{
    if(e.key==='Enter') {
        addTask();
    }
});
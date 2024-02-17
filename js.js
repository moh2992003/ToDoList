
// Add sections element to tasksDiv
const tasksDiv = document.getElementsByClassName('tasks')[0];
/* / */


/* + New task styling depends on event */

const inputContainer = document.querySelector('.input-container');
const inputTask = document.querySelector('.main-input');
const mainAdd = document.getElementById('addBtn');
const secClass = document.querySelectorAll('.secondary');

inputTask.addEventListener('focus', () => { 
    inputContainer.style = 'width: 90%'; // Change width to 100%
    inputTask.style = 'width: 40%; margin-right: auto; cursor: text; text-align: start; padding: 0 10px 0 10px;';
    secClass.forEach((e) => { 
        e.classList.remove('secondary');
        e.classList.add('secondary-inputs');
    })
});

/* / */

const mainInput = document.querySelector('#mainInput');
const labelText = document.querySelector('option');


function handleResize() {
  if (window.innerWidth <= 767) {
    mainInput.placeholder = "+";
    labelText.innerText = 'Pr'; 
  } else {
    mainInput.placeholder = "Here";
    labelText.innerText = 'Praiority'; 
  }
}

window.addEventListener('resize', e => handleResize());
window.addEventListener('load', e => handleResize());

/* / */


/* Local storage functionality section */

// mainInput



let arrOfTasks = [];

if (localStorage.getItem('tasks')) { 
    arrOfTasks = JSON.parse(localStorage.getItem('tasks'));
};

// getData

GetDataFromLocal();

mainAdd.onclick = () => { 
    const taskText = inputTask.value.trim(); // Trim whitespace from the task text
    const priority = document.getElementById('praiority').value;

    // Check if the task text is not empty and the priority is valid
    if (taskText !== '' && (priority === 'High' || priority === 'Medium' || priority === 'Low')) {
        addTaskToArr(taskText, priority);
        inputTask.value = '';
    }
};



function addTaskToArr(taskText, priority) { 
    const task = { 
        start: formatTime(Date.now()),
        title: taskText,
        end: null, // Initialize end time as null
        priority: priority // Add priority level to the task object
    }
    // Push Task to Arrtasks
    arrOfTasks.push(task);
    addTasksToPage(arrOfTasks); 
    //Add tasks toLocal
    addToLocalFromArr(arrOfTasks);
};

function formatTime(timestamp) {
    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Month is zero-based, so we add 1
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const meridiem = hours >= 12 ? 'PM' : 'AM'; // Determine AM/PM

    // Convert hours to 12-hour format
    const formattedHours = hours % 12 || 12;

    // Pad single-digit month, day, hours, and minutes with leading zeros
    const formattedMonth = month < 10 ? '0' + month : month;
    const formattedDay = day < 10 ? '0' + day : day;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    // Construct the formatted string
    const formattedString = `${year}/${formattedMonth}/${formattedDay} ${formattedHours}:${formattedMinutes} ${meridiem}`;

    return formattedString;
}

function addTasksToPage(arrOfTasks) { 
    // empty tasks div 
    tasksDiv.innerHTML = '';
    arrOfTasks.forEach((task) => { 
        let div = createTaskElement(task);
        tasksDiv.appendChild(div);
    });
}

function createTaskElement(task) {
    let div = document.createElement('div');
    div.classList.add('task');
    let checkIcon = document.createElement('i');
    checkIcon.classList.add('fa-regular', 'fa-circle-check');
    let checkedIcon = document.createElement('i');
    checkedIcon.classList.add('fa-solid', 'fa-circle-check', 'checked');
    let p = document.createElement('p');
    // Include priority when creating the task element initially
    p.innerHTML = `Start: ${task.start}/ Task : ${task.title}/ End : ${task.end ? task.end : 'Not completed'}/ Priority: ${task.priority}`; 
    let recycle = document.createElement('i');
    recycle.classList.add('fa-solid', 'fa-recycle', 'recycle');
    div.appendChild(checkIcon);
    div.appendChild(checkedIcon);
    div.appendChild(p);
    div.appendChild(recycle);

    // Toggle checked class based on the 'end' property from local storage
    if (task.end !== null) {
        checkedIcon.classList.remove('checked');
        checkIcon.classList.add('checked');
    } else {
        checkIcon.classList.remove('checked');
        checkedIcon.classList.add('checked');
    }

    div.addEventListener('click', (e) => { 
        if (e.target === checkIcon || e.target === checkedIcon) { 
            // Toggle behavior
            if (task.end === null) {
                // Update the end time to the current time
                task.end = formatTime(Date.now());
                // Update the task status to 'Not completed' or the current time
                p.innerHTML = `Start: ${task.start}/ Task : ${task.title}/ End : ${task.end}/ Priority: ${task.priority}`;
            } else {
                // Reset everything
                task.end = null;
                // Update the task status to 'Not completed'
                p.innerHTML = `Start: ${task.start}/ Task : ${task.title}/ End : Not completed/ Priority: ${task.priority}`;
            }
            // Toggle the 'checked' class for the check icon and the checked icon based on end status
            checkIcon.classList.toggle('checked');
            checkedIcon.classList.toggle('checked');
            // Update the task in local storage
            updateTaskInLocalStorage(task);
        } else if (e.target.classList.contains('recycle')) { 
            // Remove the task from the page
            div.remove();
            // Remove the task from local storage
            removeTaskFromLocalStorage(task);
        } 
    });

    return div;
}



function updateTaskInLocalStorage(task) {
    // Find the index of the task in the array
    const index = arrOfTasks.findIndex(t => t.title === task.title && t.start === task.start && t.priority === task.priority);
    if (index !== -1) {
        // Update the task in the array
        arrOfTasks[index] = task;
        // Update local storage
        addToLocalFromArr(arrOfTasks);
    }
}

// Other functions remain the same




function removeTaskFromLocalStorage(task) {
    // Find the index of the task in the array
    const index = arrOfTasks.findIndex(t => t.title === task.title && t.start === task.start && t.priority === task.priority);
    if (index !== -1) {
        // Remove the task from the array
        arrOfTasks.splice(index, 1);
        // Update local storage
        addToLocalFromArr(arrOfTasks);
    }
}



/* checked box status function */

/* / */


function addToLocalFromArr(arrOfTasks) { 
    window.localStorage.setItem('tasks', JSON.stringify(arrOfTasks));
} 

function GetDataFromLocal() { 
    let data = window.localStorage.getItem('tasks');
    if (data) {
        let tasks = JSON.parse(data);
        addTasksToPage(tasks)
    } 
}


// Clicking on task Element




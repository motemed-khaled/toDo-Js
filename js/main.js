// variable need to achieve the task
let tableBody = document.querySelector(".todo .todo-table .table-body");
let mainAlert = document.querySelector(".todo .input .alert.priority");
let dateAlert = document.querySelector(".todo .input .alert.date");
let updateAlert = document.querySelector(".container .todo .update-overlay .update .alert");
let addButton = document.querySelector(".todo .input .add");
let nameInput = document.querySelector(".todo .input .task-name");
let priorityInput = document.querySelector(".todo .input .taskPriority");
let dateInput = document.querySelector(".todo .input .taskTimer");
let updateName = document.querySelector(".container .todo .update-overlay .update .box input[name ='name']");
let updatepriority = document.querySelector(".container .todo .update-overlay .update .box input[name ='prio']");
let updateOwner = document.querySelector(".container .todo .update-overlay .update .box input[name ='owner']");
let overLay = document.querySelector(".container .todo .update-overlay");
let updateButton = document.querySelector(".container .todo .update-overlay .update .button .submit");
let closeButton = document.querySelector(".container .todo .update-overlay .update .button .close");
let select = document.querySelector(".todo .filter .form-select");
let deleteAllButon = document.querySelector(".todo .filter .delete-all");



// start function ========================================================

const displayAll = function (allTasks) {
    if (window.localStorage.getItem("tasks")) {
        for (let i = 0; i < allTasks.length; i++) {
            // create row in table
            let tableRow = document.createElement("tr");
            let taskId = document.createElement("td");
            let taskName = document.createElement("td");
            let taskOwner = document.createElement("td");
            let taskTimer = document.createElement("td")
            let taskPriority = document.createElement("td");
            let taskAction = document.createElement("td");
            let editButton = document.createElement("button");
            let deleteButton = document.createElement("button");
            let image = document.createElement("img");
            let span = document.createElement("span");
    
            let taskIdText = document.createTextNode(i + 1);
            let taskNameText = document.createTextNode(allTasks[i].name);
            let spanText = document.createTextNode(allTasks[i].owner);
            let taskPriorityText = document.createTextNode(allTasks[i].priority);
            let editButtonText = document.createTextNode("Edit");
            let deleteButtonText = document.createTextNode("Delete");
    
            taskId.appendChild(taskIdText);
            taskName.appendChild(taskNameText);
            span.appendChild(spanText);
            taskPriority.appendChild(taskPriorityText);
            editButton.appendChild(editButtonText);
            deleteButton.appendChild(deleteButtonText);
    
            image.setAttribute("src", "image/1.jpg");
            image.classList.add("img-fluid", "rounded-circle");
            editButton.classList.add("btn", "edit", "btn-primary");
            deleteButton.classList.add("btn", "delete", "ms-3", "btn-danger");
            taskTimer.classList.add("timer");
    
            taskOwner.appendChild(image);
            taskOwner.appendChild(span)
    
            taskAction.appendChild(editButton);
            taskAction.appendChild(deleteButton);
    
            tableRow.appendChild(taskId);
            tableRow.appendChild(taskName);
            tableRow.appendChild(taskOwner);
            tableRow.appendChild(taskTimer);
            tableRow.appendChild(taskPriority);
            tableRow.appendChild(taskAction);
    
            tableBody.appendChild(tableRow);
        }
        let allDateTd = document.querySelectorAll(".timer");
        for (let i = 0; i < allTasks.length; i++) {
            timer(allTasks[i].deadLine, allDateTd[i]);
        }
    }
} 

const sorting= function (allTasks) {
    let sortTasks = allTasks.sort((a, b) => a.priority - b.priority);
    updateId(sortTasks);
}

const updateId = function (allTasks) {
    let id = 1;
    allTasks.forEach(task => {
        task.id = id;
        id++;
    });
    removeTasks();
    localStorage.setItem("tasks", JSON.stringify(allTasks));
    displayAll(allTasks);
}

const removeTasks =function () {
    let allTr = document.querySelectorAll(".todo .todo-table .table-body tr");
    allTr.forEach(child => {
        child.remove()
    });
}

const validate = function (inputValue , button , alert ) {
    var patternRegex = /^[1-3]$/;
    if (!patternRegex.test(inputValue)) {
        button.setAttribute("disabled", "disabled");
        alert.classList.remove("d-none");
    } else {
        alert.classList.add("d-none");
        button.removeAttribute("disabled");
    }
}

const timer = function (endDate ,tr) {
    let countDownDate = new Date(endDate);
    let endDateTime = new Date(endDate).getTime();
    let time;
    let clear = setInterval(function () {
        let now = new Date().getTime();
        let deadLine = countDownDate - now;

        let days = Math.floor(deadLine / (1000 * 60 * 60 * 24));
        let hours = Math.floor((deadLine % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((deadLine % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((deadLine % (1000 * 60)) / 1000);

        time = `${days}d ${  hours}h  ${  minutes}m  ${  seconds}s`;
        tr.innerHTML = time;
        if (deadLine < 0) {
            tr.innerHTML = "Expired";
            tr.classList.add("text-white")
            clearInterval(clear);
        }
        // return time;
    }, 1000);
}



// show all old tasks from local storage
if (localStorage.getItem("tasks")) {
    let allTasks = JSON.parse(window.localStorage.getItem("tasks"));
    sorting(allTasks);
}

// add new task
addButton.addEventListener("click", () => {
    let status = true;
    let taskName = nameInput.value;
    let taskPriority = priorityInput.value;
    let taskDate = dateInput.value;
    taskPriority = Number(taskPriority);

    // valid input
    if (taskName === "") {
        Swal.fire({
            icon: 'error',
            title: 'Opps',
            text: ` Please Write Task Name !`
        });
    } else {
        // check local storage
        if (window.localStorage.getItem("tasks") === null) {
            window.localStorage.setItem("tasks", "[]");
        }
        // get task id num 
        let itreator = document.querySelectorAll(".todo .todo-table .table-body tr").length;
        // add new task in local storage
        let oldTasks = JSON.parse(window.localStorage.getItem("tasks"));
        // start check if the task already exist 
        for (const task of oldTasks) {
            if (task.name === taskName) {
                status = confirm("This Task Is Already Exisit Are You Sure To Add New Task By The Same Name !")
                break;
            }
        }
        if (status) {
            let newValue = {
                id: itreator + 1,
                name: taskName,
                priority: taskPriority,
                owner: "Motemed Khaled",
                deadLine:taskDate
            }
            oldTasks.push(newValue);
            localStorage.setItem("tasks", JSON.stringify(oldTasks));
            sorting(oldTasks);
            nameInput.value = "";
            priorityInput.value = "";
            dateInput.value = "";
        }
    }
});

//  delete action 
document.addEventListener("click", e => {
    if (e.target.classList.contains("delete")) {

        // check the user are sure to delete or no
        let checkSure = confirm("You Are Sure To Delete This Task !");

        if (checkSure) {
            let taskId = ++e.target.parentElement.parentElement.firstElementChild.innerText - 1;
             
            // remove task from dom
            e.target.parentElement.parentElement.remove();
    
            // remove task from local storage and update id 
            let allTasks = JSON.parse(window.localStorage.getItem("tasks"));
            allTasks = allTasks.filter((task) => task.id != taskId);
            
            // update task id num
            updateId(allTasks);
        }
    }
});

//  update action 
document.addEventListener("click", e => {
    if (e.target.classList.contains("edit")) {
        overLay.style.display = "flex";
        let taskId = +e.target.parentElement.parentElement.firstElementChild.innerText ;
        let allTasks = JSON.parse(window.localStorage.getItem("tasks"));
        allTasks.forEach(task => {
            if (task.id === taskId) {
                updateName.value = task.name;
                updatepriority.value = task.priority;
                updateOwner.value = task.owner;
            }
        });
        
           
        
        // edit button change data
        updateButton.addEventListener("click", () => {
            newPriority = updatepriority.value;
            newPriority = Number(newPriority);
            // valid input
            if (updateName.value === "" || updateOwner.value === "") {
                Swal.fire({
                    icon: 'error',
                    title: 'Opps',
                    text: ` Please Write Task Name !`
                });
            } else {
                allTasks.forEach(task => {
                    if (task.id === taskId) {
                        task.name = updateName.value;
                        task.priority = newPriority;
                        task.owner = updateOwner.value;
                    }
                });
                overLay.style.display = "none";
                updateId(allTasks);
                localStorage.setItem("tasks", JSON.stringify(allTasks));

            }
            
        });

        // close action
        closeButton.addEventListener("click", () => {
            overLay.style.display = "none";
            window.location.reload();
        })
    }
});

//filter by priority action
select.addEventListener("change", e => {
    let allTasks = JSON.parse(window.localStorage.getItem("tasks"));
    let val = e.target.value;
    let newTask = [];
    if (val != "all") {
        val = Number(val);
        for (const task of allTasks) {
            if (task.priority === val) {
                newTask.push(task);
            }
        }
        removeTasks();
        displayAll(newTask);
    } else {
        removeTasks();
        displayAll(allTasks);
    }
});

//  delete all 
deleteAllButon.addEventListener("click", () => {
    if (confirm("Are You Sure To Delete All Tasks !")) {
        let allTasks = JSON.parse(window.localStorage.getItem("tasks"));
        allTasks = [];
        localStorage.setItem("tasks", JSON.stringify(allTasks));
        removeTasks();
    }
});

// valid priority input
priorityInput.addEventListener("keyup", () => {
    var priorityValue = priorityInput.value;
    validate(priorityValue , addButton , mainAlert);
});

// valid update priority input
updatepriority.addEventListener("keyup", () => {
    var priorityValue = updatepriority.value;
    validate(priorityValue , updateButton , updateAlert);
});

// valid timer input
dateInput.addEventListener("change", () => {
    let date = new Date(dateInput.value).getTime();
    let now = new Date().getTime();
    if (date < now) {
        addButton.setAttribute("disabled", "disabled");
        dateAlert.classList.remove("d-none");
    } else {
        dateAlert.classList.add("d-none");
        addButton.removeAttribute("disabled");
    }
});









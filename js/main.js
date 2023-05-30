// variable need to achieve the task
let tableBody = document.querySelector(".todo .todo-table .table-body");
let addButton = document.querySelector(".todo .input .add");
let nameInput = document.querySelector(".todo .input .task-name");
let priorityInput = document.querySelector(".todo .input .taskPriority");
let updateName = document.querySelector(".container .todo .update-overlay .update .box input[name ='name']");
let updatepriority = document.querySelector(".container .todo .update-overlay .update .box input[name ='prio']");
let updateOwner = document.querySelector(".container .todo .update-overlay .update .box input[name ='owner']");
let overLay = document.querySelector(".container .todo .update-overlay");
let updateButton = document.querySelector(".container .todo .update-overlay .update .button .submit");
let closeButton = document.querySelector(".container .todo .update-overlay .update .button .close");
let select = document.querySelector(".todo .filter .form-select");
let deleteAllButon = document.querySelector(".todo .filter .delete-all");


// show all old tasks from local storage
let allTasks = JSON.parse(window.localStorage.getItem("tasks"));
displayAll(allTasks);

// add new task
addButton.addEventListener("click", () => {
    let status = true;
    let taskName = nameInput.value;
    let taskPriority = priorityInput.value;
    taskPriority = Math.floor(taskPriority);
    

    // valid input
    if (taskName === "" || taskPriority === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Opps',
            text: ` Please Write Task Name And Priority !`
        })
    } else {
        // vaild priority
        if (taskPriority > 3) {
            taskPriority = 3;
        } else if (taskPriority <= 0) {
            taskPriority = 1;
        } 
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
                id : itreator + 1,
                name: taskName,
                priority: taskPriority,
                owner : "Motemed Khaled"
            }
            oldTasks.push(newValue);
            localStorage.setItem("tasks", JSON.stringify(oldTasks));
            display(newValue.name, newValue.priority, newValue.id, newValue.owner);
            nameInput.value = "";
            priorityInput.value = "";
        }
    }
});

// start delete action 
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

// start update action 
document.addEventListener("click", e => {
    if (e.target.classList.contains("edit")) {
        overLay.style.display = "flex"
        let taskId = ++e.target.parentElement.parentElement.firstElementChild.innerText - 1;
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
            newPriority = Math.floor(newPriority);
            // valid input
            if (updateName.value === "" || newPriority === 0 || updateOwner.value === "") {
                Swal.fire({
                    icon: 'error',
                    title: 'Opps',
                    text: ` Please Write Task Name And Priority !`
                });
            } else {
            // vaild priority
            if (newPriority > 3) {
                newPriority = 3;
            } else if (newPriority <= 0) {
                newPriority = 1;
            }
                allTasks.forEach(task => {
                    if (task.id === taskId) {
                        task.name = updateName.value;
                        task.priority = newPriority;
                        task.owner = updateOwner.value;
                    }
                });
                localStorage.setItem("tasks", JSON.stringify(allTasks));
                window.location.reload();
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

// start delete all 
deleteAllButon.addEventListener("click", () => {
    if (confirm("Are You Sure To Delete All Tasks !")) {
    let allTasks = JSON.parse(window.localStorage.getItem("tasks"));
    allTasks = [];
    localStorage.setItem("tasks", JSON.stringify(allTasks));
    removeTasks();
    }
})



// start function ========================================================

// start function to display the new task add 
function display(name, priority , id , owner) {
            // create row in table
            let tableRow = document.createElement("tr");
            let taskId = document.createElement("td");
            let taskName = document.createElement("td");
            let taskOwner = document.createElement("td");
            let taskPriority = document.createElement("td");
            let taskAction = document.createElement("td");
            let editButton = document.createElement("button");
            let deleteButton = document.createElement("button");
            let image = document.createElement("img");
            let span = document.createElement("span");
    
            // add text to table data 
            let taskIdText = document.createTextNode(id);
            let taskNameText = document.createTextNode(name);
            let spanText = document.createTextNode(owner);
            let taskPriorityText = document.createTextNode(priority);
            let editButtonText = document.createTextNode("Edit");
            let deleteButtonText = document.createTextNode("Delete");
    
            // append text to table data (td)
            taskId.appendChild(taskIdText);
            taskName.appendChild(taskNameText);
            span.appendChild(spanText);
            taskPriority.appendChild(taskPriorityText);
            editButton.appendChild(editButtonText);
            deleteButton.appendChild(deleteButtonText);
    
            // add classes and attributes to my element
            image.setAttribute("src", "image/1.jpg");
            image.classList.add("img-fluid", "rounded-circle");
            editButton.classList.add("btn", "edit", "btn-primary");
            deleteButton.classList.add("btn", "delete", "ms-3", "btn-danger");
    
            // append element to taskowner
            taskOwner.appendChild(image);
            taskOwner.appendChild(span)
    
            // append button to task action
            taskAction.appendChild(editButton);
            taskAction.appendChild(deleteButton);
    
            // append table data (td) to table row (tr)
            tableRow.appendChild(taskId);
            tableRow.appendChild(taskName);
            tableRow.appendChild(taskOwner);
            tableRow.appendChild(taskPriority);
            tableRow.appendChild(taskAction);
    
            //append table row to table body
            tableBody.appendChild(tableRow);
}

// start function to display all tas;
function displayAll(allTasks) {
    if (window.localStorage.getItem("tasks")) {
        for (let i = 0; i < allTasks.length; i++) {
            // create row in table
            let tableRow = document.createElement("tr");
            let taskId = document.createElement("td");
            let taskName = document.createElement("td");
            let taskOwner = document.createElement("td");
            let taskPriority = document.createElement("td");
            let taskAction = document.createElement("td");
            let editButton = document.createElement("button");
            let deleteButton = document.createElement("button");
            let image = document.createElement("img");
            let span = document.createElement("span");
    
            // add text to table data 
            let taskIdText = document.createTextNode(i + 1);
            let taskNameText = document.createTextNode(allTasks[i].name);
            let spanText = document.createTextNode(allTasks[i].owner);
            let taskPriorityText = document.createTextNode(allTasks[i].priority);
            let editButtonText = document.createTextNode("Edit");
            let deleteButtonText = document.createTextNode("Delete");
    
            // append text to table data (td)
            taskId.appendChild(taskIdText);
            taskName.appendChild(taskNameText);
            span.appendChild(spanText);
            taskPriority.appendChild(taskPriorityText);
            editButton.appendChild(editButtonText);
            deleteButton.appendChild(deleteButtonText);
    
            // add classes and attributes to my element
            image.setAttribute("src", "image/1.jpg");
            image.classList.add("img-fluid", "rounded-circle");
            editButton.classList.add("btn", "edit", "btn-primary");
            deleteButton.classList.add("btn", "delete", "ms-3", "btn-danger");
    
            // append element to taskowner
            taskOwner.appendChild(image);
            taskOwner.appendChild(span)
    
            // append button to task action
            taskAction.appendChild(editButton);
            taskAction.appendChild(deleteButton);
    
            // append table data (td) to table row (tr)
            tableRow.appendChild(taskId);
            tableRow.appendChild(taskName);
            tableRow.appendChild(taskOwner);
            tableRow.appendChild(taskPriority);
            tableRow.appendChild(taskAction);
    
            //append table row to table body
            tableBody.appendChild(tableRow);
        }
    }
} 

// update id number when delete post

function updateId(allTasks) {
    let id = 1;
    allTasks.forEach(task => {
        task.id = id;
        id++;
    });
    removeTasks();
    localStorage.setItem("tasks", JSON.stringify(allTasks));
    displayAll(allTasks);
}

// remove all tasks to update any where

function removeTasks() {
    let allTr = document.querySelectorAll(".todo .todo-table .table-body tr");
    allTr.forEach(child => {
        child.remove()
    });
}
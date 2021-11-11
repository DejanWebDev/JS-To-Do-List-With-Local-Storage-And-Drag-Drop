const inputBox = document.querySelector(".inputField input");
const addBtn = document.querySelector(".inputField button");
const todoList = document.querySelector(".todoList");
const deleteAllBtn = document.querySelector(".footer button");

inputBox.onkeyup = () => {
    let userData = inputBox.value; //taking user input
    if(userData.trim() != 0) //if the input isn't only spaces
    {
        addBtn.classList.add("active"); //activating the add button
    }
    else
    {
        addBtn.classList.remove("active"); //deactivating the add button
    }
}

showTasks();

addBtn.addEventListener("click", () => {
    let userData = inputBox.value; 
    let getLocalStorage = localStorage.getItem("New Todo"); //getting local storage

    if(getLocalStorage == null)
    {
        listArr = []; //creating empty array
    }
    else
    {
        listArr = JSON.parse(getLocalStorage); //converting JSON string to JS object
    }

    if(userData == "")
    {
        return;
    }

    listArr.push(userData);
    localStorage.setItem("New Todo", JSON.stringify(listArr)); //converting JS object to JSON string
    showTasks();
    addBtn.classList.remove("active");
});

inputBox.addEventListener("keyup", (e) => {

    if(e.key == "Enter") //adding the functionality of add button to Enter key press
    {
        addBtn.click();
    }
});

function showTasks()
{
    let getLocalStorage = localStorage.getItem("New Todo");
    if(getLocalStorage == null)
    {
        listArr = [];
    }
    else
    {
        listArr = JSON.parse(getLocalStorage);
    }

    const pendingTasks = document.querySelector(".pendingTasks");
    pendingTasks.textContent = listArr.length; //passing length value of array to pendingTasks

    if(listArr.length > 0) //if there are any tasks active, we activate the delete all button
    {
        deleteAllBtn.classList.add("active");
    }
    else
    {
        deleteAllBtn.classList.remove("active");
    }

    let newLiTag = "";
    listArr.forEach((element, index) => {
        //adding li element and all child elements needed
        newLiTag += `<li draggable = "true">${element}<span class="icon" onclick="deleteTask(${index})"><i class="fas fa-trash"></i></span></li>`;
    
    });

    todoList.innerHTML = newLiTag.trim(); //converts the string newLiTag that we added before to Node

    todoList.childNodes.forEach(draggable => {
        draggable.addEventListener("dragstart", () => {
            draggable.classList.add("dragging"); //we add the draggable class to list element that is being dragged so we can later make the drag functionality

            document.querySelectorAll("li span").forEach(el => { //removing the delete button when dragging a task because :hover keeps activating it
                el.style.visibility = "hidden";
            })
        })
    
        draggable.addEventListener("dragend", () => {
            draggable.classList.remove("dragging"); //removing the dragging class when we complete the dragging

            document.querySelectorAll("li span").forEach(el => { //adding the delete button back after we finished dragging
                el.style.visibility = "visible";
            })
        })
    })

    inputBox.value = ""; //when we add the task, text from the input field dissapears
}

function deleteTask(index)
{
    let getLocalStorage = localStorage.getItem("New Todo");
    listArr = JSON.parse(getLocalStorage);
    listArr.splice(index, 1); //deleting the individual task by index
    localStorage.setItem("New Todo", JSON.stringify(listArr)); //we update local storage after deleting the task

    showTasks();
}

deleteAllBtn.onclick = () => {
    listArr = [];
    localStorage.setItem("New Todo", JSON.stringify(listArr)); //updating local storage after we delete all tasks
    showTasks();
}


//drag functionality ↓

todoList.addEventListener("dragover", e => {
    e.preventDefault(); //to enable dropping(getting rid of the not allowed cursor style), because it is disabled by default
    const afterElement = getDragAfterElements(todoList, e.clientY);
    const drag = document.querySelector(".dragging");

    if(afterElement == null) //inserting task before and after other tasks
    {
        todoList.appendChild(drag);
    }
    else
    {
        todoList.insertBefore(drag, afterElement);
    }
});

function getDragAfterElements(todoList, y)
{
    const dragArr = [...todoList.querySelectorAll("li:not(.dragging)")]; //creating an array of all elements except the one we are dragging

    return dragArr.reduce((closest, child) => { //determines which element is after the cursor based on Y position
        const rect = child.getBoundingClientRect();
        const offset = y - rect.top - rect.height / 2;
        if(offset < 0 && offset > closest.offset)
        {
            return { offset: offset, element: child }
        }
        else
        {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element
}


//Parent element to store cards
const taskContainer=document.querySelector(".task__container"); //to directly access html element instead of array as in getElementByClassName

//Global Store
let globalStore=[];

const newCard=({id,imageUrl,taskTitle,taskType,taskDescription,})=>`<div class="col-md-4 id=${id}">
<div class="card">
    <div class="card-header d-flex justify-content-end gap-1">
        <button type="button" class="btn btn-outline-success" id=${id} onclick="editCard.apply(this,arguments)"><i class="fa-solid fa-pencil" id=${id} onclick="editCard.apply(this,arguments)"></i></button>
        <button type="button" id=${id} class="btn btn-outline-danger" onclick="deleteCard.apply(this,arguments)"><i class="fa-solid fa-trash" id=${id} onclick="deleteCard.apply(this,arguments)"></i></button>
    </div>
    <img src=${imageUrl} class="img-fluid" alt="...">
    <div class="card-body">
        
        <h5 class="card-title">${taskTitle}</h5>
        <p class="card-text">${taskDescription}</p>
        <span class="badge bg-primary">${taskType}</span>
        </div>
    <div class="card-footer text-muted">
        <button type="button" id=${id} class="btn btn-outline-primary float-end">Open Task</button>
    </div>
  </div>
</div>`


const updateLocalStorage=()=>{
    localStorage.setItem("TaskY",JSON.stringify({cards:globalStore}));
}
const loadInitialTaskCards=()=>{
    //access localStorage and //convert stringified object to object
    const getInitialData=localStorage.TaskY;
    if(!getInitialData) return;  //if TaksY is not present it gives null..so it returns without performing anything.
    
    const {cards}=JSON.parse(getInitialData); //format: {cards: ({...})}
    //map around the array to generate html card and inject it to the card.
    cards.map((cardObject)=>{
            const createNewCard=newCard(cardObject);
            taskContainer.insertAdjacentHTML("beforeend",createNewCard);
            globalStore.push(cardObject);
    })
}

const saveChanges=()=>{
    const taskData={
        id:`${Date.now()}`,  //unique number for card id
        imageUrl:document.getElementById("imageurl").value, //for getting value inside  element
        taskTitle:document.getElementById("tasktitle").value,
        taskType:document.getElementById("tasktype").value,
        taskDescription:document.getElementById("taskdescription").value,
    };
    const createNewCard=newCard(taskData);
    taskContainer.insertAdjacentHTML("beforeend",createNewCard);
    globalStore.push(taskData);
    //add to localStorage
    updateLocalStorage(); //TaskY is a key name 
    //localStorage stires many data..to identify our data we usse key name.wwe cant directly store array..so we create object and assign array to it.

    //Application programming interface
};

const deleteCard=(event)=>{ //event returns html code of the clicked card in this case
    //get id
    event=window.event;
    const targetID=event.target.id;
    const tagName=event.target.tagName; //BUTTON if its button and ICON if its icon
    //search the global store remove the object which MATCHES with the id
    globalStore=globalStore.filter((cardObject)=>cardObject.id!==targetID);
    //access DOM to remove that
    
    updateLocalStorage();  //deleting the id in localStorage so it wont appear again after refereshing
    if(tagName==="BUTTON"){
        //travels upto taskcontainer
        return taskContainer.removeChild(
            event.target.parentNode.parentNode.parentNode //col-lg-4
        );
    }
    return taskContainer.removeChild(
        event.target.parentNode.parentNode.parentNode.parentNode);


}

const editCard=(event)=>{
    //id
    event=window.event;
    const targetID=event.target.id;
    const tagName=event.target.tagName;
    let parentElement;
    if(tagName==="BUTTON"){
        parentElement=event.target.parentNode.parentNode;
    }
    else{
        parentElement=event.target.parentNode.parentNode.parentNode;
    }
    let taskTitle=parentElement.childNodes[5].childNodes[1];
    let taskDescription=parentElement.childNodes[5].childNodes[3];
    let taskType=parentElement.childNodes[5].childNodes[5];
    let submitButton=parentElement.childNodes[7].childNodes[1];
    taskTitle.setAttribute("contenteditable","true");
    taskDescription.setAttribute("contenteditable","true");
    taskType.setAttribute("contenteditable","true");
    submitButton.setAttribute("onclick","saveEditdata.apply(this,arguments)");
    submitButton.innerHTML="Save Changes";
};
const saveEditdata=(event)=>{
    event=window.event;
    const targetID=event.target.id;
    const tagName=event.target.tagName;
    let parentElement;
    if(tagName==="BUTTON"){
        parentElement=event.target.parentNode.parentNode;
    }
    else{
        parentElement=event.target.parentNode.parentNode.parentNode;
    }
    let taskTitle=parentElement.childNodes[5].childNodes[1];
    let taskDescription=parentElement.childNodes[5].childNodes[3];
    let taskType=parentElement.childNodes[5].childNodes[5];
    let submitButton=parentElement.childNodes[7].childNodes[1];


    const updatedData={
        taskTitle:taskTitle.innerHTML,
        taskDescription:taskDescription.innerHTML,
        taskType:taskType.innerHTML,
    };
    globalStore=globalStore.map((task)=>{
        if(task.id==targetID){
            return{
                id:task.id,
                imageUrl:task.imageUrl,
                taskTitle:updatedData.taskTitle,
                taskDescription:updatedData.taskDescription,
                taskType:updatedData.taskType,
            }
        }
        return task;  //IF id does not match then it returns old values.if we dont mention it then it does not consider those indexes or values.
    })
    updateLocalStorage();
    taskTitle.setAttribute("contenteditable","false");
    taskDescription.setAttribute("contenteditable","false");
    taskType.setAttribute("contenteditable","false");
    submitButton.removeAttribute("onclick");
    submitButton.innerHTML="Open Task";
}
//parent object of browser->window
//parent object of html->DOM->document

//Issues previously
//The modal was not closing upon adding new card
//the cards were deleted after refresh ->local storage(5MB)

//features
//delete modal feature
//open task
//edit task
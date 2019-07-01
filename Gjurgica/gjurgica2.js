//#region variables
let gDataProjects;
let gDataIssues;
let gDataUsers;
let loggedUserId = JSON.parse(localStorage.getItem("loggedUser"));
let watchedIssue;
//#endregion
//#region inputs
let gInputs = {
    gContainerOne: document.getElementById("g-container1"),
    gContainerTwo: document.querySelector(".g-container2"),
    gFirstDiv: document.querySelector(".g-first"),
    gSecondDiv: document.querySelector(".g-second"),
    gThirdDiv: document.querySelector(".g-third"),
    gFourth: document.querySelector(".g-fourth")
}
//#endregion
gInputs.gContainerTwo.style.display = "block";
//#region populate project div 
function gPopulateStaticProjectPart(element){
    return element.innerHTML += `
    <div class="g-projects g-header">Projects</div>
    `
}
function gPopulateProjects(element,data){
    element.innerHTML += `
            <div class="g-projects-box" id="${data.id}">${data.projectName}</div> 
    `
    };
function gGenerateTable(data){
    gPopulateStaticProjectPart(gInputs.gFirstDiv);
        for(let weth of data){
            gPopulateProjects(gInputs.gFirstDiv,weth);
        }
    }
//#endregion
//#region populate wathed issue div
function gPopulateStaticIssueParts(element){
return element.innerHTML += 
`
<div class="g-issues">
        <div class="g-header">Watched Issues</div>
        <div class="g-watched-header g-watched-header-title">
                <div>Key</div>
                <div>Summary</div>
                <div>Status</div>
        </div>
</div>
`
}
function gPopulateIssuesOneRow(element,data){

    element.innerHTML += `
        <div class="g-watched-header g-watched-header-data" id="${data.project}">
                <div id="${data.project}" title="${data.id}">${data.id}</div>
                <div id="${data.project}" title="${data.id}">${data.summary}</div>
                <div id="${data.project}" title="${data.id}">${data.status}</div>
        </div>
    `
}
function gGenerateTable1(data,users){
    //find logged user
    let findUser = users.find(user => user.id === loggedUserId);
    gPopulateStaticIssueParts(gInputs.gSecondDiv);
    //find array of watched issues
    if(findUser.watched_issues.length !== 0){
        for(var issue of findUser.watched_issues){
            for(let weth of data){
                if(weth.id === issue){
                    gPopulateIssuesOneRow(gInputs.gSecondDiv,weth);
                }
            }
           
    }
}

}
//#endregion
//#region populate assigne div 
function gPopulateStaticAssignePart(element,findIssue,findUser){
    //find user
    let user = findUser.find(user => user.id === loggedUserId);
    element.innerHTML += 
    `
    <div class="g-assign">
    <div class="g-header">Assigned to Me</div>
</div>
    `
    //find if user have assigned issues
    if(user.assigned_issues.length !== 0){
        let filterArr = findIssue.filter(project => user.assigned_issues.includes(project.id));
        for(var project of filterArr){
            element.innerHTML += 
                `
                <div class="g-assign-body" id="${project.project}" title="${project.id}">${project.summary}</div>
                `
        }
    }else{
        element.innerHTML +=
        `
                <div class="g-assign-body">You currently have no Issues assigned to you.Enjoy
                        your day.</div>
        `
    }
}
//#endregion
//#region populate header section
function gPopulateHeaderSection(findIssue,findProject){
    gInputs.gContainerTwo.innerHTML += `
    <header class="g-project-header">                  
    <h3 id="g-selected-header2">${findProject.projectName}</h3>
    <h1 id="g-selected-header1">${findIssue.summary}</h1>
    </header>
    `
}
//#endregion
//#region populate description table
function gPopulateDescriptionSection(findIssue){
    gInputs.gContainerTwo.innerHTML +=
    `
        <table class="g-table">
            <tr>
                <td>Type: </td>
                <td><i class="fas fa-bug"></i> ${findIssue.issue_type}</td>
            </tr>
            <tr>
                <td>Priority: </td>
                <td><i class="fas fa-ban"></i> ${findIssue.priority}</td>
            </tr>
            <tr>
                <td>Affects Version/s: </td>
                <td>${findIssue.affectedVersion}</td>
            </tr>
            <tr>
                <td>Component/s: </td>
                <td>${findIssue.component}</td>
            </tr>
            <tr>
                <td>Status: </td>
                <td><input type="button" value="${findIssue.status}" class="g-dropbtn g-dropbtn1"></td>
            </tr>
            <tr>
                <td>Fix Version: </td>
                <td>${findIssue.fixVersion}</td>
            </tr>
        </table>
    `
}
//#endregion
//#region populate people table
function gPopulatePeopleSection(findReporter,findUser,findIssue,user,issues){
    let watchersCount = findIssue.watchers.length;
    //user who is loged 
    let assigneUser = user.find(userId => userId.id === loggedUserId);
    //user who is assigne in the moment when logged user go to the iisue page
    let assignedUser = findUser.firstName + " " +  findUser.lastName;
    gInputs.gContainerTwo.innerHTML +=
    `
    <table class="g-table">
        <tr>
            <td></td>
            <td><a class="g-link" id="assigne">Assigne to me</a></td>
        </tr>
        <tr>
            <td>Assignee: </td>
            <td id="full-name"><i class="fas fa-check-double"></i> ${assignedUser}</td>
        </tr>
        <tr>
            <td>Reporter:</td>
            <td id="reporter"><i class="fas fa-user"></i> ${findReporter.firstName} ${findReporter.lastName}</td>
        </tr>
        <tr>
            <td>Watchers:</td>
            <td><input type="button" value="${watchersCount}" class="g-dropbtn g-dropbtn2"> <a class="g-link" id="stop-watch"> Stop watching this
            issue</a></td>
        </tr>
        </table>
    `
    gInputs.gContainerTwo.addEventListener("click",function(e){
        if(e.target.id === "assigne"){
            assigneToMe(user,findIssue,findUser,issues);
            document.getElementById("assigne").disabled = true;
            document.getElementById("assigne").style.visibility="hidden";
            assignedUser = assigneUser.firstName + " " + assigneUser.lastName;
            document.getElementById("full-name").innerHTML = `
            <i class="fas fa-check-double"></i> ${assignedUser}
            `;
        }else if(e.target.id === "stop-watch"){
            stopWatchingIssue(user,findIssue,issues);
            document.querySelector(".g-dropbtn2").value = `${watchersCount -1}`;
            document.getElementById("stop-watch").disabled = true;
            document.getElementById("stop-watch").style.visibility="hidden";
        }
    });
};
//#endregion
//#region assigne method
function assigneToMe(user,issue,findUser,issues){
    let assigneUser = user.find(userId => userId.id === loggedUserId);
    //find index of issue in  the user assignedIssue array who was assigned 
    let index = findUser.assigned_issues.indexOf(issue.id);
    //find index of user who was assigned
    let indexOfExAssignedUser = user.indexOf(findUser);
    let indexOfLoggedUser = user.indexOf(assigneUser);
    let indexOfIssue = issues.indexOf(issue);
    //find loged user
    if(!(assigneUser.assigned_issues.includes(issue.id))){
        assigneUser.assigned_issues.push(issue.id);
        findUser.assigned_issues.splice(index,1);
        issue.assignee = assigneUser.id;
        updateUsers(findUser,user,indexOfExAssignedUser);
        updateUsers(assigneUser,user,indexOfLoggedUser);
        updateIssue(issue,issues,indexOfIssue);
    }
}
//#endregion
//#region update issue method
function updateIssue(issue,issues,indexOfIssue){
    let updateIssue = ({
        "affectedVersion": issue.affectedVersion,
        "assignee": issue.assignee,
        "comments": issue.comments,
        "component": issue.component,
        "createDate": issue.createDate,
        "description": issue.description,
        "dueDate": issue.dueDate,
        "fixVersion": issue.fixVersion,
        "id": issue.id,
        "issue_type": issue.issue_type,
        "organization": issue.organization,
        "priority": issue.priority,
        "project": issue.project,
        "reporter": issue.reporter,
        "status": issue.status,
        "summary": issue.summary,
        "watchers": issue.watchers
    });
    issues.splice(indexOfIssue,1,updateIssue);
    localStorage.setItem("issues", JSON.stringify(issues));
}
//#endregion
//#region updateUsers method
function updateUsers(findUser,user,indexOfExAssignedUser){
    let updateExAssignedUser = ({
        "assigned_issues": findUser.assigned_issues,
        "email": findUser.email,
        "firstName": findUser.firstName,
        "id": findUser.id,
        "image": findUser.image,
        "language": findUser.language,
        "lastName": findUser.lastName,
        "password": findUser.password,
        "role": findUser.role,
        "status": findUser.status,
        "userName": findUser.userName,
        "watched_issues": findUser.watched_issues
    });
    user.splice(indexOfExAssignedUser,1,updateExAssignedUser);
    localStorage.setItem("users", JSON.stringify(user));
}
//#endregion
//#region stop watch method
function stopWatchingIssue(user,issue,issues){
    //find logged user
    let assigneUser = user.find(userId => userId.id === loggedUserId);
    let indexOfLoggedUser = user.indexOf(assigneUser);
    let indexOfIssue = issues.indexOf(issue);
    //find index of watched issue
    let index = assigneUser.watched_issues.indexOf(issue.id);
    //find index of user in array of watched issue
    let indexOfWatcher = issue.watchers.indexOf(assigneUser.id)
    if(assigneUser.watched_issues.includes(issue.id)){
        assigneUser.watched_issues.splice(index,1);
        issue.watchers.splice(indexOfWatcher,1);
        updateUsers(assigneUser,user,indexOfLoggedUser);
        updateIssue(issue,issues,indexOfIssue)
    }
}
//#endregion
//#region show description
function gPopulateDescription(findIssue){
    gInputs.gContainerTwo.innerHTML +=
    `
    <div class="g-project-description">
            <h3 class="g-header-description">Description</h3>
            <div class="g-body-description">${findIssue.description}</div>
    </div>
    `
}
//#endregion
//#region populate dates
function gPopulateDates(findIssue,findProject){
    gInputs.gContainerTwo.innerHTML +=
    `
    <div class="g-project-details">
            <table class="g-table">
            <tr>
                <td>Created Date: </td>
                <td><em>${findIssue.createDate}</em></td>
            </tr>
            <tr>
                <td>Due Date:</td>
                <td><em>${findProject.dueDate}</em></td>
            </tr>
        </table>
    <div class="g-dates">
    `
}
//#endregion
//#region comment area
function gPopulateCommentArea(findIssue,findUser,issues){
    let findCommentator = findIssue.comments;
    let index = issues.indexOf(findIssue);
    let userName = findUser.find(user => user.id === loggedUserId);
    let gCommentDiv = document.createElement("div");
    gInputs.gContainerTwo.appendChild(gCommentDiv);
    gCommentDiv.setAttribute("class","g-comment-part");
    let gHeaderThree = document.createElement("h3");
    gCommentDiv.appendChild(gHeaderThree);
    gHeaderThree.setAttribute("class","g-header-description");
    gHeaderThree.innerHTML = "Comments";
    let gTextArea = document.createElement("div");
    gCommentDiv.appendChild(gTextArea);
    gTextArea.setAttribute("class","g-text-area");
    let gCommentArea = document.createElement("div");
    gInputs.gContainerTwo.appendChild(gCommentArea);
    let gParagraph = document.createElement("p");
    gCommentArea.appendChild(gParagraph);
    gParagraph.setAttribute("class","g-paragraph");
    gParagraph.innerHTML += `<img src="${userName.image}"/> ${userName.firstName} ${userName.lastName}`
    let gTextBtn = document.createElement("input");
    gParagraph.appendChild(gTextBtn);
    gTextBtn.setAttribute("class","g-text-btn");
    let gSubmitBtn = document.createElement("button");
    gParagraph.appendChild(gSubmitBtn);
    gSubmitBtn.setAttribute("class","g-dropbtn g-dropbtn1");
    gSubmitBtn.innerHTML = "Comment";
    if(findCommentator!==null){
        for(var comment of findCommentator){
            //find id of commentator in users json to get full name
            let findUserId = findUser.filter(id => id.id === comment.userID);
            for(var id of findUserId){
                gTextArea.innerHTML += `
                <p class="g-paragraph"><i class="fas fa-user"></i> <span class="g-comments-text"><span class="g-full-name"> ${id.firstName} ${id.lastName} :</span> ${comment.c}</span></p>
                `
            }
        }
    } 
    gSubmitBtn.addEventListener("click",function(){
        let gComment = gTextBtn.value;
        let user = gDataUsers.find(user => user.id === loggedUserId);
        if(gComment !== "" && gComment !== null){
            gTextArea.innerHTML += `
            <p class="g-paragraph"><img src="${user.image}"/> <span class="g-comments-text"><span class="g-full-name">${user.firstName} ${user.lastName}:</span> ${gComment}</span></p>
            `
            findCommentator.push({UserID: user.id,c: gComment});
            let updateIssue = ({
                "affectedVersion": findIssue.affectedVersion,
                "assignee": findIssue.assignee,
                "comments": findCommentator,
                "component": findIssue.component,
                "createDate": findIssue.createDate,
                "description": findIssue.description,
                "dueDate": findIssue.dueDate,
                "fixVersion": findIssue.fixVersion,
                "id": findIssue.id,
                "issue_type": findIssue.issue_type,
                "organization": findIssue.organization,
                "priority": findIssue.priority,
                "project": findIssue.project,
                "reporter": findIssue.reporter,
                "status": findIssue.status,
                "summary": findIssue.summary,
                "watchers": findIssue.watchers
            });
            issues.splice(index,1,updateIssue);
            localStorage.setItem("issues", JSON.stringify(issues));
        }
        gTextBtn.value = "";
        
    });   
};
//#endregion
//#region firstDiv event
gInputs.gFirstDiv.addEventListener("click",function(e){
    console.log(e.target);
    if(e.target.id !== undefined && e.target.id !== null && e.target.id !== "" && e.target.id.length !== 0){
        gInputs.gContainerOne.style.display = "none";
        let findProject = gDataProjects.find(project => project.id === e.target.id);
        localStorage.setItem("viewProject", JSON.stringify(findProject.id));
        window.open("../Bobi/index.html", "_self");
    }
});
//#endregion
//#region secondDiv event
gInputs.gSecondDiv.addEventListener("click",function(e){
    if(e.target.id !== undefined && e.target.id !== null && e.target.id !== "" && e.target.id.length !== 0){
        gInputs.gContainerOne.style.display = "none";
        gInputs.gContainerTwo.style.display = "block";
        populateIssuePage(e.target);
    }
});
//#endregion
//#region populate issue page
function populateIssuePage(e){
    let findIssue = gDataIssues.filter(issue => issue.project === e.id)
        .find(issue => issue.id === e.title);
        console.log(findIssue);
        let findProject = gDataProjects.find(project => project.id === e.id);
        console.log(findProject);
        let findUser = gDataUsers.find(user => user.id === findIssue.assignee);
        console.log(findUser);
        let findReporter = gDataUsers.find(project => project.id === findIssue.reporter)
        console.log(findReporter)
        gPopulateHeaderSection(findIssue,findProject);
        gPopulateDescriptionSection(findIssue);
        gPopulatePeopleSection(findReporter,findUser,findIssue,gDataUsers,gDataIssues);
        gPopulateDescription(findIssue);
        gPopulateDates(findIssue,findProject);
        gPopulateCommentArea(findIssue,gDataUsers,gDataIssues);
}
//#endregion
//#region fetch
async function gGetData() {
    try {
        let result = await fetch("https://raw.githubusercontent.com/pm-project-frontend/jsons/master/projects.json");
        let result1 = await fetch("https://raw.githubusercontent.com/pm-project-frontend/jsons/master/issues.json");
        let result2 = await fetch("https://raw.githubusercontent.com/pm-project-frontend/jsons/master/users.json");
        let issues = await result1.json();
        let projects = await result.json();
        let users = await result2.json();
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("projects", JSON.stringify(projects));
        localStorage.setItem("issues", JSON.stringify(issues));
        getResults();
         gGenerateTable(gDataProjects);
         gGenerateTable1(gDataIssues,gDataUsers);
         gPopulateStaticAssignePart(gInputs.gSecondDiv,gDataIssues,gDataUsers);
    } catch (error) {
        throw new Error("Error!!!!")
    }
}
//#endregion
function getResults() {
    gDataUsers = JSON.parse(localStorage.getItem("users"));
    gDataProjects = JSON.parse(localStorage.getItem("projects"));
    gDataIssues = JSON.parse(localStorage.getItem("issues"));
  }
gGetData()
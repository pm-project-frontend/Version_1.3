const createBtn = document.getElementById("create");
const form = document.getElementById("form");
const cancelBtn = document.getElementById("cancel");
const submitBtn = document.getElementById("submit");
const background = document.getElementById("bg-div");
const dashboard = document.getElementsByClassName("topnav")[0];
const projectDropDown1 = document.getElementById("projectsnb");
const projectDropDown2 = document.getElementById("selection0");
const issuesDropDown = document.getElementById("issuesnb");
const issuesDropDown2 = document.getElementById("issuesnb2");
const assigneeDropDown = document.getElementById("selection4");
const date = document.getElementById("date");
const userDropDownMenu = document.getElementById("userDropDown");
const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

let listOfAllIssues;

let usersAssignedIssues;
let usersWatchedIssues;

let issuesLength;
let minDate;
let todaysDate = new Date();

date.setAttribute("min", setMinDate());

function setMinDate() {
    if (todaysDate.getMonth().toString().length < 2 && todaysDate.getMonth() !== 9) {
        minDate = todaysDate.getFullYear() + "-0" + (todaysDate.getMonth() + 1);
        return setMinDay(minDate);
    } else {
        minDate = todaysDate.getFullYear() + "-" + (todaysDate.getMonth() + 1);
        return setMinDay(minDate);
    }
}

function setMinDay(minDate) {
    if (todaysDate.getDate() < 10) {
        return minDate += "-0" + todaysDate.getDate()
    } else {
        return minDate += "-" + todaysDate.getDate().toString();
    }
}

getProjects();

async function getProjects() {
    let response = await fetch("https://raw.githubusercontent.com/pm-project-frontend/jsons/master/projects.json");
    let data = await response.json();
    displayProjects(data);
}

function displayProjects(data) {
    let temp1 = "";
    let temp2 = `<option value="Empty">Select project</option>`;
    for (const project of data) {
        temp1 += `<a href="#">${project.projectName}</a>`
        temp2 += `<option value=${project.id}>${project.projectName}</option>`
    }

    projectDropDown1.innerHTML = temp1;
    projectDropDown2.innerHTML = temp2;
}

getUserInfo();

async function getUserInfo() {
    let response = await fetch("https://raw.githubusercontent.com/pm-project-frontend/jsons/master/users.json");
    let data = await response.json();
    usersIssues(data);
    displayUsers(data);
    fillUsersMenu(data);
    displayIssueMenus();

}

function usersIssues(data) {
    for (const user of data) {
        if (user.id === loggedUserId) {
            usersAssignedIssues = user.assigned_issues;
            usersWatchedIssues = user.watched_issues;
        }
    }
}

function displayUsers(data) {
    let temp = `<option value="Empty">Select user</option>`;
    for (const user of data) {
        temp += `<option value=${user.id}>${user.firstName} ${user.lastName}</option>`;
    }

    
    assigneeDropDown.innerHTML = temp;
}

function fillUsersMenu(data) {
    let temp = "";
    let newListItem = document.createElement("A");
    for (const user of data) {
        if (user.id === loggedUserId) {
            temp = `${user.firstName} ${user.lastName}`;
        }
    }

    let text = document.createTextNode(temp);
    newListItem.appendChild(text);
    userDropDownMenu.insertBefore(newListItem, userDropDownMenu.childNodes[0]);
}

async function displayIssueMenus() {
    let response = await fetch("https://raw.githubusercontent.com/pm-project-frontend/jsons/master/issues.json");
    let data = await response.json();
    loadListOfIssues(data);
    displayIssues(data, usersAssignedIssues);
    displayIssues(data, usersWatchedIssues);
}

function loadListOfIssues(data){
    listOfAllIssues = data;
    console.log(listOfAllIssues);
    
}

function displayIssues(data, arr) {
    issuesLength = data.length;
    let temp = "";
    for (let index = 0; index < arr.length; index++) {
        for (const issue of data) {
            if (issue.id === arr[index]) {
                temp += `<a href="#">${issue.summary}</a>`
            }
        }

    }

    if (temp === "") {
        temp = `<a href="#" style="pointer-events: none;">No issues</a>`
    }

    whichDropDownIssuesMenu(arr, temp);
}

function whichDropDownIssuesMenu(arr, temp) {
    if (arr === usersAssignedIssues) {

        return issuesDropDown.innerHTML = temp;
    } else {
        return issuesDropDown2.innerHTML = temp;
    }
}

createBtn.addEventListener("click", () => {
    form.style.display = "block";
    background.style.filter = "blur(7px)";
    dashboard.style.filter = "blur(7px)";

});

cancelBtn.addEventListener("click", () => {
    form.style.display = "none";
    background.style.filter = "";
    dashboard.style.filter = "";
});

submitBtn.addEventListener("click", (e) => {
    
    e.preventDefault();

    const summary = document.getElementById("summary").value;
    const description = document.getElementById("description").value;
    const components = document.getElementById("components").value;
    const affectsVersion = document.getElementById("affects_version").value;
    const fixVersion = document.getElementById("fix_version").value;
    const assignee = document.getElementById("selection4").value;
    console.log(assignee);
    
    let properties = ["project", "issue_type", "organization", "priority"];
    let issue = new Issue();

    for (let i = 0; i < 4; i++) {
        if (document.getElementById(`selection${i}`).value === "Empty" || document.getElementById(`selection${i}`).value === NaN) {
            alert("Don't leave empty selection");
            return;
        }
    }

    if (summary === "" || description === "" || components === "" || affectsVersion === "" || fixVersion === "") {
        alert("Don't leave empty fields.");
        return;
    } else {

        for (let i = 0; i < 4; i++) {
            issue[properties[i]] = document.getElementById(`selection${i}`).value;
        }
        
        issue["reporter"] = loggedUserId;
        issue["watchers"].push(loggedUserId);
        let dueDate = new Date(date.value);
        issue["dueDate"] = dueDate.getDate() + "/" + (dueDate.getMonth() + 1) + "/" + dueDate.getFullYear();
        issue["summary"] = summary;
        issue["description"] = description;
        issue["component"] = components;
        issue["affectedVersion"] = affectsVersion;
        issue["fixVersion"] = fixVersion;
        issue["assignee"] = Number(assignee);
        let createDate = new Date();
        issue["createDate"] = createDate.getDate() + "/" + (createDate.getMonth() + 1) + "/" + createDate.getFullYear();
        let id = issuesLength + 1
        issue["id"] = id.toString();

        document.getElementById("reset").click();

        listOfAllIssues.push({
            id: issue.id,
            project: issue.project,
            issue_type: issue.issue_type,
            reporter: issue.reporter,
            organization: issue.organization,
            summary: issue.summary,
            priority: issue.priority,
            dueDate: issue.dueDate,
            component: issue.component,
            affectedVersion: issue.affectedVersion,
            fixVersion: issue.fixVersion,
            assignee: issue.assignee,
            description: issue.description,
            createDate: issue.createDate,
            comments: issue.comments,
            status: issue.status,
            watchers: issue.watchers,
        });

        console.log(issue);
        
        console.log(listOfAllIssues);
        
    }

});
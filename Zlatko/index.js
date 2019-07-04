//#region defining object arrays
let loggedUser = "";
let zResultIssue = [];
let zResultProject = [];
let zResultUser = [];
function getResults() {
    zResultIssue = JSON.parse(localStorage.getItem("issues"));
    zResultProject = JSON.parse(localStorage.getItem("projects"));
    zResultUser = JSON.parse(localStorage.getItem("users"));
}
//#endregion
//#region defining main buttons
let btnListUsers = document.getElementById("listUsers");
let btnRegUser = document.getElementById("createUser");
let btnListProjects = document.getElementById("listProjects");
let btnCreateProject = document.getElementById("createProject");
let btnSubmitProject = document.getElementById("submitProject");
let btnCreateUser = document.getElementById("regUser");
//#endregion
//#region Show/Hide status of divs
document.getElementById("zCreateUser").style.display = "none";
document.getElementById("zCreateProject").style.display = "none";
btnRegUser.addEventListener("click", function () {
    document.getElementById("zCreateUser").style.display = "block";
    document.getElementById("zCreateProject").style.display = "none";
    document.getElementById("zListDiv").innerHTML = "";
})
btnCreateProject.addEventListener("click", function () {
    document.getElementById("zCreateProject").style.display = "block";
    document.getElementById("zCreateUser").style.display = "none";
    document.getElementById("zListDiv").innerHTML = "";
})
//#endregion
//#region async api call
async function importJsons() {
    try {
        let projectResult = await fetch("https://pm-project-frontend.github.io/jsons/projects.json");
        let issueResult = await fetch("https://pm-project-frontend.github.io/jsons/issues.json");
        let userResult = await fetch("https://pm-project-frontend.github.io/jsons/users.json");
        let zForLocalProjects = await projectResult.json();
        let zForLocalIssues = await issueResult.json();
        let zForLocalUsers = await userResult.json();
        localStorage.setItem("users", JSON.stringify(zForLocalUsers));
        localStorage.setItem("projects", JSON.stringify(zForLocalProjects));
        localStorage.setItem("issues", JSON.stringify(zForLocalIssues));
        getResults();
        giveBasicInfo();
    } catch (error) {
        throw new Error("There has been an error receiving the files. Please try again later.")
    }
}
function checkUp() {
    if (localStorage.getItem("users") != null) {
        console.log("Tuka se");
        getResults();
        giveBasicInfo();
    } else {
        importJsons();
    }
}
checkUp();
//#endregion
//#region Print Default Info
function giveBasicInfo() {
    document.getElementById("numOfRegUsers").innerHTML = `Number of registered users: ${zResultUser.length}`
    document.getElementById("numOfRegProjects").innerHTML = `Number of registered projects: ${zResultProject.length}`
    document.getElementById("numOfRegIssues").innerHTML = `Number of registered issues: ${zResultIssue.length}`
}
//#endregion
//#region List all Users Button event listener
btnListUsers.addEventListener("click", function () {
    checkUp();
    let mainElem = document.getElementById("zListDiv");
    mainElem.innerHTML = "";
    document.getElementById("zCreateUser").style.display = "none";
    document.getElementById("zCreateProject").style.display = "none";
    for (const elem of zResultUser) {
        mainElem.innerHTML += `
        <div class="card" style="width: 20rem;">
        <div class="card-body">
        <h5 class="card-title" id=${elem.id}>${elem.firstName} ${elem.lastName}</h5>
        <p class="text-secondary" id=${elem.id}class="card-text" > ${elem.role} </p><br>
        <input type="button" class="btn btn-danger" name="deleteUser" id="${elem.id}" value="Delete">
        <input type="button" class="btn btn-secondary" name="editUser" id="${elem.id}" value="Edit">
        <input type="button" class="btn btn-secondary" name="viewUser" id="${elem.id}" value="View">
        </div>
        </div>
        <br/>
        `
    }
})
document.getElementById("zListDiv").addEventListener("click", (e) => {
    if (e.target.name === "deleteUser") {
        delUser(Number(e.target.id));
    } else if (e.target.name === "editUser") {
        editUser(Number(e.target.id))
    } else if (e.target.name === "viewUser") {
        console.log("This button transfers to Florent's View user page!");
    }
}
)
//#endregion
//#region Edit Users
function editUser(reqId) {
    pos = zResultUser.map(function (e) { return e.id; }).indexOf(reqId);
    user = zResultUser[pos];
    document.getElementById("editDiv").innerHTML =
        `<div class="form-group row">
                <fieldset id="myFieldsetUser">
                    <legend>Register New User:</legend>
                    First Name <br>
                    <input type="text" class="form-control"  id="firstNameEdit" value="${user.firstName}" required><br>
                    Last Name: <br>
                    <input type="text"class="form-control"  id="lastNameEdit" value="${user.lastName}" required><br>
                    Username:<br>
                    <input type="text" class="form-control" id="userNameEdit" value="${user.userName}" required><br>
                    Password:<br>
                    <input type="text" class="form-control" id="passwordEdit" value="${user.password}"><br>
                    Email:<br>
                    <input type="email" class="form-control" id="emailEdit" value="${user.email}"> <br>
                    <br>
                    <input type="radio" id="statusActive" name="statusEdit" value="active">
                    <label for="statusActive">Active</label>
                    <br>
                    <input type="radio" id="statusDisable" name="statusEdit" value="suspended">
                    <label for="statusDisable">Suspended</label>
                    <br>
                    <button id="btnEditUser" class="btn btn-danger" name="update">Save</button>
                </fieldset>
            </div>`
    if (user.status == "active") {
        document.getElementById("statusActive").checked = true;
    } else {
        document.getElementById("statusDisable").checked = true;
    };   
    document.getElementById("btnEditUser").addEventListener("click", () => {
        const stat = document.querySelector('input[name="statusEdit"]:checked').value;
        let updatedUser = ({
            "id": user.id,
            "firstName": document.getElementById("firstNameEdit").value,
            "lastName": document.getElementById("lastNameEdit").value,
            "userName": document.getElementById("userNameEdit").value,
            "password": document.getElementById("passwordEdit").value,
            "email": document.getElementById("emailEdit").value,
            "image": user.image,
            "language": user.language,
            "status": stat,
            "assigned_issues": user.assigned_issues,
            "watched_issues": user.watched_issues
        })
        zResultUser.splice(pos, 1, updatedUser);
        localStorage.setItem("users", JSON.stringify(zResultUser));
    })
};
//#endregion
//#region List all Projects Button event listener
btnListProjects.addEventListener("click", function () {
    checkUp();
    let mainElem = document.getElementById("zListDiv");
    mainElem.innerHTML = "";
    document.getElementById("zCreateUser").style.display = "none";
    document.getElementById("zCreateProject").style.display = "none";
    for (const elem of zResultProject) {
        mainElem.innerHTML += `
        <div class="card" style="width: 25rem;"> 
        <div class="card-body">
        <h4 id=${elem.id} class="card-title">${elem.projectName}</h4>
        <p id=${elem.id} class="card-text">${elem.organization} <span class="badge badge-secondary">${elem.status}</span> </p><br>
        <input type="button" class="btn btn-danger" name="delete" id="${elem.id}" value="Delete">
        <input type="button" class="btn btn-secondary" name="edit" id="${elem.id}" value="Edit">
        <input type="button" class="btn btn-secondary" name="view" id="${elem.id}" value="View">
        </div>
        </div><br/>
        `
    }
})
document.getElementById("zListDiv").addEventListener("click", (e) => {
    if (e.target.name === "delete") {
        delProject(Number(e.target.id));
    } else if (e.target.name === "edit") {
        editProject(Number(e.target.id))
    } else if (e.target.name === "view") {
        console.log("This button transfers to Florent's View user page!");
    }
}
)
//#endregion
//#region Edit Projects
function editProject(reqIdpro) {
    project = zResultProject.find(x => x.id == reqIdpro);
    posProject = zResultProject.indexOf(project);
    document.getElementById("editDiv").innerHTML =
        `<div class="form-group row">
                <fieldset id="myFieldsetUser">
                    <legend>Edit Project:</legend>
                    Project Name <br>
                    <input type="text" class="form-control" id="projectNameEdit" value="${project.projectName}" required><br>
                    Organizaton <br>
                    <input type="text" class="form-control" id="organizationEdit" value="${project.organization}" required><br>
                    Due Date:<br>
                    <input type="date" class="form-control" id="dueDateEdit" value="${project.dueDate}" required><br>
                    Version:<br>
                    <input type="text" class="form-control" id="versionEdit" value="${project.version}"><br>
                    Description:<br>
                    <input type="text" class="form-control" id="descriptionEdit" value="${project.description}">
                    <br>
                    <input type="radio" id="ststusOpen" name="statusEditProject" value="Open">
                    <label for="statusOpen">Open</label>
                    <br>
                    <input type="radio" id="statusClosed" name="statusEditProject" value="Closed">
                    <label for="statusClosed">Closed</label>
                    <br>
                    <button id="btnEditProject" class="btn btn-danger" name="update">Save</button>
                </fieldset>
            </div>`
            if(project.status == "Open"){
                document.getElementById("ststusOpen").checked = true;
            }else{
                document.getElementById("statusClosed").checked = true;
            }
    document.getElementById("btnEditProject").addEventListener("click", () => {
        const stat = document.querySelector('input[name="statusEditProject"]:checked').value;
        let updatedProject = ({
            "id": project.id,
            "projectName": document.getElementById("projectNameEdit").value,
            "organization": document.getElementById("organizationEdit").value,
            "description": document.getElementById("descriptionEdit").value,
            "dueDate": document.getElementById("dueDateEdit").value,
            "issues": project.issues,
            "version": document.getElementById("versionEdit").value,
            "status": stat,
        })
        zResultProject.splice(posProject, 1, updatedProject);
        localStorage.setItem("projects", JSON.stringify(zResultProject));
    })
};
//#endregion
//#region Creating Project
btnSubmitProject.addEventListener("click", (e) => {
    e.preventDefault();
    let projectName = document.getElementById("projectName").value;
    let organization = document.getElementById("organization").value;
    let dueDate = document.getElementById("dueDate").value;
    let version = document.getElementById("version").value;
    let description = document.getElementById("description").value;
    if (projectValidation(projectName, zResultProject)) {
        zResultProject.push({
            "id": zResultProject[zResultProject.length - 1].id + 1,
            "status": "open",
            "projectName": projectName,
            "organization": organization,
            "dueDate": dueDate,
            "version": version,
            "description": description,
            "issues": []
        })
        localStorage.setItem("projects", JSON.stringify(zResultProject));
    } else {
        console.log("Project with that name already exists!");
    }
    document.getElementById("zCreateProject").style.display = "none";
    document.getElementById("projectName").value = "";
    document.getElementById("organization").value = "";
    document.getElementById("dueDate").value = "";
    document.getElementById("version").value = "";
    document.getElementById("description").value = "";
})
function projectValidation(projectName, projectList) {
    let projectState = true;
    for (const project of projectList) {
        if (projectName === project.projectName) {
            projectState = false;
            break;
        } else {
            projectState = true;
        }
    }
    return projectState;
}
//#endregion
//#region Creating User
btnCreateUser.addEventListener("click", function () {
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let userName = document.getElementById("userName").value;
    let password = document.getElementById("password").value;
    const role = document.querySelector('input[name="roles"]:checked').value;
    let email = document.getElementById("email").value;
    if (userValidation(userName, email, zResultUser)) {
        zResultUser.push({
            "id": zResultUser[zResultUser.length - 1].id + 1,
            "firstName": firstName,
            "lastName": lastName,
            "userName": userName,
            "password": password,
            "role": role,
            "email": email,
            "image": "",
            "language": "en",
            "status": "active",
            "assigned_issues": [],
            "watched_Issues": []
        })
        localStorage.setItem("users", JSON.stringify(zResultUser));
    } else {
        console.log("User with that email adress already exists!");
    }
    document.getElementById("zCreateUser").style.display = "none";
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("userName").value = "";
    document.getElementById("password").value = "";
    document.getElementById("role").value = "";
    document.getElementById("email").value = "";
})
function userValidation(userName, email, usersList) {
    let userState = true;
    for (const user of usersList) {
        if (email === user.email || userName === user.userName) {
            userState = false;
            break;
        } else {
            userState = true;
        }
    }
    return userState;
}
//#endregion
//#region Deleting Users and Projects
function delUser(reqId) {
    let pos = zResultUser.map(function (e) { return e.id; }).indexOf(reqId);
    zResultUser.splice(pos, 1);
}
function delProject(reqId) {
    project = zResultProject.find(x => x.id == reqId);
    pos = zResultProject.indexOf(project);
    zResultProject.splice(pos, 1);
}
//#endregion
//#region LogOut
document.getElementById("logOutBtn").addEventListener("click", () => {
    // localStorage.clear("loggedUser");
    window.open("../Florent/findex.html", "_self");
})
//#endregion
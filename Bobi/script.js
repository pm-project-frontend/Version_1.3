//#region Defining variables and arrays
let bResultIssue = [];
let bResultProject = [];
let bResultUser = [];
let projectId;
let activeProject = {};
//#endregion
//#region Importing info
async function start() {
    try {
        projectId = await JSON.parse(localStorage.getItem("viewProject"));
        bResultIssue = await JSON.parse(localStorage.getItem("issues"));
        bResultProject = await JSON.parse(localStorage.getItem("projects"));
        bResultUser = await JSON.parse(localStorage.getItem("users"));
        giveBasicInfo();
        printAllIssues();
    } catch (error) {
        throw new Error("There has been an error receiving the files. Please try again later.");
    }
}
start();


//#endregion
//#region Printing basic project info
function giveBasicInfo() {
    activeProject = bResultProject.find(x => x.id == projectId);
    document.getElementById("projectName").innerHTML = `Project name: ${activeProject.projectName}`
    document.getElementById("organization").innerHTML = `Organization: ${activeProject.organization}`
    document.getElementById("status").innerHTML = `Status: ${activeProject.status}`
    document.getElementById("dueDate").innerHTML = `Duedate: ${activeProject.dueDate}`
    document.getElementById("issueNumber").innerHTML = `There is: ${activeProject.issues.length} issue`
}
//#endregion
//#region Printing all Issues
function printAllIssues() {
    let mainDivAll = document.getElementById("mainDiv");
    for (const e of activeProject.issues) {
        element = bResultIssue.find(x => x.id == e);
        elementUser = bResultUser.find(x => x.id == element.assignee);
        mainDivAll.innerHTML += `
                            <div>Id: ${element.id} </div>
                            <div>Organization: ${element.organization}</div>
                            <div>Summary: ${element.summary}</div>
                            <div>Duedate: ${element.dueDate}</div>
                            <div>Assignee: ${elementUser.firstName} ${elementUser.lastName}</div>
                            <div>Status: ${element.status}</div>
                            <input type="button" id="${element.id}" value="view"><br>`;

    }
}

document.getElementById("btnAll").addEventListener("click", function () {
    let mainDiv = document.getElementById("mainDiv");
    mainDiv.innerHTML = "";
    for (const e of activeProject.issues) {
        element = bResultIssue.find(x => x.id == e);
        elementUser = bResultUser.find(x => x.id == element.assignee);
        mainDiv.innerHTML += `
                                <div>Id: ${element.id} </div>
                                <div>Organization: ${element.organization}</div>
                                <div>Summary: ${element.summary}</div>
                                <div>Duedate: ${element.dueDate}</div>
                                <div>Assignee: ${elementUser.firstName} ${elementUser.lastName}</div>
                            <div>Status: ${element.status}</div>

                                <input type="button" id="${element.id}" value="view"><br>`;
    }
})
//#endregion
//#region Filter Resolved Issues
document.getElementById("btnResolved").addEventListener("click", function () {
    let mainDiv = document.getElementById("mainDiv");
    mainDiv.innerHTML = "";
    for (const e of activeProject.issues) {
        element = bResultIssue.find(x => x.id == e);
        if (element.status == "resolved") {
            elementUser = bResultUser.find(x => x.id == element.assignee);
            mainDiv.innerHTML += `
                                <div>Id: ${element.id} </div>
                                <div>Organization: ${element.organization}</div>
                                <div>Summary: ${element.summary}</div>
                                <div>Duedate: ${element.dueDate}</div>
                                <div>Assignee: ${elementUser.firstName} ${elementUser.lastName}</div>
                                <div>Status: ${element.status}</div>
                                <input type="button" id="${element.id}" value="view"><br>`;
        } else {
            continue;
        }
    }
})
//#endregion
//#region Filter Open Issues
document.getElementById("btnOpen").addEventListener("click", function () {
    let mainDiv = document.getElementById("mainDiv");
    mainDiv.innerHTML = "";
    for (const e of activeProject.issues) {
        element = bResultIssue.find(x => x.id == e);
        if (element.status == "open") {
            elementUser = bResultUser.find(x => x.id == element.assignee);
            mainDiv.innerHTML += `
                                <div>Id: ${element.id} </div>
                                <div>Organization: ${element.organization}</div>
                                <div>Summary: ${element.summary}</div>
                                <div>Duedate: ${element.dueDate}</div>
                                <div>Assignee: ${elementUser.firstName} ${elementUser.lastName}</div>
                                <input type="button" id="${element.id}" value="view"><br>`;
        } else {
            continue;
        }
    }
})
//#endregion
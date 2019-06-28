//#region Declaring Variables
let fResultUser = [];
let fLoggedUser;
let fLoggedUserBool;
let fCount = 0;
var fbtnLogIn = document.getElementById("fbtnLogIn");
function getResults() {
  fResultUser = JSON.parse(localStorage.getItem("users"));
  fForLocalProjects = JSON.parse(localStorage.getItem("projects"));
  fForLocalIssues = JSON.parse(localStorage.getItem("issues"));
}
//#endregion
//#region Get user input Values
fbtnLogIn.addEventListener("click", function (e) {
  e.preventDefault();
  var username = document.getElementById("fusername").value;
  var password = document.getElementById("fpassword").value;
  // importJsons(username, password);
  fcheckUser(username, password)
})
//#endregion
//#region User Login validation
function fcheckUser(username, password) {
  for (let user of fResultUser) {
    if (username == user.userName) {
      if (password == user.password) {
        if (user.status == "active") {
          if (user.role == "admin") {
            console.log("ADMIN");
            fLoggedUser = user.id;
            localStorage.setItem("loggedUser", fLoggedUser);
            window.open("../Zlatko/adminIndex.html", "_self")
          } else if (user.role == "user") {
            console.log("USER");
            fLoggedUser = user.id;
            localStorage.setItem("loggedUser", fLoggedUser);
            window.open("../Gjurgica/gjurgica3.html", "_self")
          }
        } else {
          fLoggedUserBool = false;
          console.log("You have been suspended. Please contact your admin!");
          return;
        }
      } else {
        fCount += 1
        fLoggedUserBool = false;
        if (fCount >= 3) {
          document.getElementById("fbox").style.display = "none";
          document.body.innerHTML = "<div>You have entered wrong password for 3 times. Please contact administrator to release your account again!</div>"
          // statusChangeUser = fResultUser.find(x => x.id == user.id);
          userPos = fResultUser.indexOf(user);
          fResultUser[userPos].status = "suspended";
          localStorage.setItem("users", JSON.stringify(fResultUser));
        }
        console.log("Invalid password");
        return;
      }
    } else {
      fLoggedUserBool = false;
    }
  }
  console.log("Username does not exist!")
}
//#endregion
//#region Call the list of users
async function importJsons() {
  try {
    let projectResult = await fetch("https://pm-project-frontend.github.io/jsons/projects.json");
    let issueResult = await fetch("https://pm-project-frontend.github.io/jsons/issues.json");
    let userResult = await fetch("https://pm-project-frontend.github.io/jsons/users.json");
    let fForLocalProjects = await projectResult.json();
    let fForLocalIssues = await issueResult.json();
    let fForLocalUsers = await userResult.json();
    localStorage.setItem("users", JSON.stringify(fForLocalUsers));
    localStorage.setItem("projects", JSON.stringify(fForLocalProjects));
    localStorage.setItem("issues", JSON.stringify(fForLocalIssues));
    getResults();
  } catch (error) {
    throw new Error("There has been an error receiving the files. Please try again later.")
  }
}
function checkUp() {
  if (localStorage.getItem("users") != null) {
    console.log("Tuka se");
    getResults();
  } else {
    importJsons();
  }
}
checkUp();
//#endregion
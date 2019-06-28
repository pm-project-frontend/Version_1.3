var mainContainer = document.getElementById("fsecondDiv");

let userId = 1;
fetch('https://pm-project-frontend.github.io/jsons/users.json')
.then(function (response) {
return response.json();
})
.then(function (data) {
appendData(data);
})
.catch(function (err) {
console.log('error: ' + err);
});

function appendData(data) {
var mainContainer = document.getElementById("fsecondDiv");
for (var i = 0; i < data.length; i++) {
var div = document.createElement("div");
div.innerHTML = 'User: ' + data[i].firstName + ' ' + data[i].lastName;
mainContainer.appendChild(div);
}
}

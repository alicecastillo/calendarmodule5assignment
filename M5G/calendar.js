let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let up = true;
let loggedin = false;
let token = null;
const curMonth = {
            monthSpot: 9,
            name: months[9],
            year: 2018,
            firstDayNum: 1,
            firstDay: days[1],
            num: monthDays[9]
        };


function loginAjax(event) {
    const username = document.getElementById("user").value; // Get the username from the form
    const password = document.getElementById("pass").value; // Get the password from the form

    // Make a URL-encoded string for passing POST data:
    const data = { 'username': username, 'password': password };

    fetch("login.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(function (data){
              console.log(data.success ? "You've been logged in!" : `You were not logged in ${data.message}`);
              console.log(data);
              token = data.token;
              if (data.success) {
                  loggedin = true;
                  clearCalendar();
                  createCalendar();
              }
        });
}

function registerAjax(event) {
    const username = document.getElementById("user").value; // Get the username from the form
    const password = document.getElementById("pass").value; // Get the password from the form

    // Make a URL-encoded string for passing POST data:
    const data = { 'username': username, 'password': password };

    fetch("register.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => console.log(data.success ? "You've been registered!" : `You were not registered ${data.message}`));
}

function createEvent(event) {
    const title = document.getElementById("title").value;
    const month = curMonth.monthSpot+1;
    const year = curMonth.year;
    const day = document.getElementById("day").value;
    const hour = document.getElementById("hour").value;
    const minute = document.getElementById("minute").value;
    const tag = document.getElementById("tag").value;
    const security = token;
    if (day >curMonth.num) {
        console.log("error: date out of bounds");
    }
    else {
    const data = {"token": security, "title": title, "month": month, "year": year, "day": day, "hour": hour, "minute": minute, "tag": tag};
    console.log(data);
    
    fetch("createevent.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'content-type': 'application/json'}
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .then(clearCalendar)
    .then(createCalendar)
    .then(clearFields);
    }
}

function editEvent(event) {
    const oldtitle = document.getElementById("edittitle").value;
    const olddate = document.getElementById("editday").value;
    const newtitle = document.getElementById("newtitle").value;
    const month = curMonth.monthSpot+1;
    const year = curMonth.year;
    const newday = document.getElementById("newday").value;
    const newhour = document.getElementById("newhour").value;
    const newminute = document.getElementById("newminute").value;
    const newtag = document.getElementById("newtag").value;
    const security = token;
    if (newday >curMonth.num) {
        console.log("error: date out of bounds");
    }
    else {
    const data = {"token": security, "title": oldtitle, "month": month, "year": year, "day": olddate,
        "newtitle": newtitle, "newday": newday,  "newhour": newhour, "newminute": newminute, "newtag": newtag};
    console.log(data);
    fetch("edit.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'content-type': 'application/json'}
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .then(clearCalendar)
    .then(createCalendar)
    .then(clearFields);
    }
}

function deleteEvent(event) {
    const deltitle = document.getElementById("deltitle").value;
    const delday = document.getElementById("delday").value;
    const security = token;
    const data = {"token": security, "title": deltitle, "day": delday};
    console.log(data);
    fetch("deleteevent.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'content-type': 'application/json'}
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .then(clearCalendar)
    .then(createCalendar)
    .then(clearFields);
}

function shareEvent(event) {
    const sharetitle = document.getElementById("sharetitle").value;
    const shareday = document.getElementById("shareday").value;
    const recipient = document.getElementById("recipient").value;
    const month = curMonth.monthSpot+1;
    const year = curMonth.year;
    const security = token;
    const data = {"token": security, "title": sharetitle, "day": shareday, "month": month, "year": year, "recipient": recipient};
    console.log(data);
    fetch("share.php", {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {'content-type': 'application/json'}
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .then(clearCalendar)
    .then(createCalendar)
    .then(clearFields);
}

function getEvents(year, month) {
    console.log("getting events");
    const security = token;
    const data = {"token": security, "month": month, "year": year};
    console.log(data);
    fetch("getevents.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'content-type': 'application/json'}
    })
    .then(response => response.json())
    .then(function(data) {
         console.log(data);
         for (var key in data) {
            if (data.hasOwnProperty(key)) {
                let event = data[key];
                console.log(event);
                let minString = event.minute;
                if (event.minute < 10) {
                    minString = "0"+ event.minute;
                }
                document.getElementById(event.day.toString()).textContent +=
                   "\n" + event.hour + ":" + minString + " - [" + event.tag + "]:\n" + event.title;
                
            }
         }
    });
}

function logout() {
    const data = { };

    fetch("logout.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .then(logoutswitch)
    .then(clearCalendar)
    .then(createCalendar)
    .then(clearFields);
}

function logoutswitch() {
    loggedin=false;
}

document.getElementById("login").addEventListener("click", loginAjax, false);
document.getElementById("register").addEventListener("click", registerAjax, false);
document.getElementById("logout").addEventListener("click", logout, false);
document.getElementById("create").addEventListener("click", createEvent, false);
document.getElementById("delete").addEventListener("click", deleteEvent, false);
document.getElementById("share").addEventListener("click", shareEvent, false);
document.getElementById("edit").addEventListener("click", editEvent, false);

function createCalendar() {
    let body = document.body;
    let calendar = document.createElement("table");
    calendar.id = "current month";
    console.log(curMonth);
    console.log(loggedin);
    let dayCounter = -6; //starts with the id of the day of the week it starts with 
    for(let i = 0; i< 8; i++) {
        let week = calendar.insertRow();
        for(let j = 1; j < 8; j++) {
            let day = week.insertCell();
            if(i==0) {
                day.setAttribute("colspan", "7");
                let month = document.createElement("month");
                month.style.fontSize = "30px";
                month.style.fontWeight = "bold";
                month.id = "month";
                month.appendChild(document.createTextNode(curMonth.name+" "+curMonth.year+""));
                day.appendChild(month);
                day.style.textAlign = "center";
                day.style.color = "white";
                day.style.backgroundColor = "#A80828"; //logout = //#B51A1A;
                break;
            }
            else {
                let calDay = document.createElement("newDay");
                if(i == 1)  { //days of the week (columns)
                    calDay.appendChild(document.createTextNode(days[j-1]));
                    calDay.id = days[j-1];
                    calDay.style.fontWeight = "bold";
                    day.appendChild(calDay);
                    if(days[j-1]==curMonth.firstDay || dayCounter>-6)
                        dayCounter++;
                    day.style.color = "white";
                    day.style.backgroundColor = "#544F4F";
                }
                else { //actual days of calendar
                    if(dayCounter<=curMonth.num && dayCounter>0) { 
                        calDay.id = dayCounter+""; //id is the day's calendar value if in current month
                        calDay.appendChild(document.createTextNode(calDay.id));
                        day.style.backgroundColor = "#F6C9C9";
                    }
                    else {
                        calDay.id = "0"; //day not in current month, id is 0
                        calDay.appendChild(document.createTextNode(" "));
                        day.style.backgroundColor = "#DEE6EB";
                    }
                    day.appendChild(calDay);
                    dayCounter++;
                }
            }
            
        }
    }
    body.appendChild(calendar);
    if (loggedin) {
        document.getElementById("eventManage").hidden = false;
        document.getElementById("loginfields").hidden = true;
        document.getElementById("logout").hidden = false;
        getEvents(curMonth.year, curMonth.monthSpot+1);
    }
    else {
        document.getElementById("eventManage").hidden = true;
        document.getElementById("loginfields").hidden = false;
        document.getElementById("logout").hidden = true;
    }
}
createCalendar();
document.getElementById("nextMonth").addEventListener("click", function(event) {
 up = true;
 changeMonth();
 event.preventDefault();
},  false);

document.getElementById("lastMonth").addEventListener("click", function(event) {
 up = false;
 changeMonth();
 event.preventDefault();
},  false);

function changeMonth() {
    if(up) { //go to next month
        let newDay = (curMonth.firstDayNum+curMonth.num)%7; //figures out new day num
        curMonth.firstDayNum = newDay;
        curMonth.firstDay = days[curMonth.firstDayNum];
        if(curMonth.name == "December")
            curMonth.year++;
        curMonth.monthSpot = (curMonth.monthSpot+1)%12;
        curMonth.name = months[curMonth.monthSpot];
        if(curMonth.year%4==0 && curMonth.name == "February") {
            if (curMonth.year%100 != 0 || curMonth.year%400==0) {
                curMonth.num = 29;
                curMonth.firstDayNum = newDay;
            }
            else {
                curMonth.num = 28;
                curMonth.firstDayNum = newDay;
            }
        }
        else {
            curMonth.num = monthDays[curMonth.monthSpot];
        }
    }
    else { //go to last month
        if(curMonth.name == "January") {
            curMonth.year--;
            curMonth.monthSpot = 11;
        }
        else {
            curMonth.monthSpot = (curMonth.monthSpot-1);   
        }
        curMonth.name = months[curMonth.monthSpot];
        
        let newDay = (curMonth.firstDayNum+6)%7;
        if(curMonth.year%4==0 && curMonth.name == "February") {
            if (curMonth.year%100 != 0 || curMonth.year%400==0) {
                curMonth.num = 29;
                curMonth.firstDayNum = newDay;
            }
            else {
                curMonth.num = 28;
                curMonth.firstDayNum = newDay;
            }
        }
        else {
            curMonth.num = monthDays[curMonth.monthSpot];
        }
        if(curMonth.num == 31) {
            let lastDay = (newDay+5)%7;
            curMonth.firstDayNum = lastDay;
        }
        else if(curMonth.num == 30) {
            let lastDay = (newDay+6)%7;
            curMonth.firstDayNum = lastDay;
        }
        else if(curMonth.num == 28) {
            let lastDay = (newDay+1)%7;
            curMonth.firstDayNum = lastDay;
        }
        curMonth.firstDay = days[curMonth.firstDayNum];   
    }
    clearCalendar();
    createCalendar();   
}

function clearCalendar() {
    let body = document.body;
    body.removeChild(document.getElementById("current month"));
}

function clearFields() {
    document.getElementById("user").value = "";
    document.getElementById("pass").value = "";
    document.getElementById("title").value = "";
    document.getElementById("day").value = "";
    document.getElementById("deltitle").value = "";
    document.getElementById("delday").value="";
    document.getElementById("sharetitle").value="";
    document.getElementById("shareday").value="";
    document.getElementById("edittitle").value="";
    document.getElementById("editday").value="";
    document.getElementById("recipient").value="";
    document.getElementById("newtitle").value="";
    document.getElementById("newday").value="";
}
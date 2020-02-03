function getJson(url, onloadCallback, token) {
  var http = new XMLHttpRequest();

  http.open('GET', url, true);

  http.overrideMimeType("application/json");
  if (token)
    http.setRequestHeader('Authorization', 'Bearer ' + token);

  http.onreadystatechange = function() {

    if (this.readyState == 4 && http.status >= 200 && http.status < 400) {
      onloadCallback(this.response)
    } else
    if (this.readyState == 4 && http.status == 401) {
      alert("invalid token");
      window.location.replace("./login.html");

    }
  }

  http.send();
}


function postJson(url, token, json, onloadCallback) {
  var http = new XMLHttpRequest();


  http.open('POST', url, true);

  //Send the proper header information along with the request
  http.setRequestHeader('Content-type', 'application/json');
  if (token)
    http.setRequestHeader('Authorization', token);

  http.onreadystatechange = function() {
    if (http.readyState == 4 && [200, 201, 202].includes(http.status)) {
      var obj = JSON.parse(this.responseText); //["data"];

      onloadCallback(JSON.parse(this.response));

    } else if (http.readyState == 4)
      alert(http.responseText);
  }
  http.send(JSON.stringify(json));
}

function putJson(url, token, json, onloadCallback) {
  var http = new XMLHttpRequest();


  http.open('PUT', url, true);

  //Send the proper header information along with the request
  http.setRequestHeader('Content-type', 'application/json');
  if (token)
    http.setRequestHeader('Authorization', token);

  http.onreadystatechange = function() { //Call a function when the state changes.
    if (http.readyState == 4 && http.status == 200) {
      onloadCallback(this.response)
    } else if (http.readyState == 4 && http.status != 200)
      alert(http.responseText);
  }
  http.send(JSON.stringify(json));
}


function getJsonCross(url) {

  var request = createCORSRequest('GET', url);
  if (!request) {
    throw new Error('CORS not supported');
  }


  request.setRequestHeader('Accept', 'application/json');

  request.send();
  return request;
}

function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {

    // Check if the XMLHttpRequest object has a "withCredentials" property.
    // "withCredentials" only exists on XMLHTTPRequest2 objects.
    xhr.open(method, url, true);

  } else if (typeof XDomainRequest != "undefined") {

    // Otherwise, check if XDomainRequest.
    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
    xhr = new XDomainRequest();
    xhr.open(method, url);

  } else {

    // Otherwise, CORS is not supported by the browser.
    xhr = null;

  }
  return xhr;
}


function logout() {
  localStorage.removeItem('token');
  window.location.replace("./login.html");
}



function fillComboFromApi(elementId, url, idColumn, valueColumn, url2) {
  // const token = 'Bearer ' + localStorage.getItem('token');
  getJson(url, function(response) {

    // Begin accessing JSON data here
    var jresp = JSON.parse(response);


    var elem = document.getElementById(elementId);
    while (elem.firstChild) {
      elem.removeChild(elem.firstChild);
    }

    for (var key in jresp.data) {
      var item = jresp.data[key];
      var a = document.createElement("a");
      a.classList = "dropdown-item";
      a.value = eval('item.' + idColumn);
      a.text = eval('item.' + valueColumn);
      a.href = url2 + a.text + '.html'
      elem.append(a);

    }
    var event = new Event('contentChanged');
    elem.dispatchEvent(event);



  });

}



function fillCardsFromApi(elementId, url, idColumn, valueColumn) {
  // const token = 'Bearer ' + localStorage.getItem('token');
  getJson(url, function(response) {

    // Begin accessing JSON data here
    var jresp = JSON.parse(response);


    var elem = document.getElementById(elementId);
    while (elem.firstChild) {
      elem.removeChild(elem.firstChild);
    }


    for (var key in jresp.artisticevents) {
      var item = jresp.artisticevents[key];
      if (key != 0) {
        var hr = document.createElement("hr");
        hr.style = "border-top: 5px dotted white; width:250px;";
        div.append(hr);
      }

      var div = document.createElement("div");
      div.classList = "row row-content";
      div.style = "padding-bottom:15px";
      elem.append(div);
      var div1 = document.createElement("div");
      div1.classList = "col-sm-3";
      div1.style = "my-auto align:left";
      div.append(div1);
      var img = document.createElement("img");
      img.classList = "img-thumbnail";
      img.style = 'height:160px; width:250px';
      img.src = item.image;
      img.alt = "";
      div1.append(img);


      var div2 = document.createElement("div");
      div2.classList = "col-sm-5";
      div2.style = "text-align: left";
      div.append(div2);
      var h4 = document.createElement("h4");
      h4.classList = "card-title";
      h4.innerText = eval('item.' + valueColumn);
      div2.append(h4);

      var p = document.createElement("p");
      p.className = "card-text text-xs-left";
      p = ' Date: ' + item.date;
      div2.append(p);
      var br = document.createElement("br");
      div2.append(br);

      var p2 = document.createElement("p");
      p2.className = "card-text text-xs-left";
      p2 = "Description:" + item.factsheet;
      div2.append(p2);

      var div3 = document.createElement("div");
      div3.classList = "col-sm-3";
      div3.style = "text-align: left";
      div.append(div3);

      var length = item.performers.length;
      var h4 = document.createElement("h4");
      h4.classList = "card-title";
      h4.innerText = 'Performers';
      div3.append(h4);
      for (var i = 0; i < length; i++) {
        var p = document.createElement("p");
        p.className = "card-text";
        p.style = 'align:left';
        p = item.performers[i].name;
        var br = document.createElement("br");
        div3.append(p);
        div3.append(br);
      }

      var div4 = document.createElement("div");
      div4.classList = "col-sm-1 align-middle";
      div4.style = "align: middle";
      var button = document.createElement("button");
      button.classList = "btn btn-primary align-middle";
      button.type = "submit";
      button.innerText = "Reserve";
      button.style = "margin-top:60%";
      div4.append(button);
      div.append(div4);

    }


    var event = new Event('contentChanged');
    elem.dispatchEvent(event);



  });

}


function fillSeminarFromApi(elementId, url, idColumn, valueColumn) {
  // const token = 'Bearer ' + localStorage.getItem('token');
  getJson(url, function(response) {

    // Begin accessing JSON data here
    var jresp = JSON.parse(response);


    var elem = document.getElementById(elementId);
    while (elem.firstChild) {
      elem.removeChild(elem.firstChild);
    }


    for (var key in jresp.seminaries) {
      var item = jresp.seminaries[key];
      if (key != 0) {
        var hr = document.createElement("hr");
        hr.style = "border-top: 5px dotted white; width:250px;";
        div.append(hr);
      }

      var div = document.createElement("div");
      div.classList = "row row-content";
      div.style = "padding-bottom:15px";
      elem.append(div);
      var div1 = document.createElement("div");
      div1.classList = "col-sm-3";
      div1.style = "my-auto align:left";
      div.append(div1);
      var img = document.createElement("img");
      img.classList = "img-thumbnail";
      img.style = 'height:160px; width:250px';
      img.src = item.image;
      img.alt = "";
      div1.append(img);


      var div2 = document.createElement("div");
      div2.classList = "col-sm-5";
      div2.style = "text-align: left";
      div.append(div2);
      var h4 = document.createElement("h4");
      h4.classList = "card-title";
      h4.innerText = eval('item.' + valueColumn);
      div2.append(h4);

      var p = document.createElement("p");
      p.className = "card-text text-xs-left";
      p = ' Date: ' + item.date;
      div2.append(p);
      var br = document.createElement("br");
      div2.append(br);

      var p2 = document.createElement("p");
      p2.className = "card-text text-xs-left";
      p2 = "Description:" + item.factsheet;
      div2.append(p2);

      var div3 = document.createElement("div");
      div3.classList = "col-sm-3";
      div3.style = "text-align: left";
      div.append(div3);

      var length = item.artisticevents.length;
      var h4 = document.createElement("h4");
      h4.classList = "card-title";
      h4.innerText = 'About';
      div3.append(h4);
      for (var i = 0; i < length; i++) {
        var p = document.createElement("p");
        p.className = "card-text";
        p.style = 'align:left';
        p = item.artisticevents[i].name;
        var br = document.createElement("br");
        div3.append(p);
        div3.append(br);
      }

      var div4 = document.createElement("div");
      div4.classList = "col-sm-1 align-middle";
      div4.style = "align: middle";
      var button = document.createElement("button");
      button.classList = "btn btn-primary align-middle";
      button.type = "submit";
      button.innerText = "Reserve";
      button.style = "margin-top:60%";
      div4.append(button);
      div.append(div4);

    }


    var event = new Event('contentChanged');
    elem.dispatchEvent(event);



  });

}





function getParFromURL(parName) {
  var fullUrl = new URL(window.location.href);
  return fullUrl.searchParams.get(parName);
}


function createBreadCrumbs(links) {
  var container = document.getElementById("myContainer");

  var nav = document.createElement("nav");
  nav.style = "margin-top:5%;";

  var div = document.createElement("nav");
  div.className = "nav-wrapper";

  nav.append(div);

  var div2 = document.createElement("nav");
  div2.className = "col s12";
  div2.style = "background-color:#616161;";
  div.append(div2);

  var isFirst = true;
  var n = 0;

  for (l in links) {
    n++;
    var aa = document.createElement("a");
    aa.className = "breadcrumb";
    aa.href = l;
    aa.innerHTML = links[l];
    if (isFirst) {
      aa.style = "margin-left:10px;";
      isFirst = false;
      aa.innerHTML = "<i style='margin-left:10px; color:#A4B6DA' class='fas fa-home'></i>";
    } else if (n == links.length) {
      aa.attributes['aria-current'].value = "page";
    }

    div2.append(aa);

  }
  container.prepend(nav);
}


function searchFilter() {


  search_input = document.getElementById('search').value.concat('20');
  search_input = search_input.substr(0, 2)+"-"+search_input.substr(3, 2)+"-"+search_input.substr(6, 4);
  //search_input = new Date(search_input);
  //search_input.setDate(search_input.getDate()+1);



  getJson("https://dreamlandfestival1.herokuapp.com/artisticevent/artisticevent/searcheventsbydate?date="+search_input,
    function(response) {
      myDate = JSON.parse(response);
      if (myDate.artisticevents.length == 0) {
        document.getElementById("containerSearch").innerHTML = `
<h4>No event for this date :(</h4>`;
      } else {
        document.getElementById("containerSearch").innerHTML = `

<table class="table ">
<thead>
<th>Event title</th>
<th>Date</th>
<th>Reservation</th>
</thead>
          ${myDate.artisticevents.map(item => `
             <tr style= "margin:0px; border:0px">
                 <td><a href=''>${item.title}</a></td>
                 <td>${item.date}</td>
                 <td><button type="button" class="btn btn-primary">Reserve</button></td>
             </tr>
          `).join('')}
         </table>


      `;}
      if (myDate.seminaries.length == 0) {
        document.getElementById("containerSearch").innerHTML = `
    <h4>No event for this date :(</h4>`;
      } else {
        document.getElementById("containerSearch").innerHTML = `

    <table class="table ">
    <thead>
    <th>Seminar title</th>
    <th>Date</th>
    <th>Reservation</th>
    </thead>
          ${myDate.seminaries.map(item => `
             <tr style= "margin:0px; border:0px">
                 <td><a href=''>${item.title}</a></td>
                 <td>${item.date}</td>
                 <td><button type="button" class="btn btn-primary">Reserve</button></td>
             </tr>
          `).join('')}
         </table>


      `;
      }
    });
  document.getElementById("search").value = "";
}




function getToken() {
  var loginUrl = "/users/authenticateext"
  var xhr = new XMLHttpRequest();
  var userElement = document.getElementById('username');
  var passwordElement = document.getElementById('password');
  var tokenElement = document.getElementById('token');
  var user = userElement.value;
  var password = passwordElement.value;

  xhr.open('POST', loginUrl, true);
  xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  xhr.addEventListener('load', function() {
    var responseObject = JSON.parse(this.response);
    console.log(responseObject);
    if (responseObject.result == 1) {
      tokenElement.innerHTML = "Login successful redirecting to Home";

      //predispongo i dati locali
      localStorage.setItem('token', responseObject.data.token);
      window.location.replace("./index.html");
    } else {
      tokenElement.innerHTML = "Invalid user/password";
    }
  });

  var sendObject = JSON.stringify({
    username: user,
    password: password,
    grant_type: "DIRECT"
  });

  console.log('going to send', sendObject);

  xhr.send(sendObject);
}

document.addEventListener('keydown', function(event) {
  if (event.code == 'Enter') {
    getToken();
  }
});



function formValidation() {
  var uid = document.registration.userid;
  var passid = document.registration.passid;
  var uname = document.registration.username;
  var uadd = document.registration.address;
  var ucountry = document.registration.country;
  var uemail = document.registration.email;
  var umsex = document.registration.msex;
  var ufsex = document.registration.fsex;
  if (userid_validation(uid, 5, 12)) {
    if (passid_validation(passid, 7, 12)) {
      if (allLetter(uname)) {
        if (alphanumeric(uadd)) {
          if (countryselect(ucountry)) {
            if (ValidateEmail(uemail)) {
              if (validsex(umsex, ufsex)) {}
            }
          }
        }
      }
    }
  }
  return false;

}

function userid_validation(uid, mx, my) {
  var uid_len = uid.value.length;
  if (uid_len == 0 || uid_len >= my || uid_len < mx) {
    alert("User Id should not be empty / length be between " + mx + " to " + my);
    uid.focus();
    return false;
  }
  return true;
}

function passid_validation(passid, mx, my) {
  var passid_len = passid.value.length;
  if (passid_len == 0 || passid_len >= my || passid_len < mx) {
    alert("Password should not be empty / length be between " + mx + " to " + my);
    passid.focus();
    return false;
  }
  return true;
}

function allLetter(uname) {
  var letters = /^[A-Za-z]+$/;
  if (uname.value.match(letters)) {
    return true;
  } else {
    alert('Username must have alphabet characters only');
    uname.focus();
    return false;
  }
}

function alphanumeric(uadd) {
  var letters = /^[0-9a-zA-Z]+$/;
  if (uadd.value.match(letters)) {
    return true;
  } else {
    alert('User address must have alphanumeric characters only');
    uadd.focus();
    return false;
  }
}

function countryselect(ucountry) {
  if (ucountry.value == "Default") {
    alert('Select your country from the list');
    ucountry.focus();
    return false;
  } else {
    return true;
  }
}


function ValidateEmail(uemail) {
  var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (uemail.value.match(mailformat)) {
    return true;
  } else {
    alert("You have entered an invalid email address!");
    uemail.focus();
    return false;
  }
}

function validsex(umsex, ufsex) {
  x = 0;

  if (umsex.checked) {
    x++;
  }
  if (ufsex.checked) {
    x++;
  }
  if (x == 0) {
    alert('Select Male/Female');
    umsex.focus();
    return false;
  } else {
    alert('Form Succesfully Submitted');
    window.location.reload()
    return true;
  }
}



function fillPerformes1(root, rowTemplate, columnTemplate, url) {
  getJson(url, function(res) {
    let data = JSON.parse(res).data;
    let carouselRow = '';
    for (let i = 1; i <= data.length; i++) {
      $.template("movieTemplate", $('#colCard').html());
      carouselRow += $.tmpl('movieTemplate', data[i - 1])[0].outerHTML;
      if (i % 4 == 0) {
        root.append($('#rowCard').html());
        root.find('.rowCard').last().html(carouselRow);
        // tmp.find('.rowCard').html(carouselRow);
        // root.append(tmp);
        carouselRow = '';
      }
    }
    root.find('.carousel-item').first().addClass('active');
  });
}

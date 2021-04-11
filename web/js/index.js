// pre-fill workout parameter buttons with previous workout options
async function indexPageLoad() {
  let parameters = getParameters();
  if (parameters.duration >= 10 && parameters.duration <= 50) {
    document.getElementById("durationrange").value = parameters.duration;
    changeLiveDuration(parameters.duration);
  }
  if (parameters.type) {
    let typeId = `btnType${parameters.type}`;
    let btnTypeContainer = document.getElementById("btntypecontainer");
    let btnsType = btnTypeContainer.getElementsByClassName("btn-check");
    for (let i = 0; i < btnsType.length; i++) {
      if (btnsType[i].id === typeId) {
        btnsType[i].checked = "true";
      }
    }
  }
  if (parameters.area) {
    let areaId = `btnArea${parameters.area}`;
    let btnAreaContainer = document.getElementById("btnareacontainer");
    let btnsArea = btnAreaContainer.getElementsByClassName("btn-check");
    for (let i = 0; i < btnsArea.length; i++) {
      if (btnsArea[i].id === areaId) {
        btnsArea[i].checked = "true";
      }
    }
  }
  if (parameters.level) {
    let intensityId = `btnIntensity${parameters.level}`;
    let btnLevelContainer = document.getElementById("btnintensitycontainer");
    let btnsLevel = btnLevelContainer.getElementsByClassName("btn-check");
    for (let i = 0; i < btnsLevel.length; i++) {
      if (btnsLevel[i].id === intensityId) {
        btnsLevel[i].checked = "true";
      }
    }
  }
}

// change the duration slider value on the fly
function changeLiveDuration(duration) {
  document.getElementById("durationValue").innerHTML = duration;
}

// resets options on home screen (without reloading page)
function resetOptions() {
  let btnLevelContainer = document.getElementById("btnintensitycontainer");
  let btnsLevel = btnLevelContainer.getElementsByClassName("btn-check");
  btnsLevel[0].checked = "true"

  let btnAreaContainer = document.getElementById("btnareacontainer");
  let btnsArea = btnAreaContainer.getElementsByClassName("btn-check");
  btnsArea[0].checked = "true"

  let btnTypeContainer = document.getElementById("btntypecontainer");
  let btnsType = btnTypeContainer.getElementsByClassName("btn-check");
  btnsType[0].checked = "true"

  document.getElementById("durationrange").value = 30;
  changeLiveDuration(30);
}

// gather form parameters and pass them to the view page through a query string
function getWorkout() {
  // get form parameters
  let type, area, level;
  let duration = document.getElementById("durationValue").innerHTML;
  let typeEl = document.getElementsByName("btntype");
  for (var i = 0; i < typeEl.length; i++) {
    if (typeEl[i].checked) {
      type = typeEl[i].value;
    }
  }
  let areaEl = document.getElementsByName("btnarea");
  for (var i = 0; i < areaEl.length; i++) {
    if (areaEl[i].checked) {
      area = areaEl[i].value;
    }
  }
  let levelEl = document.getElementsByName("btnintensity");
  for (var i = 0; i < levelEl.length; i++) {
    if (levelEl[i].checked) {
      level = levelEl[i].value;
    }
  }
  // send form parameters to view.html with string query
  var url =
    "view.html?type=" +
    encodeURIComponent(type) +
    "&area=" +
    encodeURIComponent(area) +
    "&level=" +
    encodeURIComponent(level) +
    "&duration=" +
    encodeURIComponent(duration);
  window.location.href = url;
  return false;
}
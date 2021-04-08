// change the duration slider value on the fly
function changeLiveDuration(duration) {
  document.getElementById("durationValue").innerHTML = duration;
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
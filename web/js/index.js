function changeLiveDuration(duration) {
  document.getElementById("durationValue").innerHTML = duration;
}

async function getWorkout() {
  showSpinner();
  let type, area, level;
  let duration = document.getElementById("durationValue").innerHTML;
  console.log(duration);
  let typeEl = document.getElementsByName("btntype");
  for (var i = 0; i < typeEl.length; i++) {
    if (typeEl[i].checked) {
      type = typeEl[i].value;
      // console.log(type);
    }
  }
  let areaEl = document.getElementsByName("btnarea");
  for (var i = 0; i < areaEl.length; i++) {
    if (areaEl[i].checked) {
      area = areaEl[i].value;
      // console.log(area);
    }
  }
  let levelEl = document.getElementsByName("btnintensity");
  for (var i = 0; i < levelEl.length; i++) {
    if (levelEl[i].checked) {
      level = levelEl[i].value;
      // console.log(level);
    }
  }

  await handleRequest(duration, type, area, level);
}

function hideSpinner() {
  document.getElementById("loadingSpinner").style.display = "none";
  document.getElementById("generateBtn").innerHTML = "Complete!";
}

function showSpinner() {
  document.getElementById("loadingSpinner").style.display = "block";
  document.getElementById("generateBtn").innerHTML = "Loading...";
}

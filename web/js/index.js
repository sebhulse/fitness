function changeLiveDuration(duration) {
  document.getElementById("durationValue").innerHTML = duration;
}

function showSpinner() {
  document.getElementById("generateBtn").innerHTML = "Loading...";
}

function hideSpinner() {
  // delete previous alerts
  if (document.getElementById('alert1')) {
    document.getElementById('alert1').parentNode
      .removeChild(document.getElementById('alert1'));
    document.getElementById('viewButton').parentNode
      .removeChild(document.getElementById('viewButton'));
  }
  // create success alert
  document.getElementById("generateBtn").innerHTML = "Generate New Workout";
  document.getElementById("selections").insertAdjacentHTML(
    "beforebegin",
    `<div id="alert1" class="alert alert-success text-center alert-dismissible fade show" role="alert">
  <strong>Success!</strong> Workout generated.
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>`
  );
  // create view button
  let viewButton = document.createElement('button')
  viewButton.id = "viewButton"
  viewButton.type = "button"
  viewButton.className += 'btn m-2 btn-success btn-lg d-inline'
  viewButton.innerHTML = 'View Workout'
  viewButton.onclick = function() {
    window.location.href = "./view.html";
  }
  document.getElementById("buttonContainer").appendChild(viewButton)
}

function viewButton() {
  console.log(window.location.href);


  return false
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
// this takes the query string parameters and sends them to the workout generator function (refresh will create new workout)
async function viewPageLoad() {
  parameters = getParameters();
  let response = await handleRequest(
    parameters.duration,
    parameters.type,
    parameters.area,
    parameters.level
  );
  let noStoredItems = sessionStorage.length + 1
  console.log(noStoredItems);
  let resString = JSON.stringify(response);
  sessionStorage.setItem(noStoredItems, resString);
  let anothername = sessionStorage.getItem(noStoredItems);

  let json2 = JSON.parse(anothername);
  console.log(json2);
  // console.log(JSON.parse(response));
  buildAccordion(response);
  buildHistory()
}

function changeOptions() {
  parameters = getParameters();
  // send form parameters to index.html with string query
  var url =
    "index.html?type=" +
    encodeURIComponent(parameters.type) +
    "&area=" +
    encodeURIComponent(parameters.area) +
    "&level=" +
    encodeURIComponent(parameters.level) +
    "&duration=" +
    encodeURIComponent(parameters.duration);
  window.location.href = url;
  return false;
}

// get parameters from URL string
function getParameters() {
  const params = new URLSearchParams(window.location.search);
  body = {
    type: params.get("type"),
    area: params.get("area"),
    level: params.get("level"),
    duration: params.get("duration"),
  };
  return body;
}

// create accordion element
async function buildAccordion(jsonWorkout) {
  // const jsonWorkout = await JSON.parse(workout);
  console.log(jsonWorkout);

  // for each section in the whole json (warmup, cooldown etc), create the body text
  Object.keys(jsonWorkout).forEach(function(key) {
    if (key != 'parameters') {
      let name = key.charAt(0).toUpperCase() + key.slice(1);
      let bodyShell = `<ul class="list-group list-group-flush">`;

      // for each exercises 'blob' section in each section
      Object.keys(jsonWorkout[key]).forEach(function(key1) {
        let exercise = jsonWorkout[key][key1]["exercise"];
        let durationWC = jsonWorkout[key][key1]["duration"];
        if (exercise === "rest") {
          exercise = "Rest";
        } else if (exercise === "transition") {
          exercise = "Section Transition";
        }
        // checks if there's an array and if so, loops through the array to display exercises
        if (typeof exercise !== "undefined") {
          let bodyListItem = `<li class="list-group-item d-flex justify-content-between">${exercise}
          <small class="text-muted">${durationWC}s</small>
          </li>`;
          bodyShell += bodyListItem;
        } else {
          let exerciseArray = jsonWorkout[key][key1];
          for (var i = 0; i < exerciseArray.length; i++) {
            let arrayExercise = exerciseArray[i].exercise;
            if (arrayExercise === "rest") {
              arrayExercise = "Rest";
            } else if (arrayExercise === "transition") {
              arrayExercise = "Section Transition";
            }
            let exDuration = exerciseArray[i].duration;
            let bodyListItem = `<li class="list-group-item d-flex justify-content-between">${arrayExercise}
              <small class="text-muted">${exDuration}s</small>
            </li>`;
            bodyShell += bodyListItem;
          }
        }
      });
      bodyShell += `</ul>`;

      let iterator = `iterator${key}`;

      // create the accordion shell element
      let accordion = `<div class="accordion-item" id="accordionOne">
              <h2 class="accordion-header" id="headingOne">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${iterator}" aria-expanded="true" aria-controls="${iterator}">
                  ${name}
                </button>
              </h2>
              <div id="${iterator}" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionPlaceholder">
                <div class="accordion-body col-md-8 mx-auto">
                  ${bodyShell}
                </div>
              </div>
            </div>`;
      document
        .getElementById("accordionPlaceholder")
        .insertAdjacentHTML("beforebegin", accordion);
    }

  });
}

function buildHistory() {
  let listShell = `<ol class="list-group">`;
  let keys = []
  for (var i = 0; i < sessionStorage.length; i++) {
    keys.push(sessionStorage.key(i))
  }
  keys.sort((a, b) => a - b);
  for (var i = 0; i < keys.length; i++) {
    let key = keys[i]
    let histListItem = `
    <button type="button" class="list-group-item list-group-item-action">
    <div class="ms-2 me-auto">
      <div class="fw-bold">Workout ${key}</div>
      Parameters
    </div>
    </button>`;
    listShell += histListItem
  }

  listShell += `</ol>`;
  document
    .getElementById("listHistoryPlaceholder")
    .insertAdjacentHTML("beforebegin", listShell);
}
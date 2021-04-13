// this takes the query string parameters and sends them to the workout generator function (refresh will create new workout)
async function viewPageLoad() {
  parameters = getParameters();
  let response = await handleRequest(
    parameters.duration,
    parameters.type,
    parameters.area,
    parameters.level
  );
  let noStoredItems = sessionStorage.length + 1;
  console.log(noStoredItems);
  let resString = JSON.stringify(response);
  sessionStorage.setItem(noStoredItems, resString);
  let anothername = sessionStorage.getItem(noStoredItems);

  let json2 = JSON.parse(anothername);
  console.log(json2);
  // console.log(JSON.parse(response));
  buildAccordion(response);
  buildHistory();
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

  // for each section in the whole json (warmup, cooldown etc), create the body text
  Object.keys(jsonWorkout).forEach(function(key) {
    if (key != "parameters") {
      let name = key.charAt(0).toUpperCase() + key.slice(1);

      let ul = document.createElement("ul");
      ul.className = "list-group list-group-flush";
      ul.id = "listContainerWorkout";

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

          let bodyListItem = document.createElement("li");
          bodyListItem.className =
            "list-group-item d-flex justify-content-between";
          bodyListItem.innerHTML = `${exercise}`;
          bodyListItem.id = "bodyListItem";

          let durationSmall = document.createElement("small");
          durationSmall.className = "text-muted";
          durationSmall.innerHTML = `${durationWC}s`;
          durationSmall.id = "durationSmall";

          bodyListItem.appendChild(durationSmall);

          ul.appendChild(bodyListItem);

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

            let bodyListItem2 = document.createElement("li");
            bodyListItem2.className =
              "list-group-item d-flex justify-content-between";
            bodyListItem2.innerHTML = `${arrayExercise}`;
            bodyListItem2.id = "bodyListItem2";

            let durationSmall2 = document.createElement("small");
            durationSmall2.className = "text-muted";
            durationSmall2.innerHTML = `${exDuration}s`;
            durationSmall2.id = "durationSmall2";

            bodyListItem2.appendChild(durationSmall2);

            ul.appendChild(bodyListItem2);
          }
        }
      });

      let iterator = `iterator${key}`;

      let accordionDiv = document.createElement("div");
      accordionDiv.className = "accordion-item";
      accordionDiv.id = "accordionOne";

      let accordionHeader = document.createElement("h2");
      accordionHeader.className = "accordion-header";
      accordionHeader.id = "headingOne";

      let accordionButton = document.createElement("button");
      accordionButton.className = "accordion-button collapsed";
      accordionButton.type = "button";
      accordionButton.setAttribute("data-bs-toggle", "collapse");
      accordionButton.setAttribute("data-bs-target", `#${iterator}`);
      accordionButton.setAttribute("aria-expanded", "true");
      accordionButton.setAttribute("aria-controls", iterator);
      accordionButton.innerHTML = name;

      let accordionDiv2 = document.createElement("div");
      accordionDiv2.className = "accordion-collapse collapse";
      accordionDiv2.id = iterator;
      accordionDiv2.setAttribute("aria-labelledby", "headingOne");
      accordionDiv2.setAttribute("data-bs-parent", "#accordionPlaceholder");

      let accordionDiv3 = document.createElement("div");
      accordionDiv3.className = "accordion-body col-md-8 mx-auto";


      accordionDiv.appendChild(accordionHeader);
      accordionHeader.appendChild(accordionButton);
      accordionDiv.appendChild(accordionDiv2);
      accordionDiv2.appendChild(accordionDiv3);
      accordionDiv3.appendChild(ul);
      console.log(accordionDiv);

      let accordionPlaceholder = document.getElementById("accordionPlaceholder");
      accordionPlaceholder.appendChild(accordionDiv);
    }
  });
}

// create history element
function buildHistory() {
  let keys = [];
  for (var i = 0; i < sessionStorage.length; i++) {
    keys.push(sessionStorage.key(i));
  }
  keys.sort((a, b) => a - b);

  let ol = document.createElement("ol");
  ol.className = "list-group";
  ol.id = "listContainer";

  for (var i = 0; i < keys.length; i++) {
    let key = keys[i];
    let histButton = document.createElement("button");
    histButton.type = "button";
    histButton.className = "list-group-item list-group-item-action";
    histButton.id = `histButton${i}`;

    let histInnerDiv = document.createElement("div");
    histInnerDiv.className = "fw-bold";
    histInnerDiv.innerHTML = `Workout ${key}`;
    histInnerDiv.id = `histInnerDiv${i}`;

    let histDiv = document.createElement("div");
    histDiv.className = "ms-2 me-auto";
    histDiv.id = `histDiv${i}`;
    histDiv.innerHTML = "Parameters";

    histButton.appendChild(histInnerDiv);
    histButton.appendChild(histDiv);

    document
      .getElementById("listHistoryPlaceholder")
      .appendChild(ol)
      .appendChild(histButton);
  }
}
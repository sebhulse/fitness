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
  let resString = JSON.stringify(response);
  sessionStorage.setItem(noStoredItems, resString);

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
  if (typeof jsonWorkout !== "object") {
    jsonWorkout = JSON.parse(jsonWorkout);
  }

  // clear accordionPlaceholder before building
  const accordionPlaceholder = document.querySelector("#accordionPlaceholder");
  if (accordionPlaceholder) {
    removeAllChildNodes(accordionPlaceholder);
  }
  // for each section in the whole json (warmup, cooldown etc), create the body text
  Object.keys(jsonWorkout).forEach(function(key) {
    if (key != "parameters") {
      let name = wordToUpperCase(key);

      let ul = document.createElement("ul");
      ul.className = "list-group list-group-flush";
      ul.id = "listContainerWorkout";
      let innerSectionLength = 0;

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
          innerSectionLength += durationWC;
          console.log(innerSectionLength);
          let bodyListItem = document.createElement("li");
          bodyListItem.className =
            "list-group-item d-flex justify-content-between";
          bodyListItem.innerHTML = `${exercise}`;
          bodyListItem.id = "bodyListItem";

          let durationSmall = document.createElement("small");
          durationSmall.className = "text-secondary";
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
            innerSectionLength += exDuration;
            console.log(innerSectionLength);

            let bodyListItem2 = document.createElement("li");
            bodyListItem2.className =
              "list-group-item d-flex justify-content-between";
            bodyListItem2.innerHTML = `${arrayExercise}`;
            bodyListItem2.id = "bodyListItem2";

            let durationSmall2 = document.createElement("small");
            durationSmall2.className = "text-secondary";
            durationSmall2.innerHTML = `${exDuration}s`;
            durationSmall2.id = "durationSmall2";

            bodyListItem2.appendChild(durationSmall2);

            ul.appendChild(bodyListItem2);
          }
        }
      });
      let stringSectionTime = secondsToHms(innerSectionLength)
      console.log("seconds " + stringSectionTime);

      let iterator = `iterator${key}`;

      let accordionDiv = document.createElement("div");
      accordionDiv.className = "accordion-item ";
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
      accordionButton.innerHTML = `${name} | ${stringSectionTime}`;

      // let accordionSmall = document.createElement("span");
      // accordionSmall.className = "badge bg-primary rounded-pill";
      // accordionSmall.id = "accordionSmall";
      // accordionSmall.innerHTML = "1m 30s";
      // accordionSmall.setAttribute("aria-labelledby", "headingOne");
      // accordionSmall.setAttribute("data-bs-parent", "#accordionPlaceholder");

      let accordionDiv2 = document.createElement("div");
      accordionDiv2.className = "accordion-collapse collapse";
      accordionDiv2.id = iterator;
      accordionDiv2.setAttribute("aria-labelledby", "headingOne");
      accordionDiv2.setAttribute("data-bs-parent", "#accordionPlaceholder");

      let accordionDiv3 = document.createElement("div");
      accordionDiv3.className = "accordion-body";

      accordionDiv.appendChild(accordionHeader);
      accordionHeader.appendChild(accordionButton);
      accordionDiv.appendChild(accordionDiv2);
      accordionDiv2.appendChild(accordionDiv3);
      accordionDiv3.appendChild(ul);
      // accordionButton.appendChild(accordionSmall)

      let accordionPlaceholder = document.getElementById(
        "accordionPlaceholder"
      );
      accordionPlaceholder.appendChild(accordionDiv);
    }
  });
}

// create history element
function buildHistory() {
  // clear accordionPlaceholder before building
  const listHistoryPlaceholder = document.querySelector(
    "#listHistoryPlaceholder"
  );
  if (listHistoryPlaceholder) {
    removeAllChildNodes(listHistoryPlaceholder);
  }

  let keys = [];
  for (var i = 0; i < sessionStorage.length; i++) {
    keys.push(sessionStorage.key(i));
  }
  keys.sort((a, b) => a - b);

  let ol = document.createElement("div");
  ol.className = "list-group";
  ol.id = "listContainer";

  for (var i = 0; i < keys.length; i++) {
    let key = keys[i];
    let data = sessionStorage.getItem(i + 1);
    let jsonData = JSON.parse(data);
    let parameters = jsonData.parameters;

    let time = Date.parse(parameters.time);
    let timeNow = Date.now();
    let timeDifferenceS = Math.round((timeNow - time) / 1000);
    let hrsminse = secondsToHms(timeDifferenceS);

    let histButton = document.createElement("a");
    histButton.setAttribute(
      "onclick",
      `buildAccordion(${JSON.stringify(jsonData)})`
    );
    histButton.id = `histButton${i + 1}`;
    histButton.setAttribute("data-bs-toggle", "list");
    if (i === keys.length - 1) {
      histButton.className = "list-group-item list-group-item-action active";
    } else {
      histButton.className = "list-group-item list-group-item-action";
    }

    let histInnerDiv = document.createElement("div");
    histInnerDiv.className = "d-flex justify-content-between";
    histInnerDiv.innerHTML = `Workout ${key}`;
    histInnerDiv.id = `histInnerDiv${i + 1}`;

    let histInnerSmall = document.createElement("small");
    histInnerSmall.innerHTML = `Created ${hrsminse} ago`;
    histInnerSmall.id = "histInnerSmall";

    let histDiv = document.createElement("small");
    histDiv.className = "ms-2 me-auto";
    histDiv.id = `histDiv${i + 1}`;
    histDiv.innerHTML = `${parameters.duration} mins | ${wordToUpperCase(
      parameters.type
    )} | ${wordToUpperCase(parameters.area)} | ${wordToUpperCase(
      parameters.level
    )}`;
    histButton.appendChild(histInnerDiv);
    histButton.appendChild(histDiv);
    histInnerDiv.appendChild(histInnerSmall);

    document
      .getElementById("listHistoryPlaceholder")
      .appendChild(ol)
      .appendChild(histButton);
  }
}

function clearHistory() {
  window.sessionStorage.clear();
  viewPageLoad();
}

function secondsToHms(d) {
  let showSeconds = true
  if ((d % 60 === 0) && d !== 0) {
    showSeconds = false
  }

  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);
  var s = Math.floor((d % 3600) % 60);

  var hDisplay = h > 0 ? h + "h " : "";
  var mDisplay = m > 0 ? m + "m " : "";
  var sDisplay = s > 0 ? s + "s" : "0s";
  if (showSeconds) {
    return hDisplay + mDisplay + sDisplay;
  } else {
    return hDisplay + mDisplay;
  }
}

function wordToUpperCase(word) {
  let wordUpper = word.charAt(0).toUpperCase() + word.slice(1);
  return wordUpper;
}

// removes all child nodes of a given element
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
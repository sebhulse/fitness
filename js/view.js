const dropletIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-droplet" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M7.21.8C7.69.295 8 0 8 0c.109.363.234.708.371 1.038.812 1.946 2.073 3.35 3.197 4.6C12.878 7.096 14 8.345 14 10a6 6 0 0 1-12 0C2 6.668 5.58 2.517 7.21.8zm.413 1.021A31.25 31.25 0 0 0 5.794 3.99c-.726.95-1.436 2.008-1.96 3.07C3.304 8.133 3 9.138 3 10a5 5 0 0 0 10 0c0-1.201-.796-2.157-2.181-3.7l-.03-.032C9.75 5.11 8.5 3.72 7.623 1.82z"/>
  <path fill-rule="evenodd" d="M4.553 7.776c.82-1.641 1.717-2.753 2.093-3.13l.708.708c-.29.29-1.128 1.311-1.907 2.87l-.894-.448z"/>
</svg>`;
// this takes the query string parameters and sends them to the workout generator function (refresh will also create new workout)
async function viewPageLoad() {
  parameters = getParameters();
  const url = `https://api.sebhulse.com/v1/workout/?type=${parameters.type}&area=${parameters.area}&level=${parameters.level}&duration=${parameters.duration}`;
  let response = await fetch(url);
  let jsonResp = await response.json();
  let noStoredItems = sessionStorage.length;
  let resString = JSON.stringify(jsonResp);

  sessionStorage.setItem(noStoredItems, resString);

  buildAccordion(jsonResp);
  buildHistory();
}

// get form parameters and send to index.html with string query
function changeOptions() {
  parameters = getParameters();
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
  parameters = jsonWorkout.parameters;

  // clear accordionPlaceholder before building
  const accordionPlaceholder = document.querySelector("#accordionPlaceholder");
  if (accordionPlaceholder) {
    removeAllChildNodes(accordionPlaceholder);
  }
  // build parameters section
  let accordionOverallDiv = document.createElement("div");
  accordionOverallDiv.className = "container";
  accordionOverallDiv.id = "accordionOverallDiv";

  let parametersContainer = document.createElement("div");
  parametersContainer.className = "container";
  parametersContainer.id = "parametersContainer";

  let parametersLevel = document.createElement("p");
  parametersLevel.id = "parametersContainer";
  parametersLevel.innerHTML = `Duration: ${
    parameters.duration
  }m | Type: ${wordToUpperCase(parameters.type)} | Area: ${wordToUpperCase(
    parameters.area
  )} | Level: ${wordToUpperCase(parameters.level)}`;

  accordionPlaceholder.appendChild(accordionOverallDiv);
  accordionOverallDiv.appendChild(parametersContainer);
  parametersContainer.appendChild(parametersLevel);

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
        let exercise = jsonWorkout[key][key1]["ex"];
        let durationWC = jsonWorkout[key][key1]["du"];
        let restWC = jsonWorkout[key][key1]["re"];

        if (exercise === "transition") {
          exercise = dropletIcon;
        }

        innerSectionLength += durationWC;

        let bodyListItem = document.createElement("li");
        bodyListItem.className =
          "list-group-item d-flex justify-content-between";
        bodyListItem.innerHTML = `${exercise}`;
        bodyListItem.id = "bodyListItem";

        let durationSmall = document.createElement("small");
        durationSmall.className = "text-secondary";
        durationSmall.innerHTML = restWC ?
          `${durationWC}s | Rest ${restWC}` :
          `${durationWC}s`;
        durationSmall.id = "durationSmall";

        bodyListItem.appendChild(durationSmall);
        ul.appendChild(bodyListItem);
      });
      let stringSectionTime = secondsToHms(innerSectionLength);
      let iterator = `iterator${key}`;

      let accordionDiv = document.createElement("div");
      accordionDiv.className = "accordion-item ";
      accordionDiv.id = "accordionOne";

      let accordionHeader = document.createElement("h2");
      accordionHeader.className = "accordion-header";
      accordionHeader.id = "headingOne";

      let accordionButton = document.createElement("button");
      if (key === "warmup") {
        accordionButton.className = "accordion-button show";
      } else {
        accordionButton.className = "accordion-button collapsed";
      }
      accordionButton.type = "button";
      accordionButton.setAttribute("data-bs-toggle", "collapse");
      accordionButton.setAttribute("data-bs-target", `#${iterator}`);
      accordionButton.setAttribute("aria-controls", iterator);
      accordionButton.innerHTML = `${name} | ${stringSectionTime}`;
      let accordionDiv2 = document.createElement("div");
      if (key === "warmup") {
        accordionDiv2.className = "accordion-collapse collapse show";
      } else {
        accordionDiv2.className = "accordion-collapse collapse";
      }
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
    let data = sessionStorage.getItem(key);
    if (!data) {
      continue;
    }
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
    histButton.id = `histButton${i}`;
    histButton.setAttribute("data-bs-toggle", "list");
    if (i === keys.length - 1) {
      histButton.className = "list-group-item list-group-item-action active";
    } else {
      histButton.className = "list-group-item list-group-item-action";
    }

    let histInnerDiv = document.createElement("div");
    histInnerDiv.className = "d-flex justify-content-between";
    histInnerDiv.innerHTML = `Workout ${key}`;
    histInnerDiv.id = `histInnerDiv${i}`;

    // let closeButton = document.createElement("button");
    // closeButton.type = "button";
    // closeButton.className = "btn-close btn-close-white";
    // closeButton.setAttribute("aria-label", "Close");
    // closeButton.id = `${i}`;
    // closeButton.setAttribute("onclick", `deleteHistItem(${i})`);

    let histInnerSmall = document.createElement("div");
    histInnerSmall.innerHTML = `${hrsminse} ago`;
    histInnerSmall.id = "histInnerSmall";

    let histSmall = document.createElement("small");
    histSmall.className = "ms-2 me-auto d-flex justify-content-between";
    histSmall.id = `histDiv${i}`;
    histSmall.innerHTML = `${parameters.duration} mins | ${wordToUpperCase(
      parameters.type
    )} | ${wordToUpperCase(parameters.area)} | ${wordToUpperCase(
      parameters.level
    )}`;
    histButton.appendChild(histInnerDiv);
    histButton.appendChild(histSmall);
    // histInnerDiv.appendChild(closeButton);
    histSmall.appendChild(histInnerSmall);

    document
      .getElementById("listHistoryPlaceholder")
      .appendChild(ol)
      .appendChild(histButton);
  }
}

// function deleteHistItem(i) {
//   window.sessionStorage.removeItem(i);
//   buildHistory();
// }

// clear sessionStorage
function clearHistory() {
  window.sessionStorage.clear();
  viewPageLoad();
}

// convert seconds to Hours Mins Seconds
function secondsToHms(d) {
  let showSeconds = true;
  if (d % 60 === 0 && d !== 0) {
    showSeconds = false;
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

// first letter of string to uppercase and insert spaces between lower case letters, upper case letters and numbers
function wordToUpperCase(word) {
  let wordUpper = word.charAt(0).toUpperCase() + word.slice(1);
  return wordUpper.replace(/([a-z0-9])([A-Z0-9])/g, '$1 $2');
}

// removes all child nodes of a given element
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
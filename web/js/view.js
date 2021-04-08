// this takes the query string parameters and sends them to the workout generator function (refresh will create new workout)
async function pageLoad() {
  const params = new URLSearchParams(window.location.search);

  const type = params.get("type");
  const area = params.get("area");
  const level = params.get("level");
  const duration = params.get("duration");

  let response = await handleRequest(duration, type, area, level);
  buildAccordion(response);
}

// create accordion element
async function buildAccordion(workout) {
  const jsonWorkout = await JSON.parse(workout);

  // for each section in the whole json (warmup, cooldown etc), create the body text
  Object.keys(jsonWorkout).forEach(function(key) {
    let name = key.charAt(0).toUpperCase() + key.slice(1);
    let bodyShell = `<ul class="list-group list-group-flush">`;

    // for each exercises 'blob' section in each section
    Object.keys(jsonWorkout[key]).forEach(function(key1) {
      let exercise = jsonWorkout[key][key1]["exercise"];
      // checks if there's an array
      if (typeof exercise !== "undefined") {
        let bodyListItem = `<li class="list-group-item">${exercise}</li>`;
        bodyShell += bodyListItem;
      } else {
        let exerciseArray = jsonWorkout[key][key1];
        for (var i = 0; i < exerciseArray.length; i++) {
          let arrayExercise = exerciseArray[i].exercise;
          let bodyListItem = `<li class="list-group-item">${arrayExercise}</li>`
          bodyShell += bodyListItem
        }
      }
    });
    bodyShell += `</ul>`;

    let iterator = `iterator${key}`;

    // create the accordion shell element
    let accordion = `<div class="accordion-item">
            <h2 class="accordion-header" id="headingOne">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${iterator}" aria-expanded="true" aria-controls="${iterator}">
                ${name}
              </button>
            </h2>
            <div id="${iterator}" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionPlaceholder">
              <div class="accordion-body">
                ${bodyShell}
              </div>
            </div>
          </div>`;
    document
      .getElementById("accordionPlaceholder")
      .insertAdjacentHTML("beforebegin", accordion);
  });
}
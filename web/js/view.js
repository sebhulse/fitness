async function pageLoad() {
  const params = new URLSearchParams(window.location.search);

  const type = params.get("type");
  const area = params.get("area");
  const level = params.get("level");
  const duration = params.get("duration");

  let response = await handleRequest(duration, type, area, level);
  buildAccordion(response);
}

// create accordion
async function buildAccordion(workout) {
  const jsonWorkout = await JSON.parse(workout);
  console.log(jsonWorkout);

  // for each section in the whole json (warmup, cooldown etc), create the body text
  Object.keys(jsonWorkout).forEach(function(key) {
    let name = key.charAt(0).toUpperCase() + key.slice(1);
    let bodyShell = `<ul class="list-group list-group-flush">`;

    // for each exercises 'blob' section in each section
    Object.keys(jsonWorkout[key]).forEach(function(key1) {
      // console.log(key);
      // console.log(jsonWorkout[key][key1]["exercise"]);
      let exercise = jsonWorkout[key][key1]["exercise"];
      if (typeof exercise !== "undefined") {
        let bodyListItem = `<li class="list-group-item">${exercise}</li>`;
        bodyShell += bodyListItem;
      } else {
        let exerciseArray = jsonWorkout[key][key1];
        for (var i = 0; i < exerciseArray.length; i++) {
          let arrayExercise = exerciseArray[i].exercise;
          // console.log(arrayExercise);
          let bodyListItem = `<li class="list-group-item">${arrayExercise}</li>`
          bodyShell += bodyListItem
        }
      }
    });
    bodyShell += `</ul>`;

    let iterator = `iterator${key}`;
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
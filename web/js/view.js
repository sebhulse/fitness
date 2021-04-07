async function pageLoad() {
  const params = new URLSearchParams(window.location.search);

  const type = params.get("type");
  const area = params.get("area");
  const level = params.get("level");
  const duration = params.get("duration");

  let response = await handleRequest(duration, type, area, level);
  buildAccordion(response);
}

async function buildAccordion(workout) {
  const jsonWorkout = await JSON.parse(workout);

  Object.keys(jsonWorkout).forEach(function(key) {
    // console.log(key);
    let name = key.charAt(0).toUpperCase() + key.slice(1);
    let bodyShell = `<ul class="list-group list-group-flush">
  <li class="list-group-item">An item</li>
  <li class="list-group-item">A second item</li>
  <li class="list-group-item">A third item</li>
  <li class="list-group-item">A fourth item</li>
  <li class="list-group-item">And a fifth one</li>
</ul>`;

    // Object.keys(jsonWorkout[key]).forEach(function(key1) {
    //     console.log(key1)
    //   }

    let iterator = `iterator${key}`;
    let accordion = `<div class="accordion-item">
            <h2 class="accordion-header" id="headingOne">
              <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#${iterator}" aria-expanded="true" aria-controls="${iterator}">
                ${name}
              </button>
            </h2>
            <div id="${iterator}" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionPlaceholder">
              <div class="accordion-body">
                ${bodyShell}
              </div>
            </div>
          </div>`;
    document
      .getElementById("accordionPlaceholder")
      .insertAdjacentHTML("beforebegin", accordion);
  });

  // for (var i = 0; i < 3; i++) {
  //
  // }
}
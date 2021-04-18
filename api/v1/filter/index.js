const url = "https://fitness.sebhulse.com/data/bodyweight-exercises.json";

async function gatherResponse(response) {
  return await response.json();
}

// checks given exercise section e.g. 'warmup' for exercises in given json object with target area e.g. 'upper' and returns array
function getWarmCoolArea(exercise, area, json) {
  let exercises = [];
  for (var i = 0; i < json[exercise].length; i++) {
    if (json[exercise][i].area.indexOf(area) >= 0) {
      exercises.push(json[exercise][i].name);
    }
  }
  return exercises;
}

// checks workout section for exercises in given json object with given type e.g. 'strength', given level e.g. 'intermediate', given area e.g. 'core' and returns array
function getWorkoutTypeLevelArea(typeIn, levelIn, areaIn, json) {
  let exercises = [];
  for (var i = 0; i < json.workout.length; i++) {
    if (
      json.workout[i].type.indexOf(typeIn) >= 0 &&
      json.workout[i].level.indexOf(levelIn) >= 0 &&
      json.workout[i].area.indexOf(areaIn) >= 0
    ) {
      exercises.push(json.workout[i].name);
    }
  }
  return exercises;
}

async function handleRequest(request) {
  const init = {
    status: 200,
    headers: {
      "content-type": "application/json;charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
    },
  };

  const response = await fetch(url, init);
  const results = await gatherResponse(response);
  const { searchParams } = new URL(request.url);
  let type = searchParams.get("type");
  let level = searchParams.get("level");
  let area = searchParams.get("area");

  if (
    (type == "strength" || type == "cardio") &&
    (level == "beginner" || level == "intermediate" || level == "advanced") &&
    (area == "lower" || area == "upper" || area == "core" || area == "full")
  ) {
    let warmup_area_exercises = getWarmCoolArea("warmup", area, results);
    let cooldown_area_exercises = getWarmCoolArea("cooldown", area, results);
    let workout_exercises = getWorkoutTypeLevelArea(type, level, area, results);
    body = {
      parameters: {
        type: type,
        level: level,
        area: area,
      },
      warmup: warmup_area_exercises,
      workout: workout_exercises,
      cooldown: cooldown_area_exercises,
    };
  } else {
    body = {
      message:
        "Incorrect query parameters. Query parameters should be as follows: type = 'strength' or 'cardio'; level = 'beginner', 'intermediate' or 'advanced'; and area = 'lower', 'upper', 'core' or 'full'",
    };
  }

  let filteredExercises = JSON.stringify(body);

  createdResponse = new Response(filteredExercises, init);
  // createdResponse.headers.set("Access-Con  // createdResponse.headers.set("Access-Control-Allow-Origin", "*")trol-Allow-Origin", "*")

  return createdResponse;
}

addEventListener("fetch", (event) => {
  return event.respondWith(handleRequest(event.request));
});

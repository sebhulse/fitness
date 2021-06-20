let usedWorkoutExercises = [];

async function gatherResponse(response) {
  return await response.json();
}

// get random number between 0 - max (inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// round to nearest multiple of 5
function roundToFive(roundMe) {
  return Math.round(roundMe / 5) * 5;
}

// get rest lengths given the workout type and level - returns rest array in the form [restAfterExercise, exerciseDuration, transitionRest]
function getRest(type, level) {
  let rest = [];
  if (type === "cardio" && level === "beginner") {
    rest = [15, 30, 40];
  } else if (type === "cardio" && level === "intermediate") {
    rest = [10, 30, 40];
  } else if (type === "cardio" && level === "advanced") {
    rest = [5, 40, 30];
  } else if (type === "strength" && level === "beginner") {
    rest = [20, 30, 40];
  } else if (type === "strength" && level === "intermediate") {
    rest = [15, 35, 40];
  } else if (type === "strength" && level === "advanced") {
    rest = [10, 40, 40];
  }
  return rest;
}

// returns int of how many sections the workout should be split up into dependant on input workoutDuration
function getNumWorkoutSections(workoutDuration) {
  let numSections;
  if (workoutDuration < 840) {
    numSections = 2;
  } else if (workoutDuration >= 840 && workoutDuration < 1260) {
    numSections = getRandomInt(2, 4);
  } else if (workoutDuration >= 1260 && workoutDuration < 1800) {
    numSections = getRandomInt(3, 5);
  } else if (workoutDuration >= 1800) {
    numSections = getRandomInt(6, 8);
  }
  return numSections;
}

// get a new unique exercise from usedExercises and (available) exercisesIn
function getNewUniqueExercise(usedExercises, exercisesIn) {
  let activity, number;
  if (usedExercises.length >= exercisesIn.length) {
    number = getRandomInt(0, usedExercises.length - 1);
    activity = usedExercises[number];
  } else {
    do {
      number = getRandomInt(0, exercisesIn.length - 1);
      activity = exercisesIn[number];
    } while (usedExercises.indexOf(activity) >= 0);
  }
  return activity;
}

// strength or cardio
function generateFunWorkoutSection(sectionDurationIn, exercisesIn, rest) {
  let restDur = rest[0]
  let exDur = rest[1]
  let transiDur = rest[2]
  let bodyDuration = exDur + restDur;
  let currentDuration = 0;
  let activitySection = [];
  do {
    let exercise = getNewUniqueExercise(usedWorkoutExercises, exercisesIn);
    usedWorkoutExercises.push(exercise);
    activityBody = {
      ex: exercise,
      du: exDur,
      re: restDur,
    };
    currentDuration += bodyDuration;
    if (currentDuration >= sectionDurationIn) {
      activityBody.re = 0;
      activitySection.push(activityBody);
    } else {
      activitySection.push(activityBody);
    }
  } while (currentDuration < sectionDurationIn);
  transitionBody = {
    ex: "transition",
    du: transiDur,
  };
  activitySection.push(transitionBody);
  return activitySection;
}

// strength
function generatePyramidsWorkoutSection(sectionDurationIn, exercisesIn, rest) {
  let restDur = rest[0]
  let exDur, exercise, bodyDuration;
  let transiDur = rest[2]
  let currentDuration = 0;
  let pyramidsExercises = [];
  let i = 0;
  let exerciseNumber = 0;
  let activitySection = [];
  do {
    if (i % 3 === 0) {
      exercise = getNewUniqueExercise(usedWorkoutExercises, exercisesIn);
      usedWorkoutExercises.push(exercise);
      pyramidsExercises.push(exercise)
      exerciseNumber++
    } else {
      exercise = pyramidsExercises[exerciseNumber - 1]
    }
    if (i % 3 === 0) {
      exDur = roundToFive(rest[1] * 0.5)
    } else if (i % 3 === 1) {
      exDur = rest[1]
    } else {
      exDur = roundToFive(rest[1] * 1.5)
    }
    activityBody = {
      ex: exercise,
      du: exDur,
      re: restDur,
    };
    bodyDuration = exDur + restDur;
    currentDuration += bodyDuration;
    if (currentDuration >= sectionDurationIn) {
      activityBody.re = 0;
      activitySection.push(activityBody);
    } else {
      activitySection.push(activityBody);
    }
    i++
  } while (currentDuration < sectionDurationIn);
  transitionBody = {
    ex: "transition",
    du: transiDur,
  };
  activitySection.push(transitionBody);
  return activitySection;
}

//strength
function generateSupersetsWorkoutSection() {}

// strength
function generateRevPyramidsWorkoutSection(sectionDurationIn, exercisesIn, rest) {
  let restDur = rest[0]
  let exDur, exercise, bodyDuration;
  let transiDur = rest[2]
  let currentDuration = 0;
  let pyramidsExercises = [];
  let i = 0;
  let exerciseNumber = 0;
  let activitySection = [];
  do {
    if (i % 3 === 0) {
      exercise = getNewUniqueExercise(usedWorkoutExercises, exercisesIn);
      usedWorkoutExercises.push(exercise);
      pyramidsExercises.push(exercise)
      exerciseNumber++
    } else {
      exercise = pyramidsExercises[exerciseNumber - 1]
    }
    if (i % 3 === 0) {
      exDur = roundToFive(rest[1] * 1.5)
    } else if (i % 3 === 1) {
      exDur = rest[1]
    } else {
      exDur = roundToFive(rest[1] * 0.5)
    }
    activityBody = {
      ex: exercise,
      du: exDur,
      re: restDur,
    };
    bodyDuration = exDur + restDur;
    currentDuration += bodyDuration;
    if (currentDuration >= sectionDurationIn) {
      activityBody.re = 0;
      activitySection.push(activityBody);
    } else {
      activitySection.push(activityBody);
    }
    i++
  } while (currentDuration < sectionDurationIn);
  transitionBody = {
    ex: "transition",
    du: transiDur,
  };
  activitySection.push(transitionBody);
  return activitySection;
}

// cardio
function generateIntervalsWorkoutSection() {}

// cardio
function generateTabataStyleWorkoutSection(sectionDurationIn, exercisesIn, rest) {
  let restDur = 10
  let exDur = 20
  let transiDur = rest[2]
  let bodyDuration = exDur + restDur;
  let currentDuration = 0;
  let activitySection = [];
  do {
    let exercise = getNewUniqueExercise(usedWorkoutExercises, exercisesIn);
    usedWorkoutExercises.push(exercise);
    activityBody = {
      ex: exercise,
      du: exDur,
      re: restDur,
    };
    currentDuration += bodyDuration;
    if (currentDuration >= sectionDurationIn) {
      activityBody.re = 0;
      activitySection.push(activityBody);
    } else {
      activitySection.push(activityBody);
    }
  } while (currentDuration < sectionDurationIn);
  transitionBody = {
    ex: "transition",
    du: transiDur,
  };
  activitySection.push(transitionBody);
  return activitySection;
}

// strength or cardio
function generateFinisherSection(finisherDuration, rest) {
  let restAfterExercise = rest[0];
  let exerciseDur = rest[1];
  let transitionRest = rest[2];
  let currentDuration = 0;
  let activitySection = [];
  usedExercises = [];
  do {
    let exercise = getNewUniqueExercise(usedExercises, usedWorkoutExercises);
    usedExercises.push(exercise);
    let activityBody = {
      ex: exercise,
      du: transitionRest,
    };
    activitySection.push(activityBody);
    currentDuration += transitionRest;
  } while (currentDuration < finisherDuration);
  let transitionBody = {
    ex: "transition",
    du: transitionRest,
  };
  activitySection.push(transitionBody);
  return activitySection;
}

// takes sectionDuration, exercises array, numWorkoutSections and rest array, chooses workout type, generates main body of workout and returns json
function generateWorkoutSections(
  workoutDuration,
  workoutExercisesIn,
  numWorkoutSections,
  rest,
  typeIn
) {
  let workoutSectionDuration = workoutDuration / numWorkoutSections;
  let activitySection = {};
  let counter = {
    pyramids: 0,
    revPyramids: 0,
    fun: 0,
    tabataStyle: 0
  }
  for (var i = 0; i < numWorkoutSections; i++) {
    if (typeIn === "strength") {
      randNum = getRandomInt(0, 2)
      // strength workout options (randomly selected)
      if (randNum === 0) {
        let workoutSection = generatePyramidsWorkoutSection(
          workoutSectionDuration,
          workoutExercisesIn,
          rest
        );
        let nameOfSection = `pyramids${counter.pyramids + 1}`;
        activitySection[`${nameOfSection}`] = workoutSection;
        counter.pyramids++
      } else if (randNum === 1) {
        let workoutSection = generateFunWorkoutSection(
          workoutSectionDuration,
          workoutExercisesIn,
          rest
        );
        let nameOfSection = `fun${counter.fun + 1}`;
        activitySection[`${nameOfSection}`] = workoutSection;
        counter.fun++
      } else if (randNum === 2) {
        let workoutSection = generateRevPyramidsWorkoutSection(
          workoutSectionDuration,
          workoutExercisesIn,
          rest
        );
        let nameOfSection = `reversePyramids${counter.revPyramids + 1}`;
        activitySection[`${nameOfSection}`] = workoutSection;
        counter.revPyramids++
      }
    } else if (typeIn === "cardio") {
      // cardio workout options (randomly selected)
      randNum = getRandomInt(0, 1)
      if (randNum === 0) {
        let workoutSection = generateFunWorkoutSection(
          workoutSectionDuration,
          workoutExercisesIn,
          rest
        );
        let nameOfSection = `fun${counter.fun + 1}`;
        activitySection[`${nameOfSection}`] = workoutSection;
        counter.fun++
      } else if (randNum === 1) {
        let workoutSection = generateTabataStyleWorkoutSection(
          workoutSectionDuration,
          workoutExercisesIn,
          rest
        );
        let nameOfSection = `tabataStyle${counter.tabataStyle + 1}`;
        activitySection[`${nameOfSection}`] = workoutSection;
        counter.tabataStyle++
      }
    }
  }
  return activitySection;
}

// takes sectionDuration, exercises array, section and rest array, generates warmup or cooldown of workout and returns json
function generateWarmCoolSection(
  sectionDurationIn,
  exercisesIn,
  section,
  rest
) {
  let exerciseDur = rest[1];
  let transitionRest = rest[2];
  let currentDuration = 0;
  let activitySection = [];
  let usedExercises = [];

  do {
    let exercise = getNewUniqueExercise(usedExercises, exercisesIn);
    usedExercises.push(exercise);
    let activityBody = {
      ex: exercise,
      du: exerciseDur,
    };

    activitySection.push(activityBody);
    currentDuration += exerciseDur;
  } while (currentDuration < sectionDurationIn);
  if (section === "warmup") {
    let transitionBody = {
      ex: "transition",
      du: transitionRest,
    };
    activitySection.push(transitionBody);
  }
  return activitySection;
}

// takes duration and exercises and calls section generation functions, returns json with complete workout
function generateWorkout(
  durationIn,
  warmupExercisesIn,
  workoutExercisesIn,
  cooldownExercisesIn,
  rest,
  typeIn
) {
  let warmupDuration = Math.floor(durationIn * 0.1);
  let cooldownDuration = warmupDuration;
  let finisherDuration = Math.floor(durationIn * 0.1);
  let workoutDuration =
    durationIn - warmupDuration - cooldownDuration - finisherDuration;
  let numWorkoutSections = getNumWorkoutSections(workoutDuration);
  let section;

  section = "warmup";
  let warmup = generateWarmCoolSection(
    warmupDuration,
    warmupExercisesIn,
    section,
    rest
  );
  let workout = generateWorkoutSections(
    workoutDuration,
    workoutExercisesIn,
    numWorkoutSections,
    rest,
    typeIn
  );
  let finisher = generateFinisherSection(finisherDuration, rest);
  section = "cooldown";
  let cooldown = generateWarmCoolSection(
    cooldownDuration,
    cooldownExercisesIn,
    section,
    rest
  );
  let body = {
    warmup: warmup,
    ...workout,
    finisher: finisher,
    cooldown: cooldown,
  };
  return body;
}

async function handleRequest(request) {
  const init = {
    status: 200,
    headers: {
      "content-type": "application/json;charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
    },
  };
  const {
    searchParams
  } = new URL(request.url);
  let typeIn = searchParams.get("type");
  let levelIn = searchParams.get("level");
  let areaIn = searchParams.get("area");
  let durationIn = searchParams.get("duration");

  durationIn = parseInt(durationIn);
  let duration = durationIn * 60;

  const url = `https://fitness-v1-filter-production.seb-hulse.workers.dev/?type=${typeIn}&level=${levelIn}&area=${areaIn}`;

  const response = await fetch(url);
  const results = await gatherResponse(response);

  let rest = getRest(typeIn, levelIn);

  // organise the exercises according to inputs
  let warmup_area_exercises = results.warmup;
  let workout_exercises = results.workout;
  let cooldown_area_exercises = results.cooldown;

  let generatedWorkout = generateWorkout(
    duration,
    warmup_area_exercises,
    workout_exercises,
    cooldown_area_exercises,
    rest,
    typeIn
  );

  let created = new Date();
  created = created.toISOString();
  generatedWorkout.parameters = {
    duration: durationIn,
    type: typeIn,
    area: areaIn,
    level: levelIn,
    time: created,
  };

  let generatedWorkout1 = JSON.stringify(generatedWorkout, undefined, 2);

  return new Response(generatedWorkout1, init);
}

addEventListener("fetch", (event) => {
  return event.respondWith(handleRequest(event.request));
});
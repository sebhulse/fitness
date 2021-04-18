let usedWorkoutExercises = []

async function gatherResponse(response) {
  return await response.json()
}

// get random number between 0 - max (inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// get rest lengths given the workout type and level - returns rest array in the form [restAfterExercise, exerciseDuration, transitionRest]
function getRest(type, level) {
  let rest = []
  if (type === 'cardio' && level === 'beginner') {
    rest = [15, 30, 40]
  } else if (type === 'cardio' && level === 'intermediate') {
    rest = [10, 30, 40]
  } else if (type === 'cardio' && level === 'advanced') {
    rest = [5, 40, 30]
  } else if (type === 'strength' && level === 'beginner') {
    rest = [20, 30, 40]
  } else if (type === 'strength' && level === 'intermediate') {
    rest = [15, 35, 40]
  } else if (type === 'strength' && level === 'advanced') {
    rest = [10, 40, 40]
  }
  return rest
}

// returns int of how many sections the workout should be split up into dependant on input workoutDuration
function getNumWorkoutSections(workoutDuration) {
  let numSections
  if (workoutDuration < 840) {
    numSections = 2
  } else if (workoutDuration >= 840 && workoutDuration < 1260) {
    numSections = getRandomInt(2, 4)
  } else if (workoutDuration >= 1260 && workoutDuration < 1800) {
    numSections = getRandomInt(3, 5)
  } else if (workoutDuration >= 1800) {
    numSections = getRandomInt(6, 8)
  }
  return numSections
}

// get a new unique exercise from usedExercises and (available) exercisesIn
function getNewUniqueExercise(usedExercises, exercisesIn) {
  // console.log("unique exercise - used exercises: " + usedExercises.length);
  // console.log("unique exercise - exercises in: " + exercisesIn.length);
  let activity, number
  if (usedExercises.length >= exercisesIn.length) {
    number = getRandomInt(0, usedExercises.length - 1)
    activity = usedExercises[number]
    // console.log("generated from used exercises");
  } else {
    do {
      number = getRandomInt(0, exercisesIn.length - 1)
      // console.log(number);
      activity = exercisesIn[number]
    } while (usedExercises.indexOf(activity) >= 0)
  }
  return activity
}

// checks given exercise section e.g. 'warmup' for exercises in given json object with target area e.g. 'upper' and returns array
function getWarmCoolArea(exercise, area) {
  let exercises = []
  for (var i = 0; i < json[exercise].length; i++) {
    if (json[exercise][i].area.indexOf(area) >= 0) {
      exercises.push(json[exercise][i].name)
    }
  }
  return exercises
}

// checks workout section for exercises in given json object with given type e.g. 'strength', given level e.g. 'intermediate', given area e.g. 'core' and returns array
function getWorkoutTypeLevelArea(typeIn, levelIn, areaIn) {
  let exercises = []
  for (var i = 0; i < json.workout.length; i++) {
    if (
      json.workout[i].type.indexOf(typeIn) >= 0 &&
      json.workout[i].level.indexOf(levelIn) >= 0 &&
      json.workout[i].area.indexOf(areaIn) >= 0
    ) {
      exercises.push(json.workout[i].name)
    }
  }
  return exercises
}

// strength or cardio
function generateFunWorkoutSection(sectionDurationIn, exercisesIn, rest) {
  let restAfterExercise = rest[0]
  let exerciseDur = rest[1]
  let transitionRest = rest[2]
  let bodyDuration = exerciseDur + restAfterExercise
  let currentDuration = 0
  let activitySection = []

  do {
    let exercise = getNewUniqueExercise(usedWorkoutExercises, exercisesIn)
    usedWorkoutExercises.push(exercise)

    activityBody = {
      exercise: exercise,
      duration: exerciseDur,
    }
    restBody = {
      exercise: 'rest',
      duration: restAfterExercise,
    }

    if (currentDuration === 0) {
      activitySection.push(activityBody)
    } else {
      activitySection.push(restBody)
      activitySection.push(activityBody)
    }

    currentDuration += bodyDuration
  } while (currentDuration < sectionDurationIn)
  transitionBody = {
    exercise: 'transition',
    duration: transitionRest,
  }

  activitySection.push(transitionBody)
  return activitySection
}

// strength or cardio
function generateFinisherSection(finisherDuration, rest) {
  let restAfterExercise = rest[0]
  let exerciseDur = rest[1]
  let transitionRest = rest[2]
  let currentDuration = 0
  let activitySection = []
  usedExercises = []

  do {
    let exercise = getNewUniqueExercise(usedExercises, usedWorkoutExercises)
    usedExercises.push(exercise)
    let activityBody = {
      exercise: exercise,
      duration: transitionRest,
    }

    activitySection.push(activityBody)
    currentDuration += transitionRest
  } while (currentDuration < finisherDuration)
  let transitionBody = {
    exercise: 'transition',
    duration: transitionRest,
  }

  activitySection.push(transitionBody)

  return activitySection
}

// strength
function generateSupersetsWorkoutSection() {}

// strength
function generatePyramidsWorkoutSection() {}

// strength
function generateRevPyramidsWorkoutSection() {}

// cardio
function generateIntervalsWorkoutSection() {}

// cardio
function generateIntervalsWorkoutSection() {}

// takes sectionDuration, exercises array, numWorkoutSections and rest array, chooses workout type, generates main body of workout and returns json
function generateWorkoutSection(
  workoutDuration,
  workoutExercisesIn,
  numWorkoutSections,
  rest,
) {
  let workoutType
  let workoutSectionDuration = workoutDuration / numWorkoutSections
  let activitySection = []

  for (var i = 0; i < numWorkoutSections; i++) {
    let workoutSection = generateFunWorkoutSection(
      workoutSectionDuration,
      workoutExercisesIn,
      rest,
    )

    activitySection.push(workoutSection)
  }
  return activitySection
}

// takes sectionDuration, exercises array, section and rest array, generates warmup or cooldown of workout and returns json
function generateWarmCoolSection(
  sectionDurationIn,
  exercisesIn,
  section,
  rest,
) {
  let exerciseDur = rest[1]
  let transitionRest = rest[2]
  let currentDuration = 0
  let activitySection = []
  let usedExercises = []

  do {
    let exercise = getNewUniqueExercise(usedExercises, exercisesIn)
    usedExercises.push(exercise)
    let activityBody = {
      exercise: exercise,
      duration: exerciseDur,
    }

    activitySection.push(activityBody)
    currentDuration += exerciseDur
  } while (currentDuration < sectionDurationIn)
  if (section === 'warmup') {
    let transitionBody = {
      exercise: 'transition',
      duration: transitionRest,
    }

    activitySection.push(transitionBody)
  }
  return activitySection
}

// takes duration and exercises and calls section generation functions, returns json with complete workout
function generateWorkout(
  durationIn,
  warmupExercisesIn,
  workoutExercisesIn,
  cooldownExercisesIn,
  rest,
  duration,
  typeIn,
  areaIn,
  levelIn,
) {
  let warmupDuration = Math.floor(durationIn * 0.1)
  // console.log(warmupDuration)
  let cooldownDuration = warmupDuration
  let finisherDuration = Math.floor(durationIn * 0.1)
  let workoutDuration =
    durationIn - warmupDuration - cooldownDuration - finisherDuration
  let numWorkoutSections = getNumWorkoutSections(workoutDuration)
  let section

  // this will be passed to generateFinisherSection() to generate finisher based on exercises already done
  section = 'warmup'
  let warmup = generateWarmCoolSection(
    warmupDuration,
    warmupExercisesIn,
    section,
    rest,
  )
  let workout = generateWorkoutSection(
    workoutDuration,
    workoutExercisesIn,
    numWorkoutSections,
    rest,
  )
  let finisher = generateFinisherSection(finisherDuration, rest)
  section = 'cooldown'
  let cooldown = generateWarmCoolSection(
    cooldownDuration,
    cooldownExercisesIn,
    section,
    rest,
  )
  let created = new Date()

  let body = {
    parameters: {
      duration: parseInt(duration),
      type: typeIn,
      area: areaIn,
      level: levelIn,
      time: created,
    },
    warmup: warmup,
    workout: workout,
    finisher: finisher,
    cooldown: cooldown,
  }
  return body
}

async function handleRequest(request) {
  const {
    searchParams
  } = new URL(request.url)
  let typeIn = searchParams.get('type')
  let levelIn = searchParams.get('level')
  let areaIn = searchParams.get('area')
  let durationIn = searchParams.get('duration')

  durationIn = parseInt(durationIn)
  let duration = durationIn * 60

  const url = `https://fitness-filter-production.seb-hulse.workers.dev/?type=${typeIn}&level=${levelIn}&area=${areaIn}`

  const response = await fetch(url)
  const results = await gatherResponse(response)

  let rest = getRest(typeIn, levelIn)

  // organise the exercises according to inputs
  let warmup_area_exercises = results.warmup
  let workout_exercises = results.workout
  let cooldown_area_exercises = results.cooldown

  let generatedWorkout = generateWorkout(
    duration,
    warmup_area_exercises,
    workout_exercises,
    cooldown_area_exercises,
    rest,
    durationIn,
    typeIn,
    areaIn,
    levelIn,
  )

  let generatedWorkout1 = JSON.stringify(generatedWorkout)

  return new Response(generatedWorkout1)
}

addEventListener('fetch', (event) => {
  return event.respondWith(handleRequest(event.request))
})
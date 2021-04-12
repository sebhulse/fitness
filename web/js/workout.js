// Workout class
class Workout {

  constructor(duration, type, area, level) {
    this.duration = duration * 60;
    this.type = type;
    this.area = area;
    this.level = level;

    this.url = `https://api.sebhulse.com/filter/?type=${this.type}&level=${this.level}&area=${this.area}`;
    this.exerciseList;
    this.usedWorkoutExercises = [];

    this.rest = getRest(this.type, this.level);
    this.warmup_area_exercises;
    this.workout_exercises;
    this.cooldown_area_exercises;
  };


  async getExerciseList() {
    const response = await fetch(this.url);
    const results = response.json();

    // filter the exercises according to inputs
    this.warmup_area_exercises = results.warmup;
    this.workout_exercises = results.workout;
    this.cooldown_area_exercises = results.cooldown;
  }

  // get random number between 0 - max (inclusive)
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // get rest lengths given the workout type and level - returns rest array in the form [restAfterExercise, exerciseDuration, transitionRest]
  getRest(type, level) {
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
  getNumWorkoutSections(workoutDuration) {
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
  getNewUniqueExercise(usedExercises, exercisesIn) {
    do {
      number = getRandomInt(0, exercisesIn.length);
      activity = exercisesIn[number];
    } while (usedExercises.indexOf(activity) >= 0);
    return activity;
  }

  // checks given exercise section e.g. 'warmup' for exercises in given json object with target area e.g. 'upper' and returns array
  getWarmCoolArea(exercise, area) {
    let exercises = [];
    for (var i = 0; i < json[exercise].length; i++) {
      if (json[exercise][i].area.indexOf(area) >= 0) {
        exercises.push(json[exercise][i].name);
      }
    }
    return exercises;
  }

  // checks workout section for exercises in given json object with given type e.g. 'strength', given level e.g. 'intermediate', given area e.g. 'core' and returns array
  getWorkoutTypeLevelArea(typeIn, levelIn, areaIn) {
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

  // strength or cardio
  generateFunWorkoutSection(sectionDurationIn, exercisesIn, rest) {
    let restAfterExercise = rest[0];
    let exerciseDur = rest[1];
    let transitionRest = rest[2];
    let bodyDuration = exerciseDur + restAfterExercise;
    let currentDuration = 0;
    let activitySection = [];

    do {
      let exercise = getNewUniqueExercise(usedWorkoutExercises, exercisesIn);
      usedWorkoutExercises.push(exercise);

      activityBody = {
        exercise: exercise,
        duration: exerciseDur,
      };
      restBody = {
        exercise: "rest",
        duration: restAfterExercise,
      };

      if (currentDuration === 0) {
        activitySection.push(activityBody);
      } else {
        activitySection.push(restBody);
        activitySection.push(activityBody);
      }

      currentDuration += bodyDuration;
    } while (currentDuration < sectionDurationIn);
    transitionBody = {
      exercise: "transition",
      duration: transitionRest,
    };

    activitySection.push(transitionBody);
    return activitySection;
  }

  // strength or cardio
  generateFinisherSection(finisherDuration, rest) {
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
        exercise: exercise,
        duration: transitionRest,
      };

      activitySection.push(activityBody);
      currentDuration += transitionRest;
    } while (currentDuration < finisherDuration);
    let transitionBody = {
      exercise: "transition",
      duration: transitionRest,
    };

    activitySection.push(transitionBody);

    return activitySection;
  }

  // strength
  generateSupersetsWorkoutSection() {}

  // strength
  generatePyramidsWorkoutSection() {}

  // strength
  generateRevPyramidsWorkoutSection() {}

  // cardio
  generateIntervalsWorkoutSection() {}

  // cardio
  generateIntervalsWorkoutSection() {}

  // takes sectionDuration, exercises array, numWorkoutSections and rest array, chooses workout type, generates main body of workout and returns json
  generateWorkoutSection(
    workoutDuration,
    workoutExercisesIn,
    numWorkoutSections,
    rest
  ) {
    let workoutType;
    let workoutSectionDuration = workoutDuration / numWorkoutSections;
    let activitySection = [];

    for (var i = 0; i < numWorkoutSections; i++) {
      let workoutSection = generateFunWorkoutSection(
        workoutSectionDuration,
        workoutExercisesIn,
        rest
      );

      activitySection.push(workoutSection);
    }
    return activitySection;
  }

  // takes sectionDuration, exercises array, section and rest array, generates warmup or cooldown of workout and returns json
  generateWarmCoolSection(
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
        exercise: exercise,
        duration: exerciseDur,
      };

      activitySection.push(activityBody);
      currentDuration += exerciseDur;
    } while (currentDuration < sectionDurationIn);
    if (section === "warmup") {
      let transitionBody = {
        exercise: "transition",
        duration: transitionRest,
      };

      activitySection.push(transitionBody);
    }
    return activitySection;
  }

  // takes duration and exercises and calls section generation functions, returns json with complete workout
  generateWorkout(
    durationIn,
    warmupExercisesIn,
    workoutExercisesIn,
    cooldownExercisesIn,
    rest
  ) {
    let warmupDuration = Math.floor(durationIn * 0.1);
    // console.log(warmupDuration)
    let cooldownDuration = warmupDuration;
    let finisherDuration = Math.floor(durationIn * 0.1);
    let workoutDuration =
      durationIn - warmupDuration - cooldownDuration - finisherDuration;
    let numWorkoutSections = getNumWorkoutSections(workoutDuration);
    let section;

    // this will be passed to generateFinisherSection() to generate finisher based on exercises already done
    section = "warmup";
    let warmup = generateWarmCoolSection(
      warmupDuration,
      warmupExercisesIn,
      section,
      rest
    );
    let workout = generateWorkoutSection(
      workoutDuration,
      workoutExercisesIn,
      numWorkoutSections,
      rest
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
      workout: workout,
      finisher: finisher,
      cooldown: cooldown,
    };
    return body;
  }


  main() {
    await getExerciseList()
    let generatedWorkout = generateWorkout(
      this.duration,
      this.warmup_area_exercises,
      this.workout_exercises,
      this.cooldown_area_exercises,
      this.rest
    );

    let generatedWorkout1 = JSON.stringify(generatedWorkout);

    return (generatedWorkout1)
  }

}
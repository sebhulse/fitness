const workout = {
  "warmup": [{
    "ex": "Deep Squat with Arms Overhead",
    "du": 30
  }, {
    "ex": "Torso Twist",
    "du": 30
  }, {
    "ex": "Skips",
    "du": 30
  }, {
    "ex": "Alternating Reverse Lunge with Knee Drive",
    "du": 30
  }, {
    "ex": "Plank Toe Taps",
    "du": 30
  }, {
    "ex": "Slow Mountain Climbers",
    "du": 30
  }, {
    "ex": "transition",
    "du": 40
  }],
  "reversePyramids1": [{
    "ex": "Slow Mountain Climbers",
    "du": 45,
    "re": 20
  }, {
    "ex": "Slow Mountain Climbers",
    "du": 30,
    "re": 20
  }, {
    "ex": "Slow Mountain Climbers",
    "du": 15,
    "re": 20
  }, {
    "ex": "Wide Squat Jump",
    "du": 45,
    "re": 20
  }, {
    "ex": "Wide Squat Jump",
    "du": 30,
    "re": 20
  }, {
    "ex": "Wide Squat Jump",
    "du": 15,
    "re": 20
  }, {
    "ex": "Side Plank",
    "du": 45,
    "re": 0
  }, {
    "ex": "transition",
    "du": 40
  }],
  "reversePyramids2": [{
    "ex": "Flutter Kicks",
    "du": 45,
    "re": 20
  }, {
    "ex": "Flutter Kicks",
    "du": 30,
    "re": 20
  }, {
    "ex": "Flutter Kicks",
    "du": 15,
    "re": 20
  }, {
    "ex": "Kneeling Fast Wide Push Up",
    "du": 45,
    "re": 20
  }, {
    "ex": "Kneeling Fast Wide Push Up",
    "du": 30,
    "re": 20
  }, {
    "ex": "Kneeling Fast Wide Push Up",
    "du": 15,
    "re": 20
  }, {
    "ex": "Tricep Dips with Toe Tap",
    "du": 45,
    "re": 0
  }, {
    "ex": "transition",
    "du": 40
  }],
  "pyramids1": [{
    "ex": "Squat with High Knee",
    "du": 15,
    "re": 20
  }, {
    "ex": "Squat with High Knee",
    "du": 30,
    "re": 20
  }, {
    "ex": "Squat with High Knee",
    "du": 45,
    "re": 20
  }, {
    "ex": "Ab Bicycle with Rotation",
    "du": 15,
    "re": 20
  }, {
    "ex": "Ab Bicycle with Rotation",
    "du": 30,
    "re": 20
  }, {
    "ex": "Ab Bicycle with Rotation",
    "du": 45,
    "re": 20
  }, {
    "ex": "Sumo Squat Hold",
    "du": 15,
    "re": 0
  }, {
    "ex": "transition",
    "du": 40
  }],
  "pyramids2": [{
    "ex": "Ab Crunch",
    "du": 15,
    "re": 20
  }, {
    "ex": "Ab Crunch",
    "du": 30,
    "re": 20
  }, {
    "ex": "Ab Crunch",
    "du": 45,
    "re": 20
  }, {
    "ex": "Arms Overhead Squat",
    "du": 15,
    "re": 20
  }, {
    "ex": "Arms Overhead Squat",
    "du": 30,
    "re": 20
  }, {
    "ex": "Arms Overhead Squat",
    "du": 45,
    "re": 20
  }, {
    "ex": "Bent Leg Raises",
    "du": 15,
    "re": 0
  }, {
    "ex": "transition",
    "du": 40
  }],
  "finisher": [{
    "ex": "Flutter Kicks",
    "du": 40
  }, {
    "ex": "Slow Mountain Climbers",
    "du": 40
  }, {
    "ex": "Tricep Dips with Toe Tap",
    "du": 40
  }, {
    "ex": "Ab Bicycle with Rotation",
    "du": 40
  }, {
    "ex": "Wide Squat Jump",
    "du": 40
  }, {
    "ex": "transition",
    "du": 40
  }],
  "cooldown": [{
    "ex": "Ab Stretch Out",
    "du": 30
  }, {
    "ex": "Upper Back Stretch",
    "du": 30
  }, {
    "ex": "Calf Stretch",
    "du": 30
  }, {
    "ex": "Wide Feet Hamstring Stretch",
    "du": 30
  }, {
    "ex": "Torso Twist",
    "du": 30
  }, {
    "ex": "Lunge with Rotation Stretch",
    "du": 30
  }],
  "parameters": {
    "duration": 30,
    "type": "strength",
    "area": "full",
    "level": "beginner",
    "time": "2021-09-24T20:36:28.205Z"
  }
}

// change of plan again - minimal simple html elements and update the innerHTML text based on timeline progress

// TODO - animate rectangles based on progress of timeline (progress, totalProgress) using callbacks (onStart) and update duration left

const heading = document.querySelector("#heading")
const heading1 = document.querySelector("#heading1")
const heading2 = document.querySelector("#heading2")
const exerciseTimer1 = document.querySelector("#exerciseTimer1")
const exerciseTimer2 = document.querySelector("#exerciseTimer2")

let workoutLength = 0
let totalWorkoutLength = 0
let scaleY = 100

function setHeadingText(text) {
  heading.innerHTML = wordToUpperCase(text)
}

function setHeading1Text(text) {
  heading1.innerHTML = wordToUpperCase(text)
}

function setHeading2Text(text) {
  heading2.innerHTML = text + "s"
}

function calcTotalWorkoutLength() {
  for (let key in workout) {
    totalWorkoutLength += 2
    for (let keyInner in workout[key]) {
      if (key != "parameters") {
        totalWorkoutLength += workout[key][keyInner].du
      }
    }
  }
}

calcTotalWorkoutLength()

let headingTl = gsap.timeline()
let heading1Tl = gsap.timeline()
let heading2Tl = gsap.timeline()
let exerciseTimerTl = gsap.timeline()
let exerciseTimerT2 = gsap.timeline()

exerciseTimerTl.to(exerciseTimer1, {
  yPercent: 100,
  duration: totalWorkoutLength,
  ease: "linear"
})

// adds to all timelines - heading1 and heading2 at the same time
function addToTl(text, duration) {

  heading1Tl.fromTo(heading1, {
    rotation: 0
  }, {
    rotation: 360,
    ease: "elastic",
    onStart: setHeading1Text,
    onStartParams: [text],
  }, workoutLength)

  heading2Tl.to(heading2, {
    ease: "elastic",
    onStart: setHeading2Text,
    onStartParams: [duration],
  }, workoutLength)

  exerciseTimerT2.to(exerciseTimer2, {
    yPercent: scaleY,
    duration: duration,
    ease: "linear",
    onStart: timer1,
    onStartParams: [duration],
  }, workoutLength)

  workoutLength += duration
  if (scaleY === 0) {
    scaleY = 100
  } else {
    scaleY = 0
  }
}

function addToHeadingTl(text, duration) {
  headingTl.fromTo(heading, {
    rotation: 0
  }, {
    rotation: 360,
    ease: "elastic",
    onStart: setHeadingText,
    onStartParams: [text],
  }, workoutLength)
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function timer1(duration) {
  for (let i = duration - 1; i > 0; i--) {
    await sleep(1000);
    setHeading2Text(i)
  }
}

// loops through workout and adds to timeline
function createFullTimeline() {
  for (let key in workout) {
    let duration = 2
    addToHeadingTl(key, duration)
    for (let keyInner in workout[key]) {
      if (key != "parameters") {
        let name = workout[key][keyInner].ex
        let duration = workout[key][keyInner].du
        addToTl(name, duration)
      }
    }
  }
}

createFullTimeline()

// first letter of string to uppercase and insert spaces between lower case letters, upper case letters and numbers
function wordToUpperCase(word) {
  let wordUpper = word.charAt(0).toUpperCase() + word.slice(1);
  return wordUpper.replace(/([a-z0-9])([A-Z0-9])/g, '$1 $2');
}

const workout = {
    "warmup": [
        {
            "ex": "Slow Walkout / Overhead Reach",
            "du": 3
        },
        {
            "ex": "transition",
            "du": 4
        }
    ],
    "reversePyramids1": [
        {
            "ex": "Walk Out with Push Up",
            "du": 4,
            "re": 2
        },
        {
            "ex": "Walk Out with Push Up",
            "du": 3,
            "re": 0
        },
        {
            "ex": "transition",
            "du": 4
        }
    ],
    "fun1": [
        {
            "ex": "Glute Bridge",
            "du": 3,
            "re": 2
        },
        {
            "ex": "Butterfly Sit-up",
            "du": 3,
            "re": 2
        },
        {
            "ex": "Slow Tempo Squat",
            "du": 3,
            "re": 0
        },
        {
            "ex": "transition",
            "du": 4
        }
    ],
    "finisher": [
        {
            "ex": "Glute Bridge",
            "du": 4
        },
        {
            "ex": "transition",
            "du": 4
        }
    ],
    "cooldown": [
        {
            "ex": "Seated Side Stretch",
            "du": 3
        }
    ],
    "parameters": {
        "duration": 5,
        "type": "strength",
        "area": "full",
        "level": "beginner",
        "time": "2021-08-09T21:38:03.926Z"
    }
}

// change of plan again - minimal simple html elements and update the innerHTML text based on timeline progress

// TODO - animate rectangles based on progress of timeline (progress, totalProgress) using callbacks (onStart) and update duration left

const heading1 = document.querySelector("#heading1")
const heading2 = document.querySelector("#heading2")
const exerciseTimer1 = document.querySelector("#exerciseTimer1")
const exerciseTimer2 = document.querySelector("#exerciseTimer2")

let workoutLength = 0
let totalWorkoutLength = 0
let scaleY = 100

function setHeading1Text(text) {
  heading1.innerHTML = wordToUpperCase(text)
}

function setHeading2Text(text) {
  heading2.innerHTML = text + " seconds"
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



let heading1Tl = gsap.timeline()
let heading2Tl = gsap.timeline()
let exerciseTimerTl = gsap.timeline()
let exerciseTimerT2 = gsap.timeline()

exerciseTimerTl.to(exerciseTimer1,
  {
  yPercent: 100,
  duration: totalWorkoutLength,
  ease: "linear"
})

// adds to both timelines - heading1 and heading2 at the same time
function addToTl(text, duration) {
  heading1Tl.fromTo(heading1, {
    rotation: 0
    }, {
      rotation: 360,
      ease: "elastic",
      onStart: setHeading1Text,
      onStartParams: [text],
    }, workoutLength
  )

  heading2Tl.to(heading2,
    {
      ease: "elastic",
      onStart: setHeading2Text,
      onStartParams: [duration],
    }, workoutLength
  )

  exerciseTimerT2.to(exerciseTimer2,
    {
    yPercent: scaleY,
    duration: duration,
    ease: "linear"
  }, workoutLength)

workoutLength += duration
if (scaleY === 0) {
  scaleY = 100
} else {
  scaleY = 0
}
}

// loops through workout and adds to timeline
function createFullTimeline() {
  for (let key in workout) {
    let duration = 2
    addToTl(key, duration)
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

console.log(workoutLength);

// first letter of string to uppercase and insert spaces between lower case letters, upper case letters and numbers
function wordToUpperCase(word) {
  let wordUpper = word.charAt(0).toUpperCase() + word.slice(1);
  return wordUpper.replace(/([a-z0-9])([A-Z0-9])/g, '$1 $2');
}

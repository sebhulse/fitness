
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
let workoutLength = 0

function setHeading1Text(text) {
  heading1.innerHTML = wordToUpperCase(text)
}

function setHeading2Text(text) {
  heading2.innerHTML = text + " seconds"
}

let heading1Tl = gsap.timeline()
let heading2Tl = gsap.timeline()

// adds to both timelines - heading1 and heading2 at the same time
function addToTl(text, duration) {
  heading1Tl.fromTo(heading1, {
    rotation: 0
  },
  {
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
workoutLength += duration
console.log(workoutLength);
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

// first letter of string to uppercase and insert spaces between lower case letters, upper case letters and numbers
function wordToUpperCase(word) {
  let wordUpper = word.charAt(0).toUpperCase() + word.slice(1);
  return wordUpper.replace(/([a-z0-9])([A-Z0-9])/g, '$1 $2');
}

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollToPlugin);

const workout = {
    "warmup": [
        {
            "ex": "Slow Walkout / Overhead Reach",
            "du": 30
        },
        {
            "ex": "transition",
            "du": 40
        }
    ],
    "reversePyramids1": [
        {
            "ex": "Walk Out with Push Up",
            "du": 45,
            "re": 20
        },
        {
            "ex": "Walk Out with Push Up",
            "du": 30,
            "re": 0
        },
        {
            "ex": "transition",
            "du": 40
        }
    ],
    "fun1": [
        {
            "ex": "Glute Bridge",
            "du": 30,
            "re": 20
        },
        {
            "ex": "Butterfly Sit-up",
            "du": 30,
            "re": 20
        },
        {
            "ex": "Slow Tempo Squat",
            "du": 30,
            "re": 0
        },
        {
            "ex": "transition",
            "du": 40
        }
    ],
    "finisher": [
        {
            "ex": "Glute Bridge",
            "du": 40
        },
        {
            "ex": "transition",
            "du": 40
        }
    ],
    "cooldown": [
        {
            "ex": "Seated Side Stretch",
            "du": 30
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

// change of plan - generate all html elements as they should be on one HTML page (one exercise/event per page viewport),
// then scrolltigger/animate sequentially based on central(?) timer

// TODO: control animation on play button and change animation to move viewport when tween on timeline is complete





let tl = gsap.timeline()


// create basic html using sections titles in data, with appropriate classes
let index = 0
function createIntro() {
  for (let key in workout) {
    generatePanel(wordToUpperCase(key))
    for (let keyInner in workout[key]) {
      if (key != "parameters") {
        let name = workout[key][keyInner].ex
        generatePanel(wordToUpperCase(name))
      }
    }
  }
}

function generatePanel(key) {
  let section = document.createElement("section")
  let h1 = document.createElement("h1")
  h1.innerHTML = key
  section.classList = `panel trigger-${index}`;
  section.id = `realtimeAnimationSection`
  let line = document.createElement("span")
  line.classList = `line line-${index}`
  h1.appendChild(line)
  section.appendChild(h1)
  realtimeAnimation.appendChild(section)

  // console.log(`.line-${(index+1)}`);
  tl.to(`.line-${index}`, {
    scaleX: 0,
    transformOrigin: "left center",
    ease: "none",
    duration: 1,
    // scrollTo: "#trigger-3"
  })
// let element = document.getElementById('trigger-3');
  let trig = `#trigger-${index}`
  tl.to(window, {
    scrollTo: {
      y: ".trigger-3"
    }
  })

  // gsap.to(window, {
  // scrollTo: {
  //   x: ".page2"
  // }

  index++
}

createIntro()

// Local variable.
let _maxHeight = 0;

// Const assignment.
const _scrollContainer = "#realtimeAnimation";
const _scrollContainerPage = gsap.utils.toArray("#realtimeAnimationSection");

// Get maximum width to scroll
const getMaxHeight = () => {
  _maxHeight = 0;
  _scrollContainerPage.forEach((section) => (_maxHeight += section.offsetHeight));
};

getMaxHeight()
// console.log(_scrollContainerPage);

// Event listener.
ScrollTrigger.addEventListener("refreshInit", getMaxHeight);

// ScrollTrigger.defaults({
//   toggleActions: "restart pause resume pause",
//   scroller: ".container"
// });

console.log(_scrollContainerPage.length);
// Animate to given section.
gsap.to(_scrollContainerPage, {
  yPercent: -100 * (_scrollContainerPage.length - 1),
  // ease: "power3.inOut",
  scrollTrigger: {
    trigger: _scrollContainer,
    pin: true,
    scrub: 0.3,
    start: "top top",
    end: `+=${_maxHeight}`,
    invalidateOnRefresh: true,
    anticipatePin: 1
  }
});

// function togglePlay() {
//   tl.play()
// }



// first letter of string to uppercase and insert spaces between lower case letters, upper case letters and numbers
function wordToUpperCase(word) {
  let wordUpper = word.charAt(0).toUpperCase() + word.slice(1);
  return wordUpper.replace(/([a-z0-9])([A-Z0-9])/g, '$1 $2');
}

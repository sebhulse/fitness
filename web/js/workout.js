// Workout class
class Workout {

  constructor(duration, type, area, level) {
    this.duration = duration * 60;
    this.type = type;
    this.area = area;
    this.level = level;

    this.url = `https://api.sebhulse.com/filter/?type=${this.type}&level=${this.level}&area=${this.area}`;
    this.exerciseList;
  };


  async getExerciseList() {
    const response = await fetch(url);
    const results = await response.json();

  }

  // Adding a method to the constructor
  greet() {
    return `${this.name} says hello.`;
  }
}
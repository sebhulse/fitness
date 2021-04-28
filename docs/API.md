# API

### API V1

The intention of this API is to introduce a convenient way to access the data hosted at [fitness.sebhulse.com/data/bodyweight-exercises.json](http://fitness.sebhulse.com/data/bodyweight-exercises.json). 

No auth is required to access the API and it is provided as is. I'd ask that you use the API respectfully since there are limits on the total requests per day and I'd like as many people as possible to have access to it. 

Having got that out of the way, please reach out if you've made something cool - I'd love to know!

### Endpoints

There are currently two endpoints of which both require URL parameters:

1. [api.sebhulse.com/v1/filter](http://api.sebhulse.com/v1/filter) and 
2. [api.sebhulse.com/v1/workout](http://api.sebhulse.com/v1/workout)

### Filter

This endpoint is intended to filter the [raw exercises data](http://fitness.sebhulse.com/data/bodyweight-exercises.json) with the following parameters: `type`, `level` and `area`. 

Options are:

```json
type: strength, cardio
level: beginner, intermediate, advanced
area: full, upper, lower, core
```

A GET request to [api.sebhulse.com/v1/filter](http://api.sebhulse.com/v1/filter) would look something like this:

```json
[api.sebhulse.com/v1/filter](http://api.sebhulse.com/v1/filter)/?type=strength&area=full&level=beginner
```

The successful response would look something like this:

```json
{
    "parameters": {
        "type": "strength",
        "level": "beginner",
        "area": "full"
    },
    "warmup": [
        "Leg Kicks",
        "Walking High Knees",
				// ... additional warmup exercises ...
    ],
    "workout": [
        "Bent Leg Raises",
        "Ab Scissors",
				// ... additional workout exercises ...
    ],
    "cooldown": [
        "Arm Overhead Side Stretch",
        "Shoulder Stretch",
        // ... additional cooldown exercises here ... 
    ]
}
```

With `parameters`, `warmup`, `workout` and `cooldown` keys.

A query with incorrect parameters returns:

```json
{
    "message": "Incorrect query parameters. Query parameters should be as follows: type = 'strength' or 'cardio'; level = 'beginner', 'intermediate' or 'advanced'; and area = 'lower', 'upper', 'core' or 'full'"
}
```

### Workout

Now the endpoint you're really interested in! This is intended to return an algorithmic random-ish generated workout. 

This endpoint is currently still in development and is therefore still evolving so I won't put any strict documentation here yet. Instead, if you'd like to play around with it, you can hit the end point with the same input parameters as above (`type`, `level` and `area`) with the additional parameter `duration` in minutes to specify how long you would like the workout to be. This endpoint calls the filter endpoint within it to access the filtered exercises.

A GET request to [api.sebhulse.com/v1/workout](http://api.sebhulse.com/v1/workout) would look something like this: 

```json
[api.sebhulse.com/v1/workout](http://api.sebhulse.com/v1/workout)/?type=strength&area=full&level=beginner&duration=30
```
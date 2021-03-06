## Data

This tool is built on an **open-source** JSON dataset for bodyweight exercises and is hosted at [fitness.sebhulse.com/data/bodyweight-exercises.json](https://fitness.sebhulse.com/data/bodyweight-exercises.json). Please feel free to use it in your own projects under the CC BY 4.0 license.

**Contribution to this dataset is encouraged by writing informative descriptions for each of the exercises in the database! People with personal training fitness qualifications and industry knowledge are preferred for this purpose.**

There is scope to add to this resource with additional exercises requiring equipment. Please open an issue if you would like to contribute!

This work is licensed under a [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/) (CC BY 4.0).

The data is split into `warmup`, `workout` and `cooldown` exercises and comprises the following keys for each exercise: `id`, `name`, `description`, `type`, `level` and `area`.

`warmup` and `cooldown` exercises do not have `type` or `level` keys.

### Example

```json
{  
"id": 0,  
"name": "Squats",  
"description": "Place your feet shoulder width apart. With your back straight, squat down and when your quads are parallel with the floor, drive up through your heels to the starting point.",  
"type": ["cardio", "strength"],  
"level": ["beginner", "intermediate", "advanced"],  
"area": ["core", "upper", "lower", "full"]
}
```

This example shows the default values for the `type`, `level` and `area` keys of the exercise. In the actual dataset, these values for the Squats exercise are deleted as appropriate. The description is provided as a reference for future descriptions in the dataset.

**Where**:

- `id` is the zero-indexed number from the first `warmup` exercise to the last `cooldown` exercise.
- `name` is the name of the exercise. Max 50 characters.
- `description` is an informative description of the exercise. Max 300 characters.
- `type` indicates whether the exercise is suitable for `cardio` and/or `strength` workouts. It is an array with `cardio` and `strength` as the default values. These are deleted as appropriate for the exercise.
- `level` indicates whether the level of difficulty of the exercise is `beginner` and/or `intermediate` and/or `advanced`. It is an array with `beginner`, `intermediate` and `advanced` as the default values. These are deleted as appropriate for the exercise.
- `area` indicates the target body area of the exercise. It is an array with `core`, `upper`, `lower` and `full` as the default values. These are deleted as appropriate for the exercise.

For the `type`, `level` and `area` keys, the values are any combination of the default values above, as deemed most appropriate to the exercise.

See the [API](/api.html) page for more information on how to take advantage of this data in a convenient way.

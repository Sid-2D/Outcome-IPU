### Available routes:-
1. `GET /:RollNumber` - Returns array of all available results of student. 
2. `POST /rank` - Requires json body with `Examination`, `Semester`, `Programme`, `Batch`, `CollegeCode` parameters set.
                  Returns the classwise result.
2. `GET /download` - HTML page consisting of links of any new results posted on official IPU website.  
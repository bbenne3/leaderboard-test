# leaderboard-test

## How To Run
From root directory run
1. `yarn install`
    - installs all dependencies for **server** and **web** apps
2. `yarn db:seed`
    - Seeds the **file system** database with 250 leaders
3. `yarn dev`
    - spins up the api server on http://localhost:3003 and web server on http://localhost:3000


## Some Improvements
- Implement validation middleware and validate requests to api's
    - use **Zod** or **yup** for schema validation.
- Caching (HTTP Caching / App Caching) with invalidation when leaders change rank/scores.

- Breakout Web React Page into multiple components for better readibility
- Input sanitation
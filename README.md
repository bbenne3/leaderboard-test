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

<img width="1277" alt="Screen Shot 2022-10-01 at 10 32 14 PM" src="https://user-images.githubusercontent.com/10772407/193435318-b9be77df-6066-4a76-8671-82639f1de6ad.png">

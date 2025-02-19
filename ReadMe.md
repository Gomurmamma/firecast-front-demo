To develop the application or run the app in 'dev' mode:

1. npm install
2. npm run test

After running the 'test' script, the App test should pass, along with any additional tests created during development.

This repository uses a Test Driven Development approach.

3. Add .env file and update the missing credentials.
   The following will be needed:

   - VITE_MAPBOX_TOKEN

4. npm run dev

---

To add a new feature to the repository:

- create a new branch from the 'development' branch.
- prefix the branch name with the next integer in the sequence, with hyphens
  between each word to describe the feature. e.g. '1-init-repo'
- clone the repository locally, or pull the latest version of the repo
- Follow TDD by defining a failing unit test and then developing the minimum code required to pass the test. Continue adding tests and refactoring the developed code until the feature is complete.
- Submit PR to merge feature branch into the development branch. Submit a PR with a guided walkthrough of the code for a Reviewer to use during their asynchronous audit. Respond to the Moderator and Inspector(s) communication as needed.
- At the end of sprint, or when there is a latest stable version of the app, merge
  development into main.

---

Documentation & Demonstration Media...

# The Challenge

Users should be able to..

# Screenshots

## Process

- Mobile first

# Built with

Vite
React
Vitest
Typescript
prettier
SWC
ESLint
Mapbox

# Learning Highlights

# Continued Development & Suggested Features

- Authentication to support app security
- Whitelisting the client's IP and setting up a firewall on the client app server
- instructions on signing up for accounts and defining credentials needed to run the app on the server securely

# TODO

- requesting data from https://earthquake.usgs.gov
  Need to update the Heatmap to dynamically display the timeseries earthquake data

  > UI controls for changing the time like weather.com
  > "state" & filtering function
  > < How to request data on-demand & at a set interval? Or more strictly like weather.com

[x] initialize project with Vite, React, SWC
[x] prettier
[x] jest setup
[x] typescript
[x] tailwind, shadcn
[x] initialized heatmap component
[x] CSS reset
[x] SCSS setup & global variables

- define style variables
- show Block-Element-Modifier styling syntax

- github actions PR request & review
- running jest tests during a PR
- all tests must pass

- libraries for dashboard analytics

- Playwright or other e2e testing

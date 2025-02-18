# Fyle Challenge

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.16.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Testing

The project includes comprehensive unit tests for components and services. The following components have 100% code coverage:

1. `WorkoutFormComponent`: Tests form validation, submission, and reset functionality
2. `WorkoutService`: Tests data persistence, user management, and workout tracking

## Test Coverage

The application has comprehensive test coverage for the WorkoutFormComponent and WorkoutService:

```
Statements   : 100% ( 63/63 )
Branches     : 87.5% ( 7/8 )
Functions    : 100% ( 26/26 )
Lines        : 100% ( 58/58 )
```

Note: Coverage report excludes the WorkoutTable,WorkoutChart Components as it is not part of the core functionality being tested.

To run the tests:

```bash
# Run tests in watch mode
npm test

# Run tests with coverage report
npm run test:coverage
```

The coverage report can be found in the `coverage` directory after running `npm run test:coverage`.

## Deployment

This project is deployed on Netlify. The site automatically deploys when changes are pushed to the master branch.

To test production build locally:
```bash
ng build --configuration production
npx serve dist/fyle-challenge
```

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

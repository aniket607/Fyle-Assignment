import { Component } from '@angular/core';
import { WorkoutService } from './services/workout.service';
import { Workout } from './models/workout.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Health Challenge Tracker';

  constructor(private workoutService: WorkoutService) {}

  onWorkoutAdded(event: {name: string, workout: Workout}): void {
    this.workoutService.addUser(event.name, event.workout);
  }
}
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { WORKOUT_TYPES, DropdownOption, WorkoutType } from '../../constants/workout.constants';
import { Workout } from '../../models/workout.model';

@Component({
  selector: 'app-workout-form',
  templateUrl: './workout-form.component.html'
})
export class WorkoutFormComponent implements OnInit {
  @ViewChild('workoutForm') workoutForm!: NgForm;
  @Output() workoutAdded = new EventEmitter<{name: string, workout: Workout}>();
  
  // Form inputs
  userName: string = '';
  workoutType: WorkoutType = WORKOUT_TYPES[0];
  workoutMinutes: number | null = null;
  formSubmitted = false;
  
  // Dropdown options
  workoutTypes: DropdownOption[] = WORKOUT_TYPES.map(type => ({ label: type, value: type }));

  constructor() {}

  ngOnInit(): void {}

  addWorkout(): void {
    this.formSubmitted = true;
    
    if (this.workoutForm.invalid) {
      return;
    }

    const workout: Workout = {
      type: this.workoutType,
      minutes: this.workoutMinutes as number
    };

    this.workoutAdded.emit({ name: this.userName, workout });
    
    // Reset form
    this.userName = '';
    this.workoutType = WORKOUT_TYPES[0];
    this.workoutMinutes = null;
    this.formSubmitted = false;
    this.workoutForm.resetForm();
  }
}

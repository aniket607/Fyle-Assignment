import { Component, EventEmitter, Output, ViewChild, signal } from '@angular/core';
import { NgForm } from '@angular/forms';
import { WORKOUT_TYPES, DropdownOption, WorkoutType } from '../../constants/workout.constants';
import { Workout } from '../../models/workout.model';

@Component({
  selector: 'app-workout-form',
  templateUrl: './workout-form.component.html'
})
export class WorkoutFormComponent {
  @ViewChild('workoutForm') workoutForm!: NgForm;
  @Output() workoutAdded = new EventEmitter<{name: string, workout: Workout}>();
  
  // Form state signals
  private userName = signal<string>('');
  private workoutType = signal<WorkoutType>(WORKOUT_TYPES[0]);
  private workoutMinutes = signal<number | null>(null);
  private formSubmitted = signal<boolean>(false);
  
  // Dropdown options
  readonly workoutTypes: DropdownOption[] = WORKOUT_TYPES.map(type => ({ 
    label: type, 
    value: type 
  }));

  // Getters for template
  getUserName(): string {
    return this.userName();
  }

  getWorkoutType(): WorkoutType {
    return this.workoutType();
  }

  getWorkoutMinutes(): number | null {
    return this.workoutMinutes();
  }

  getFormSubmitted(): boolean {
    return this.formSubmitted();
  }

  // Setters for template
  updateUserName(value: string): void {
    this.userName.set(value);
  }

  updateWorkoutType(value: WorkoutType): void {
    this.workoutType.set(value);
  }

  updateWorkoutMinutes(value: number | null): void {
    this.workoutMinutes.set(value);
  }

  addWorkout(): void {
    this.formSubmitted.set(true);
    
    if (this.workoutForm.invalid) {
      return;
    }

    const workout: Workout = {
      type: this.workoutType(),
      minutes: this.workoutMinutes() as number
    };

    this.workoutAdded.emit({ 
      name: this.userName(), 
      workout 
    });
    
    // Reset form
    this.userName.set('');
    this.workoutType.set(WORKOUT_TYPES[0]);
    this.workoutMinutes.set(null);
    this.formSubmitted.set(false);
    this.workoutForm.resetForm();
  }
}

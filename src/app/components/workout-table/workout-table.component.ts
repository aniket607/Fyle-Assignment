import { Component, computed, effect, signal } from '@angular/core';
import { UserData, Workout } from '../../models/workout.model';
import { WORKOUT_TYPES, DropdownOption, WorkoutType } from '../../constants/workout.constants';
import { WorkoutService } from '../../services/workout.service';

@Component({
  selector: 'app-workout-table',
  templateUrl: './workout-table.component.html'
})
export class WorkoutTableComponent {
  // Signals for reactive state
  private searchQuery = signal<string>('');
  private selectedWorkoutType = signal<WorkoutType | 'All'>('All');

  // Reference to service signals
  readonly users = this.workoutService.users$();
  
  // Computed values
  readonly filteredUsers = computed(() => {
    let filtered = this.users();
    const query = this.searchQuery();
    const type = this.selectedWorkoutType();
    
    if (query) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    if (type !== 'All') {
      filtered = filtered.filter(user => 
        user.workouts.some(workout => workout.type === type)
      );
    }
    
    return filtered;
  });

  // Dropdown options
  readonly filterOptions: DropdownOption[] = [
    { label: 'All', value: 'All' },
    ...WORKOUT_TYPES.map(type => ({ label: type, value: type }))
  ];

  constructor(private workoutService: WorkoutService) {
    // Effect to persist filter changes
    effect(() => {
      const type = this.selectedWorkoutType();
      // You could persist filter preferences to localStorage here if needed
    });
  }

  // Public methods to update signals
  updateSearchQuery(query: string): void {
    this.searchQuery.set(query);
  }

  updateWorkoutType(type: WorkoutType | 'All'): void {
    this.selectedWorkoutType.set(type);
  }

  // Getter for current values
  getSearchQuery(): string {
    return this.searchQuery();
  }

  getSelectedWorkoutType(): WorkoutType | 'All' {
    return this.selectedWorkoutType();
  }

  getTotalMinutes(workouts: Workout[]): number {
    return this.workoutService.getTotalWorkoutMinutes(workouts);
  }

  formatWorkouts(workouts: Workout[]): string {
    const uniqueTypes = [...new Set(workouts.map(w => w.type))];
    return uniqueTypes.join(', ');
  }
}

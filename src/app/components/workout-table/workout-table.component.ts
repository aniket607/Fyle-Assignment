import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserData, Workout } from '../../models/workout.model';
import { WORKOUT_TYPES, DropdownOption, WorkoutType } from '../../constants/workout.constants';
import { WorkoutService } from '../../services/workout.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-workout-table',
  templateUrl: './workout-table.component.html'
})
export class WorkoutTableComponent implements OnInit, OnDestroy {
  // Table data
  users: UserData[] = [];
  filteredUsers: UserData[] = [];
  filterOptions: DropdownOption[] = [
    { label: 'All', value: 'All' },
    ...WORKOUT_TYPES.map(type => ({ label: type, value: type }))
  ];
  selectedWorkoutType: WorkoutType | 'All' = 'All';
  
  // Search
  searchQuery: string = '';
  
  private userSubscription?: Subscription;

  constructor(private workoutService: WorkoutService) {}

  ngOnInit(): void {
    // Subscribe to user changes
    this.userSubscription = this.workoutService.getUsersObservable()
      .subscribe(users => {
        this.users = users;
        this.filterUsers();
      });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  loadUsers(): void {
    this.users = this.workoutService.getAllUsers();
    this.filterUsers();
  }

  onSearch(): void {
    this.filterUsers();
  }

  onWorkoutTypeChange(): void {
    this.filterUsers();
  }

  private filterUsers(): void {
    let filtered = this.users;
    
    if (this.searchQuery) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    
    if (this.selectedWorkoutType && this.selectedWorkoutType !== 'All') {
      filtered = filtered.filter(user => 
        user.workouts.some(workout => workout.type === this.selectedWorkoutType)
      );
    }
    
    this.filteredUsers = filtered;
  }

  getTotalMinutes(workouts: Workout[]): number {
    return this.workoutService.getTotalWorkoutMinutes(workouts);
  }

  formatWorkouts(workouts: Workout[]): string {
    // Get unique workout types using Set
    const uniqueTypes = [...new Set(workouts.map(w => w.type))];
    return uniqueTypes.join(', ');
  }
}

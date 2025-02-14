import { Injectable, signal, computed } from '@angular/core';
import { UserData, Workout } from '../models/workout.model';
import { WORKOUT_TYPES, WorkoutType } from '../constants/workout.constants';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  private readonly STORAGE_KEY = 'workoutData';
  
  // Create a signal for users data
  private users = signal<UserData[]>([]);

  // Computed signal for filtered users
  private filteredUsers = computed(() => this.users());

  private initialData: UserData[] = [
    {
      id: 1,
      name: 'John Doe',
      workouts: [
        { type: WORKOUT_TYPES[0], minutes: 30 },
        { type: WORKOUT_TYPES[1], minutes: 45 }
      ]
    },
    {
      id: 2,
      name: 'Jane Smith',
      workouts: [
        { type: WORKOUT_TYPES[2], minutes: 60 },
        { type: WORKOUT_TYPES[0], minutes: 20 }
      ]
    },
    {
      id: 3,
      name: 'Mike Johnson',
      workouts: [
        { type: WORKOUT_TYPES[3], minutes: 50 },
        { type: WORKOUT_TYPES[1], minutes: 40 }
      ]
    }
  ];

  constructor() {
    this.initializeData();
  }

  private initializeData(): void {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.initialData));
    }
    this.users.set(this.loadUsers());
  }

  private loadUsers(): UserData[] {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
  }

  // Public methods to access signals
  users$() {
    return this.users;
  }

  filteredUsers$() {
    return this.filteredUsers;
  }

  addUser(name: string, workout: Workout): void {
    const currentUsers = this.users();
    const existingUser = currentUsers.find(u => u.name.toLowerCase() === name.toLowerCase());

    if (existingUser) {
      const updatedUsers = currentUsers.map(user => {
        if (user.id === existingUser.id) {
          return {
            ...user,
            workouts: [...user.workouts, workout]
          };
        }
        return user;
      });
      this.users.set(updatedUsers);
    } else {
      const newUser: UserData = {
        id: currentUsers.length + 1,
        name,
        workouts: [workout]
      };
      this.users.set([...currentUsers, newUser]);
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.users()));
  }

  filterByWorkoutType(type: WorkoutType | 'All'): UserData[] {
    const currentUsers = this.users();
    if (type === 'All') {
      return currentUsers;
    }
    
    return currentUsers.filter(user => 
      user.workouts.some(workout => workout.type === type)
    );
  }

  getTotalWorkoutMinutes(workouts: Workout[]): number {
    return workouts.reduce((total, workout) => total + workout.minutes, 0);
  }
}

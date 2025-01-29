import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserData, Workout } from '../models/workout.model';
import { WORKOUT_TYPES, WorkoutType } from '../constants/workout.constants';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  private readonly STORAGE_KEY = 'workoutData';
  private usersSubject = new BehaviorSubject<UserData[]>([]);

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
    this.usersSubject.next(this.loadUsers());
  }

  private loadUsers(): UserData[] {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
  }

  getAllUsers(): UserData[] {
    return this.loadUsers();
  }

  getUsersObservable() {
    return this.usersSubject.asObservable();
  }

  addUser(name: string, workout: Workout): void {
    const users = this.loadUsers();
    const existingUser = users.find(u => u.name.toLowerCase() === name.toLowerCase());

    if (existingUser) {
      existingUser.workouts.push(workout);
    } else {
      const newUser: UserData = {
        id: users.length + 1,
        name,
        workouts: [workout]
      };
      users.push(newUser);
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
    this.usersSubject.next(users);
  }

  searchUsers(query: string): UserData[] {
    const users = this.loadUsers();
    return users.filter(user => 
      user.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  filterByWorkoutType(type: WorkoutType | 'All'): UserData[] {
    if (type === 'All') {
      return this.loadUsers();
    }
    
    const users = this.loadUsers();
    return users.filter(user => 
      user.workouts.some(workout => workout.type === type)
    );
  }

  getTotalWorkoutMinutes(workouts: Workout[]): number {
    return workouts.reduce((total, workout) => total + workout.minutes, 0);
  }
}

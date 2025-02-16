import { TestBed } from '@angular/core/testing';
import { WorkoutService } from './workout.service';
import { WORKOUT_TYPES } from '../constants/workout.constants';
import { UserData, Workout } from '../models/workout.model';

describe('WorkoutService', () => {
  let service: WorkoutService;
  const STORAGE_KEY = 'workoutData';

  const mockInitialData: UserData[] = [
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

  beforeEach(() => {
    TestBed.configureTestingModule({});
    localStorage.clear();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockInitialData));
    service = TestBed.inject(WorkoutService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default data', () => {
    const users = service.users$()();
    expect(users.length).toBe(3);
    expect(users[0].name).toBe('John Doe');
    expect(users[0].workouts.length).toBe(2);
  });

  it('should provide access to users signal', () => {
    const usersSignal = service.users$();
    expect(usersSignal).toBeTruthy();
    expect(typeof usersSignal).toBe('function');
    expect(usersSignal()).toEqual(mockInitialData);
  });

  it('should provide access to filtered users signal', () => {
    const filteredUsersSignal = service.filteredUsers$();
    expect(filteredUsersSignal).toBeTruthy();
    expect(typeof filteredUsersSignal).toBe('function');
    expect(filteredUsersSignal()).toEqual(mockInitialData);
  });

  it('should add new user workout', () => {
    const newWorkout: Workout = { type: 'Running', minutes: 30 };
    service.addUser('Alice Brown', newWorkout);
    
    const users = service.users$()();
    expect(users.length).toBe(4);
    const newUser = users.find(u => u.name === 'Alice Brown');
    expect(newUser).toBeTruthy();
    expect(newUser?.workouts.length).toBe(1);
    expect(newUser?.workouts[0]).toEqual(newWorkout);
  });

  it('should update existing user workout', () => {
    const newWorkout: Workout = { type: 'Swimming', minutes: 45 };
    service.addUser('John Doe', newWorkout);
    
    const users = service.users$()();
    const updatedUser = users.find(u => u.name === 'John Doe');
    expect(updatedUser?.workouts.length).toBe(3);
    expect(updatedUser?.workouts[2]).toEqual(newWorkout);
  });

  it('should filter users by workout type', () => {
    const results = service.filterByWorkoutType('Running');
    expect(results.length).toBe(2); // John Doe and Jane Smith have Running workouts
    expect(results[0].name).toBe('John Doe');
    expect(results[1].name).toBe('Jane Smith');
  });

  it('should return all users when filtering by All', () => {
    const results = service.filterByWorkoutType('All');
    expect(results.length).toBe(3);
  });

  it('should calculate total workout minutes', () => {
    const workouts: Workout[] = [
      { type: 'Running', minutes: 30 },
      { type: 'Swimming', minutes: 45 }
    ];
    const total = service.getTotalWorkoutMinutes(workouts);
    expect(total).toBe(75);
  });

  it('should persist users to localStorage', () => {
    const newWorkout: Workout = { type: 'Running', minutes: 30 };
    service.addUser('Alice Brown', newWorkout);
    
    const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    expect(storedData.length).toBe(4);
    expect(storedData.find((u: UserData) => u.name === 'Alice Brown')).toBeTruthy();
  });
});

import { WorkoutType } from '../constants/workout.constants';

export interface Workout {
    type: WorkoutType;
    minutes: number;
}

export interface UserData {
    id: number;
    name: string;
    workouts: Workout[];
}

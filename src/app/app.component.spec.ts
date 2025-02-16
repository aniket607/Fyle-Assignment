import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { WorkoutService } from './services/workout.service';
import { WORKOUT_TYPES } from './constants/workout.constants';
import { Workout } from './models/workout.model';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let workoutService: WorkoutService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [WorkoutService],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    workoutService = TestBed.inject(WorkoutService);
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have as title "Health Challenge Tracker"', () => {
    expect(component.title).toEqual('Health Challenge Tracker');
  });

  it('should handle workout added event', () => {
    const workout: Workout = { type: WORKOUT_TYPES[0], minutes: 30 };
    const name = 'John Doe';
    
    spyOn(workoutService, 'addUser');
    component.onWorkoutAdded({ name, workout });
    
    expect(workoutService.addUser).toHaveBeenCalledWith(name, workout);
  });
});

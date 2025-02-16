import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { WorkoutFormComponent } from './workout-form.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { WORKOUT_TYPES } from '../../constants/workout.constants';
import { Workout } from '../../models/workout.model';
import { CardModule } from 'primeng/card';

describe('WorkoutFormComponent', () => {
  let component: WorkoutFormComponent;
  let fixture: ComponentFixture<WorkoutFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkoutFormComponent],
      imports: [
        FormsModule,
        ButtonModule,
        InputTextModule,
        DropdownModule,
        CardModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form values', () => {
    expect(component.getUserName()).toBe('');
    expect(component.getWorkoutType()).toBe(WORKOUT_TYPES[0]);
    expect(component.getWorkoutMinutes()).toBeNull();
    expect(component.getFormSubmitted()).toBeFalse();
  });

  it('should have workout type options', () => {
    expect(component.workoutTypes.map(opt => opt.value)).toEqual(WORKOUT_TYPES);
  });

  describe('Getters and Setters', () => {
    it('should update and get userName', () => {
      const testName = 'John';
      component.updateUserName(testName);
      expect(component.getUserName()).toBe(testName);
    });

    it('should update and get workoutType', () => {
      const testType = WORKOUT_TYPES[1];
      component.updateWorkoutType(testType);
      expect(component.getWorkoutType()).toBe(testType);
    });

    it('should update and get workoutMinutes', () => {
      const testMinutes = 45;
      component.updateWorkoutMinutes(testMinutes);
      expect(component.getWorkoutMinutes()).toBe(testMinutes);
    });

    it('should update and get formSubmitted', () => {
      expect(component.getFormSubmitted()).toBeFalse();
      component.addWorkout();
      expect(component.getFormSubmitted()).toBeTrue();
    });
  });

  it('should emit workoutAdded event with valid form data', fakeAsync(() => {
    spyOn(component.workoutAdded, 'emit');

    // Set valid form values
    component.updateUserName('John');
    component.updateWorkoutType('Running');
    component.updateWorkoutMinutes(30);
    fixture.detectChanges();

    // Wait for form validation
    tick();

    // Trigger form submission
    component.addWorkout();
    fixture.detectChanges();

    // Check if event was emitted with correct data
    const expectedWorkout: Workout = {
      type: 'Running',
      minutes: 30
    };
    expect(component.workoutAdded.emit).toHaveBeenCalledWith({
      name: 'John',
      workout: expectedWorkout
    });
  }));

  it('should not emit workoutAdded event with invalid form data', fakeAsync(() => {
    spyOn(component.workoutAdded, 'emit');

    // Set invalid form values (empty name)
    component.updateUserName('');
    component.updateWorkoutType('Running');
    component.updateWorkoutMinutes(30);
    fixture.detectChanges();

    // Wait for form validation
    tick();

    component.addWorkout();
    fixture.detectChanges();

    expect(component.workoutAdded.emit).not.toHaveBeenCalled();
  }));

  it('should reset form after successful submission', fakeAsync(() => {
    // Set form values
    component.updateUserName('John');
    component.updateWorkoutType('Running');
    component.updateWorkoutMinutes(30);
    fixture.detectChanges();

    // Wait for form validation
    tick();

    // Mock form validity
    spyOn(component.workoutForm, 'resetForm');
    Object.defineProperty(component.workoutForm, 'invalid', { get: () => false });

    // Submit form
    component.addWorkout();
    fixture.detectChanges();

    // Check if form was reset
    expect(component.workoutForm.resetForm).toHaveBeenCalled();
    expect(component.getUserName()).toBe('');
    expect(component.getWorkoutType()).toBe(WORKOUT_TYPES[0]);
    expect(component.getWorkoutMinutes()).toBeNull();
    expect(component.getFormSubmitted()).toBeFalse();
  }));

  it('should validate name length', fakeAsync(() => {
    spyOn(component.workoutAdded, 'emit');

    // Set invalid name (less than 3 characters)
    component.updateUserName('Jo');
    component.updateWorkoutType('Running');
    component.updateWorkoutMinutes(30);
    fixture.detectChanges();

    // Wait for form validation
    tick();

    component.addWorkout();
    fixture.detectChanges();

    expect(component.workoutAdded.emit).not.toHaveBeenCalled();
  }));

  it('should validate workout minutes range', fakeAsync(() => {
    spyOn(component.workoutAdded, 'emit');

    // Set valid name and workout type
    component.updateUserName('John');
    component.updateWorkoutType('Running');
    fixture.detectChanges();

    // Test minutes below minimum
    component.updateWorkoutMinutes(0);
    fixture.detectChanges();
    tick();
    component.addWorkout();
    expect(component.workoutAdded.emit).not.toHaveBeenCalled();

    // Test minutes above maximum
    component.updateWorkoutMinutes(241);
    fixture.detectChanges();
    tick();
    component.addWorkout();
    expect(component.workoutAdded.emit).not.toHaveBeenCalled();

    // Test valid minutes
    component.updateWorkoutMinutes(120);
    fixture.detectChanges();
    tick();
    component.addWorkout();
    expect(component.workoutAdded.emit).toHaveBeenCalled();
  }));
});

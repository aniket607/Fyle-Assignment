import { Component, computed, effect, signal } from '@angular/core';
import { WorkoutService } from '../../services/workout.service';
import { UserData } from '../../models/workout.model';

@Component({
  selector: 'app-workout-chart',
  templateUrl: './workout-chart.component.html',
})
export class WorkoutChartComponent {
  // Store the selected user ID instead of the user object
  private selectedUserId = signal<number | null>(null);
  
  // Use signal directly from service
  readonly users = this.workoutService.users$();
  
  // Computed signal for selected user that updates when users change
  readonly selectedUser = computed(() => {
    const userId = this.selectedUserId();
    const currentUsers = this.users();
    return userId ? currentUsers.find(u => u.id === userId) ?? null : null;
  });
  
  // Computed signal for chart data
  readonly chartData = computed(() => {
    const selected = this.selectedUser();
    
    if (!selected) {
      return null;
    }

    // Group workouts by type and sum minutes
    const workoutsByType = selected.workouts.reduce((acc, workout) => {
      if (!acc[workout.type]) {
        acc[workout.type] = 0;
      }
      acc[workout.type] += workout.minutes;
      return acc;
    }, {} as { [key: string]: number });

    return {
      labels: Object.keys(workoutsByType),
      datasets: [
        {
          label: 'Minutes',
          data: Object.values(workoutsByType),
          backgroundColor: [
            'rgba(135,206,235,0.8)', 
            'rgba(144,238,144,0.8)', 
            'rgba(255,182,193,0.8)', 
            'rgba(255,218,185,0.8)'
          ],
          borderColor: [
            'rgb(135,206,235)', 
            'rgb(144,238,144)', 
            'rgb(255,182,193)', 
            'rgb(255,218,185)'
          ],
          borderWidth: 1
        }
      ]
    };
  });

  // Chart options
  readonly chartOptions = {
    plugins: {
      legend: {
        labels: {
          color: '#495057'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Minutes',
          color: '#495057'
        },
        ticks: {
          color: '#495057'
        },
        grid: {
          color: '#ebedef'
        }
      },
      x: {
        ticks: {
          color: '#495057'
        },
        grid: {
          color: '#ebedef'
        }
      }
    }
  };

  constructor(private workoutService: WorkoutService) {
    // Set initial selected user
    const currentUsers = this.users();
    if (currentUsers.length > 0) {
      this.selectedUserId.set(currentUsers[0].id);
    }
  }

  // Getter for template
  getSelectedUser(): UserData | null {
    return this.selectedUser();
  }

  // Update selected user
  updateSelectedUser(user: UserData): void {
    this.selectedUserId.set(user.id);
  }
}

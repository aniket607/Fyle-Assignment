import { Component, OnInit } from '@angular/core';
import { WorkoutService } from '../../services/workout.service';
import { UserData } from '../../models/workout.model';

@Component({
  selector: 'app-workout-chart',
  templateUrl: './workout-chart.component.html',
})
export class WorkoutChartComponent implements OnInit {
  chartData: any;
  chartOptions: any;
  selectedUser: string = '';
  users: UserData[] = [];

  constructor(private workoutService: WorkoutService) {}

  ngOnInit() {
    this.workoutService.getUsersObservable().subscribe(users => {
      this.users = users;
      if (users.length > 0) {
        this.selectedUser = users[0].name;
        this.updateChart();
      }
    });

    this.chartOptions = {
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
  }

  updateChart() {
    const user = this.users.find(u => u.name === this.selectedUser);
    if (!user) return;

    // Group workouts by type and sum minutes
    const workoutsByType = user.workouts.reduce((acc, workout) => {
      if (!acc[workout.type]) {
        acc[workout.type] = 0;
      }
      acc[workout.type] += workout.minutes;
      return acc;
    }, {} as { [key: string]: number });

    this.chartData = {
      labels: Object.keys(workoutsByType),
      datasets: [
        {
          label: 'Minutes',
          data: Object.values(workoutsByType),
          backgroundColor: ['rgba(135,206,235,0.8)', 'rgba(144,238,144,0.8)', 'rgba(255,182,193,0.8)', 'rgba(255,218,185,0.8)'],
          borderColor: ['rgb(135,206,235)', 'rgb(144,238,144)', 'rgb(255,182,193)', 'rgb(255,218,185)'],
          borderWidth: 1
        }
      ]
    };
  }

  onUserChange() {
    this.updateChart();
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';

import { StatsService } from '../../core/services/stats.service';
import { Stats } from '../../core/models/stats.model';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatProgressBarModule, BaseChartDirective],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss'
})
export class StatsComponent implements OnInit {
  private statsService = inject(StatsService);

  stats: Stats | null = null;
  loading = true;

  doughnutData: ChartData<'doughnut'> = { labels: [], datasets: [] };
  barTopicData: ChartData<'bar'> = { labels: [], datasets: [] };
  barDiffData: ChartData<'bar'> = { labels: [], datasets: [] };

  doughnutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#e0e0e0', padding: 16 } }
    }
  };

  barOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: { legend: { labels: { color: '#e0e0e0' } } },
    scales: {
      x: { ticks: { color: '#9e9e9e' }, grid: { color: '#2a2a2a' } },
      y: { ticks: { color: '#9e9e9e', stepSize: 1 }, grid: { color: '#2a2a2a' }, beginAtZero: true }
    }
  };

  ngOnInit() {
    this.statsService.getStats().subscribe({
      next: stats => {
        this.stats = stats;
        this.buildCharts(stats);
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  private buildCharts(s: Stats) {
    this.doughnutData = {
      labels: ['Solved', 'Attempted', 'Not Started'],
      datasets: [{
        data: [s.solved, s.attempted, s.notStarted],
        backgroundColor: ['#22c55e', '#f59e0b', '#374151'],
        borderColor: '#1e1e1e',
        borderWidth: 2
      }]
    };

    const topics = Object.keys(s.solvedByTopic);
    this.barTopicData = {
      labels: topics,
      datasets: [
        { label: 'Solved',  data: topics.map(t => s.solvedByTopic[t] ?? 0),  backgroundColor: '#7c3aed' },
      ]
    };

    const diffs = ['EASY', 'MEDIUM', 'HARD'];
    this.barDiffData = {
      labels: diffs,
      datasets: [
        { label: 'Total',  data: diffs.map(d => s.totalByDifficulty[d] ?? 0),  backgroundColor: '#374151' },
        { label: 'Solved', data: diffs.map(d => s.solvedByDifficulty[d] ?? 0), backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'] }
      ]
    };
  }
}

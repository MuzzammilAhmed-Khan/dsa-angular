import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { forkJoin } from 'rxjs';

import { StatsService } from '../../core/services/stats.service';
import { ProgressService } from '../../core/services/progress.service';
import { Stats } from '../../core/models/stats.model';
import { Progress } from '../../core/models/progress.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatIconModule,
            MatProgressBarModule, MatListModule, MatButtonModule, MatChipsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private statsService = inject(StatsService);
  private progressService = inject(ProgressService);

  stats: Stats | null = null;
  revisitList: Progress[] = [];
  loading = true;

  statCards: { label: string; icon: string; color: string; key: keyof Stats }[] = [
    { label: 'Total Problems', icon: 'format_list_bulleted', color: '#7c3aed', key: 'totalProblems' },
    { label: 'Solved',         icon: 'check_circle',         color: '#22c55e', key: 'solved'        },
    { label: 'Attempted',      icon: 'pending',              color: '#f59e0b', key: 'attempted'     },
    { label: 'To Revisit',     icon: 'bookmark',             color: '#06b6d4', key: 'toRevisit'     },
  ];

  ngOnInit() {
    forkJoin({
      stats: this.statsService.getStats(),
      revisit: this.progressService.getToRevisit()
    }).subscribe({
      next: ({ stats, revisit }) => {
        this.stats = stats;
        this.revisitList = revisit.slice(0, 6);
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  diffClass(d: string) {
    return { 'diff-easy': d === 'EASY', 'diff-medium': d === 'MEDIUM', 'diff-hard': d === 'HARD' };
  }
}

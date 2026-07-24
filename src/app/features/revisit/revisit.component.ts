import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ProgressService } from '../../core/services/progress.service';
import { Progress } from '../../core/models/progress.model';

@Component({
  selector: 'app-revisit',
  standalone: true,
  imports: [CommonModule, RouterLink, MatTableModule, MatButtonModule, MatIconModule,
            MatChipsModule, MatProgressBarModule, MatSnackBarModule, MatTooltipModule],
  templateUrl: './revisit.component.html',
  styleUrl: './revisit.component.scss'
})
export class RevisitComponent implements OnInit {
  private progressService = inject(ProgressService);
  private snackBar = inject(MatSnackBar);

  items: Progress[] = [];
  loading = true;
  displayedColumns = ['problem', 'topic', 'difficulty', 'status', 'attempts', 'actions'];

  ngOnInit() {
    this.load();
  }

  load() {
    this.progressService.getToRevisit().subscribe({
      next: items => { this.items = items; this.loading = false; },
      error: () => this.loading = false
    });
  }

  unflag(item: Progress) {
    this.progressService.update(item.problemId, {
      status: item.status,
      revisit: false,
      personalNotes: item.personalNotes
    }).subscribe({
      next: () => {
        this.items = this.items.filter(i => i.problemId !== item.problemId);
        this.snackBar.open('Removed from revisit queue', '', { duration: 2000 });
      }
    });
  }

  diffClass(d: string) {
    return { 'diff-easy': d === 'EASY', 'diff-medium': d === 'MEDIUM', 'diff-hard': d === 'HARD' };
  }

  statusClass(s: string) {
    return { 'status-solved': s === 'SOLVED', 'status-attempted': s === 'ATTEMPTED', 'status-not-started': s === 'NOT_STARTED' };
  }
}

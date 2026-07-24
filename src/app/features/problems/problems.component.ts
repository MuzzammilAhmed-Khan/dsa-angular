import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { forkJoin } from 'rxjs';

import { ProblemService } from '../../core/services/problem.service';
import { TopicService } from '../../core/services/topic.service';
import { Problem, Difficulty, ProgressStatus } from '../../core/models/problem.model';
import { Topic } from '../../core/models/topic.model';

@Component({
  selector: 'app-problems',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatTableModule, MatSelectModule,
            MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule,
            MatChipsModule, MatProgressBarModule, MatTooltipModule],
  templateUrl: './problems.component.html',
  styleUrl: './problems.component.scss'
})
export class ProblemsComponent implements OnInit {
  private problemService = inject(ProblemService);
  private topicService = inject(TopicService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  problems: Problem[] = [];
  topics: Topic[] = [];
  loading = true;

  filterTopicId: number | null = null;
  filterTopicName = '';
  filterDifficulty: Difficulty | '' = '';
  filterStatus: ProgressStatus | '' = '';
  filterText = '';

  difficulties: Difficulty[] = ['EASY', 'MEDIUM', 'HARD'];
  statuses: ProgressStatus[] = ['NOT_STARTED', 'ATTEMPTED', 'SOLVED'];
  displayedColumns = ['title', 'topic', 'difficulty', 'status', 'revisit', 'actions'];

  get filtered(): Problem[] {
    return this.problems.filter(p =>
      (!this.filterText || p.title.toLowerCase().includes(this.filterText.toLowerCase())) &&
      (!this.filterDifficulty || p.difficulty === this.filterDifficulty) &&
      (!this.filterStatus || p.progressStatus === this.filterStatus)
    );
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.filterTopicId = params['topicId'] ? +params['topicId'] : null;
      this.filterTopicName = params['topicName'] ?? '';
    });

    forkJoin({
      problems: this.problemService.getAll(this.filterTopicId ? { topicId: this.filterTopicId } : {}),
      topics: this.topicService.getAll()
    }).subscribe({
      next: ({ problems, topics }) => {
        this.problems = problems;
        this.topics = topics;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  clearTopicFilter() {
    this.filterTopicId = null;
    this.filterTopicName = '';
    this.router.navigate([], { queryParams: {} });
    this.problemService.getAll().subscribe(p => this.problems = p);
  }

  diffClass(d: Difficulty) {
    return { 'diff-easy': d === 'EASY', 'diff-medium': d === 'MEDIUM', 'diff-hard': d === 'HARD' };
  }

  statusClass(s: ProgressStatus) {
    return {
      'status-solved': s === 'SOLVED',
      'status-attempted': s === 'ATTEMPTED',
      'status-not-started': s === 'NOT_STARTED'
    };
  }

  statusIcon(s: ProgressStatus) {
    return { SOLVED: 'check_circle', ATTEMPTED: 'pending', NOT_STARTED: 'radio_button_unchecked' }[s];
  }
}

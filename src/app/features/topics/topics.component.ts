import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { forkJoin } from 'rxjs';

import { TopicService } from '../../core/services/topic.service';
import { StatsService } from '../../core/services/stats.service';
import { Topic, Category } from '../../core/models/topic.model';
import { Stats } from '../../core/models/stats.model';

interface CategoryGroup { key: Category; label: string; icon: string; topics: Topic[]; }

@Component({
  selector: 'app-topics',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule,
            MatButtonModule, MatProgressBarModule, MatProgressSpinnerModule],
  templateUrl: './topics.component.html',
  styleUrl: './topics.component.scss'
})
export class TopicsComponent implements OnInit {
  private topicService = inject(TopicService);
  private statsService = inject(StatsService);
  private router = inject(Router);

  groups: CategoryGroup[] = [];
  stats: Stats | null = null;
  loading = true;

  ngOnInit() {
    forkJoin({ topics: this.topicService.getAll(), stats: this.statsService.getStats() }).subscribe({
      next: ({ topics, stats }) => {
        this.stats = stats;
        this.groups = [
          { key: 'LINEAR',      label: 'Linear',      icon: 'linear_scale', topics: [] },
          { key: 'NON_LINEAR',  label: 'Non-Linear',  icon: 'account_tree', topics: [] },
          { key: 'ALGORITHM',   label: 'Algorithms',  icon: 'psychology',   topics: [] },
        ];
        topics.forEach(t => this.groups.find(g => g.key === t.category)?.topics.push(t));
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  solvedFor(topicName: string) { return this.stats?.solvedByTopic?.[topicName] ?? 0; }

  solvedPct(topic: Topic) {
    return topic.problemCount ? Math.round((this.solvedFor(topic.name) / topic.problemCount) * 100) : 0;
  }

  browse(topic: Topic) {
    this.router.navigate(['/problems'], { queryParams: { topicId: topic.id, topicName: topic.name } });
  }
}

import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'topics',
    loadComponent: () => import('./features/topics/topics.component').then(m => m.TopicsComponent)
  },
  {
    path: 'problems',
    loadComponent: () => import('./features/problems/problems.component').then(m => m.ProblemsComponent)
  },
  {
    path: 'problems/:id',
    loadComponent: () => import('./features/problem-detail/problem-detail.component').then(m => m.ProblemDetailComponent)
  },
  {
    path: 'revisit',
    loadComponent: () => import('./features/revisit/revisit.component').then(m => m.RevisitComponent)
  },
  {
    path: 'stats',
    loadComponent: () => import('./features/stats/stats.component').then(m => m.StatsComponent)
  }
];

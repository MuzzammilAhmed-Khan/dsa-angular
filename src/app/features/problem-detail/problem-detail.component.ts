import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MonacoEditorModule, NgxEditorModel } from 'ngx-monaco-editor-v2';
import { forkJoin, of, catchError } from 'rxjs';

import { ProblemService } from '../../core/services/problem.service';
import { SolutionService } from '../../core/services/solution.service';
import { ProgressService } from '../../core/services/progress.service';
import { Problem, ProgressStatus } from '../../core/models/problem.model';
import { Solution } from '../../core/models/solution.model';
import { Progress } from '../../core/models/progress.model';

@Component({
  selector: 'app-problem-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule,
            MatChipsModule, MatFormFieldModule, MatInputModule, MatTabsModule,
            MatSnackBarModule, MatProgressSpinnerModule, MatTooltipModule,
            MatDividerModule, MonacoEditorModule],
  templateUrl: './problem-detail.component.html',
  styleUrl: './problem-detail.component.scss'
})
export class ProblemDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private problemService = inject(ProblemService);
  private solutionService = inject(SolutionService);
  private progressService = inject(ProgressService);
  private snackBar = inject(MatSnackBar);

  problem: Problem | null = null;
  solution: Solution | null = null;
  progress: Progress | null = null;
  loading = true;
  saving = false;
  showHints = false;

  // Solution form fields
  approach = '';
  code = '';
  timeComplexity = '';
  spaceComplexity = '';
  solutionNotes = '';

  // Monaco — set after data loads so editor picks up the value
  editorModel: NgxEditorModel | null = null;
  private monacoEditor: any = null;

  // Progress form fields
  personalNotes = '';
  revisit = false;

  editorOptions = {
    theme: 'vs-dark',
    language: 'java',
    fontSize: 13,
    fontFamily: "'Fira Code', Consolas, monospace",
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    automaticLayout: true,
    padding: { top: 12, bottom: 12 }
  };

  readonly statuses: ProgressStatus[] = ['NOT_STARTED', 'ATTEMPTED', 'SOLVED'];

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    forkJoin({
      problem:  this.problemService.getById(id),
      solution: this.solutionService.getByProblemId(id).pipe(catchError(() => of(null))),
      progress: this.progressService.getByProblemId(id).pipe(catchError(() => of(null)))
    }).subscribe({
      next: ({ problem, solution, progress }) => {
        this.problem = problem;
        this.solution = solution;
        this.progress = progress;
        if (solution) {
          this.approach = solution.approach ?? '';
          this.code = solution.code ?? '';
          this.timeComplexity = solution.timeComplexity ?? '';
          this.spaceComplexity = solution.spaceComplexity ?? '';
          this.solutionNotes = solution.notes ?? '';
        }
        if (progress) {
          this.personalNotes = progress.personalNotes ?? '';
          this.revisit = progress.revisit;
        }
        // Set model AFTER data loads — Monaco reads this once the editor is ready
        this.editorModel = { value: this.code, language: 'java' };
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  saveSolution() {
    if (!this.problem) return;
    this.saving = true;
    this.solutionService.save({
      problemId: this.problem.id,
      approach: this.approach,
      code: this.code,
      timeComplexity: this.timeComplexity,
      spaceComplexity: this.spaceComplexity,
      notes: this.solutionNotes
    }).subscribe({
      next: s => {
        this.solution = s;
        this.saving = false;
        this.snackBar.open('Solution saved', '', { duration: 2000 });
      },
      error: () => { this.saving = false; this.snackBar.open('Error saving solution', '', { duration: 3000 }); }
    });
  }

  markAs(status: ProgressStatus) {
    if (!this.problem) return;
    this.progressService.update(this.problem.id, {
      status,
      revisit: this.revisit,
      personalNotes: this.personalNotes
    }).subscribe({
      next: p => {
        this.progress = p;
        if (this.problem) this.problem.progressStatus = status;
        this.snackBar.open(`Marked as ${status.replace('_', ' ')}`, '', { duration: 2000 });
      }
    });
  }

  saveNotes() {
    if (!this.problem || !this.progress) return;
    this.progressService.update(this.problem.id, {
      status: this.progress.status,
      revisit: this.revisit,
      personalNotes: this.personalNotes
    }).subscribe({
      next: p => {
        this.progress = p;
        this.snackBar.open('Notes saved', '', { duration: 2000 });
      }
    });
  }

  toggleRevisit() {
    if (!this.problem || !this.progress) return;
    this.revisit = !this.revisit;
    this.progressService.update(this.problem.id, {
      status: this.progress.status,
      revisit: this.revisit,
      personalNotes: this.personalNotes
    }).subscribe(p => { this.progress = p; this.problem!.revisit = this.revisit; });
  }

  onEditorReady(editor: any) {
    this.monacoEditor = editor;
    editor.onDidChangeModelContent(() => {
      this.code = editor.getValue();
    });
  }

  back() { this.router.navigate(['/problems']); }

  diffClass(d: string) { return `diff-${d?.toLowerCase()}`; }

  statusIcon(s: ProgressStatus) {
    return { SOLVED: 'check_circle', ATTEMPTED: 'pending', NOT_STARTED: 'radio_button_unchecked' }[s] ?? '';
  }

  statusClass(s: ProgressStatus) {
    return { 'status-solved': s === 'SOLVED', 'status-attempted': s === 'ATTEMPTED', 'status-not-started': s === 'NOT_STARTED' };
  }
}

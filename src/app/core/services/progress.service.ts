import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Progress, ProgressUpdateRequest } from '../models/progress.model';

@Injectable({ providedIn: 'root' })
export class ProgressService {
  private http = inject(HttpClient);
  private base = `${environment.apiBase}/progress`;

  getAll(): Observable<Progress[]> {
    return this.http.get<ApiResponse<Progress[]>>(this.base).pipe(map(r => r.data));
  }

  getByProblemId(problemId: number): Observable<Progress> {
    return this.http.get<ApiResponse<Progress>>(`${this.base}/problem/${problemId}`).pipe(map(r => r.data));
  }

  getToRevisit(): Observable<Progress[]> {
    return this.http.get<ApiResponse<Progress[]>>(`${this.base}/revisit`).pipe(map(r => r.data));
  }

  update(problemId: number, req: ProgressUpdateRequest): Observable<Progress> {
    return this.http.put<ApiResponse<Progress>>(`${this.base}/problem/${problemId}`, req).pipe(map(r => r.data));
  }
}

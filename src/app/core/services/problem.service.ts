import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Problem, ProblemRequest, Difficulty, ProgressStatus } from '../models/problem.model';

@Injectable({ providedIn: 'root' })
export class ProblemService {
  private http = inject(HttpClient);
  private base = `${environment.apiBase}/problems`;

  getAll(filters?: { topicId?: number; difficulty?: Difficulty; status?: ProgressStatus }): Observable<Problem[]> {
    let params = new HttpParams();
    if (filters?.topicId) params = params.set('topicId', filters.topicId);
    if (filters?.difficulty) params = params.set('difficulty', filters.difficulty);
    if (filters?.status) params = params.set('status', filters.status);
    return this.http.get<ApiResponse<Problem[]>>(this.base, { params }).pipe(map(r => r.data));
  }

  getById(id: number): Observable<Problem> {
    return this.http.get<ApiResponse<Problem>>(`${this.base}/${id}`).pipe(map(r => r.data));
  }

  getToRevisit(): Observable<Problem[]> {
    return this.http.get<ApiResponse<Problem[]>>(`${this.base}/revisit`).pipe(map(r => r.data));
  }

  create(req: ProblemRequest): Observable<Problem> {
    return this.http.post<ApiResponse<Problem>>(this.base, req).pipe(map(r => r.data));
  }

  update(id: number, req: ProblemRequest): Observable<Problem> {
    return this.http.put<ApiResponse<Problem>>(`${this.base}/${id}`, req).pipe(map(r => r.data));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.base}/${id}`).pipe(map(() => void 0));
  }
}

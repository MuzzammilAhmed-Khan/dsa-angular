import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Solution, SolutionRequest } from '../models/solution.model';

@Injectable({ providedIn: 'root' })
export class SolutionService {
  private http = inject(HttpClient);
  private base = `${environment.apiBase}/solutions`;

  getByProblemId(problemId: number): Observable<Solution> {
    return this.http.get<ApiResponse<Solution>>(`${this.base}/problem/${problemId}`).pipe(map(r => r.data));
  }

  save(req: SolutionRequest): Observable<Solution> {
    return this.http.post<ApiResponse<Solution>>(this.base, req).pipe(map(r => r.data));
  }

  delete(problemId: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.base}/problem/${problemId}`).pipe(map(() => void 0));
  }
}

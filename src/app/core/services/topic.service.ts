import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Topic, TopicRequest } from '../models/topic.model';

@Injectable({ providedIn: 'root' })
export class TopicService {
  private http = inject(HttpClient);
  private base = `${environment.apiBase}/topics`;

  getAll(): Observable<Topic[]> {
    return this.http.get<ApiResponse<Topic[]>>(this.base).pipe(map(r => r.data));
  }

  getById(id: number): Observable<Topic> {
    return this.http.get<ApiResponse<Topic>>(`${this.base}/${id}`).pipe(map(r => r.data));
  }

  create(req: TopicRequest): Observable<Topic> {
    return this.http.post<ApiResponse<Topic>>(this.base, req).pipe(map(r => r.data));
  }

  update(id: number, req: TopicRequest): Observable<Topic> {
    return this.http.put<ApiResponse<Topic>>(`${this.base}/${id}`, req).pipe(map(r => r.data));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.base}/${id}`).pipe(map(() => void 0));
  }
}

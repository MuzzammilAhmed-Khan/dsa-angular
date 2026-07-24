import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Stats } from '../models/stats.model';

@Injectable({ providedIn: 'root' })
export class StatsService {
  private http = inject(HttpClient);
  private base = `${environment.apiBase}/stats`;

  getStats(): Observable<Stats> {
    return this.http.get<ApiResponse<Stats>>(this.base).pipe(map(r => r.data));
  }
}

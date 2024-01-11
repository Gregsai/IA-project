import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TournamentsService {
  private baseURL = 'http://localhost:3000';
  private numberOfUpcomingTournaments = new BehaviorSubject<number>(0);
  numberOfUpcomingTournaments$: Observable<number> = this.numberOfUpcomingTournaments.asObservable();

  constructor(
    private http: HttpClient,
  ) {
    this.updateNumberOfUpcomingTournaments();
  }

  updateNumberOfUpcomingTournaments(): void {
    this.getNumberOfUpcomingTournaments().subscribe(data => {
      this.numberOfUpcomingTournaments.next(data);
    });
  }

  getNumberOfUpcomingTournaments(): Observable<number> {
    const getNumberOfUpcomingTournamentsUrl = `${this.baseURL}/tournaments/get-number-of-upcoming-tournaments`;
    return this.http.get<number>(getNumberOfUpcomingTournamentsUrl, { withCredentials: true });
  }
}

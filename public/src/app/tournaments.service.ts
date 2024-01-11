import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
interface TournamentResponse {
  totalCount: number;
  tournaments: string[];
}
@Injectable({
  providedIn: 'root'
})
export class TournamentsService {
  private baseURL = 'http://localhost:3000';
  private tournamentsPerPage: number = 10;
  private numberOfUpcomingTournaments = new BehaviorSubject<number>(0);
  numberOfUpcomingTournaments$: Observable<number> = this.numberOfUpcomingTournaments.asObservable();

  constructor(private http: HttpClient) {
    this.updateNumberOfUpcomingTournaments();
  }

  updateNumberOfUpcomingTournaments(): void {
    this.getNumberOfUpcomingTournaments().subscribe(
      (numberOfTournaments) => {
        this.numberOfUpcomingTournaments.next(numberOfTournaments);
      },
      (error) => {
        console.error('Error updating number of upcoming tournaments:', error);
      }
    );
  }

  getNumberOfUpcomingTournaments(): Observable<number> {
    const getNumberOfUpcomingTournamentsUrl = `${this.baseURL}/tournaments/get-number-of-upcoming-tournaments`;
    return this.http.get<number>(getNumberOfUpcomingTournamentsUrl, { withCredentials: true });
  }

  getUpcomingTournaments(startIndex: number, endIndex: number, searchTerm: string): Observable<string[]> {
    const getTournamentsUrl = `${this.baseURL}/tournaments/get-tournaments-page`;
    const params = new HttpParams()
      .set('startIndex', startIndex)
      .set('endIndex', endIndex)
      .set('searchTerm', searchTerm);

    return this.http.get<string[]>(getTournamentsUrl, { params, withCredentials: true });
  }


  getUpcomingTournamentsPage(startIndex: number, endIndex: number, searchTerm: string): Observable<TournamentResponse> {
    const getTournamentsUrl = `${this.baseURL}/tournaments/get-upcoming-tournaments-page`;
    const params = new HttpParams()
      .set('startIndex', startIndex.toString())
      .set('endIndex', endIndex.toString())
      .set('searchTerm', searchTerm);
    return this.http.get<TournamentResponse>(getTournamentsUrl, { params, withCredentials: true });
  }
}

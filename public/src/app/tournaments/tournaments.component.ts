import { Component, OnDestroy, OnInit } from '@angular/core';
import { TournamentsService } from '../tournaments.service';
import { Subscription } from 'rxjs';

interface Tournament {
  id: number;
  organizer: number;
  name: string;
  discipline: string;
  date: string;
  maxparticipants: number;
  applicationdeadline: string;
  address: string;
  seedingtype: string;
}

@Component({
  selector: 'app-tournaments',
  templateUrl: './tournaments.component.html',
  styleUrls: ['./tournaments.component.css']
})
export class TournamentsComponent implements OnInit, OnDestroy {
  displayedTournaments: Tournament[] = [];
  totalPages: number = 0;
  currentPage: number = 1;
  searchTerm: string = '';
  numberOfUpcomingTournamentsValue: number = 0;
  private subscription?: Subscription;
  tournamentsPerPage: number = 10;

  constructor(private tournamentsService: TournamentsService) {}

  ngOnInit() {
    this.getTournaments();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  calculatePages(totalItems: number, itemsPerPage: number, currentPage: number, displayCount: number = 5): number[] {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pages: number[] = [];

    const firstPage = 1;
    const lastPage = totalPages;
    const halfDisplay = Math.floor(displayCount / 2);

    let startPage = Math.max(firstPage, currentPage - halfDisplay);
    let endPage = Math.min(lastPage, startPage + displayCount - 1);

    if (lastPage - startPage + 1 < displayCount) {
      startPage = Math.max(firstPage, lastPage - displayCount + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }



  selectvaluesIntournament(page: number) {
    this.currentPage = page;
    this.getTournaments();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getTournaments();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getTournaments();
    }
  }

  updateSearch() {
    this.currentPage = 1;
    this.getTournaments();
  }

  private getTournaments() {
    const startIndex = (this.currentPage - 1) * this.tournamentsPerPage;
    const endIndex = startIndex + this.tournamentsPerPage ;
    this.subscription = this.tournamentsService.getUpcomingTournamentsPage(startIndex, endIndex, this.searchTerm).subscribe(
      (response: any) => {
        this.numberOfUpcomingTournamentsValue = response.totalCount;
        this.totalPages = Math.ceil(response.totalCount / this.tournamentsPerPage);
        this.currentPage = Math.max(1, Math.min(this.currentPage, this.totalPages));
        this.displayedTournaments = response.tournaments;
      },
      (error) => {
        console.error('Error fetching tournaments:', error);
      }
    );
  }
}

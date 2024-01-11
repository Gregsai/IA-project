import { Component } from '@angular/core';

@Component({
  selector: 'app-tournaments',
  templateUrl: './tournaments.component.html',
  styleUrls: ['./tournaments.component.css']
})
export class TournamentsComponent {
  data: string[] = ["tournament 1", "tournament 2", "tournament 3", "tournament 4", "tournament 5", "tournament 6", "tournament 7", "tournament 8", "tournament 9", "tournament 10", "tournament 11", "tournament 12", "tournament 13", "tournament 14", "tournament 15", "tournament 16", "tournament 17", "tournament 18", "tournament 19", "tournament 20", "tournament 21", "tournament 22", "tournament 23", "tournament 24", "tournament 25", "tournament 26", "tournament 27", "tournament 28", "tournament 29", "tournament 30", "tournament 31", "tournament 32", "tournament 33", "tournament 34", "tournament 35", "tournament 36", "tournament 37", "tournament 38", "tournament 39", "tournament 40", "tournament 41", "tournament 42", "tournament 43", "tournament 44", "tournament 45", "tournament 46", "tournament 47", "tournament 48", "tournament 49", "tournament 50"];
  tournamentsPerPage: number = 10;
  currentPage: number = 1;
  displayedTournaments: string[] = [];
  pages: number[] = [];
  totalPages: number = 0;
  searchTerm: string = '';

  ngOnInit() {
    this.calculatePages();
    this.getTournaments();
  }

  calculatePages() {
    this.totalPages = Math.ceil(this.data.length / this.tournamentsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  getTournaments() {
    let filteredData = this.data;

    // Appliquer la recherche aux données uniquement si searchTerm n'est pas vide
    if (this.searchTerm.trim() !== '') {
      filteredData = this.data.filter(tournament => tournament.toLowerCase().includes(this.searchTerm.toLowerCase()));
    }

    this.totalPages = Math.ceil(filteredData.length / this.tournamentsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);

    // Assurer que currentPage est toujours valide même lorsque le terme de recherche ne renvoie aucun résultat
    this.currentPage = Math.max(1, Math.min(this.currentPage, this.totalPages));

    const startIndex = (this.currentPage - 1) * this.tournamentsPerPage;
    const endIndex = startIndex + this.tournamentsPerPage;
    this.displayedTournaments = filteredData.slice(startIndex, endIndex);
    console.log(this.currentPage)
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
    // Mettre à jour la recherche à chaque modification du champ
    this.getTournaments();
  }
}





// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-tournaments',
//   templateUrl: './tournaments.component.html',
//   styleUrls: ['./tournaments.component.css']
// })
// export class TournamentsComponent {
//   data: string[] = ["tournament 1", "tournament 2", "tournament 3", "tournament 4", "tournament 5", "tournament 6", "tournament 7", "tournament 8", "tournament 9", "tournament 10", "tournament 11", "tournament 12", "tournament 13", "tournament 14", "tournament 15", "tournament 16", "tournament 17", "tournament 18", "tournament 19", "tournament 20", "tournament 21", "tournament 22", "tournament 23", "tournament 24", "tournament 25", "tournament 26", "tournament 27", "tournament 28", "tournament 29", "tournament 30", "tournament 31", "tournament 32", "tournament 33", "tournament 34", "tournament 35", "tournament 36", "tournament 37", "tournament 38", "tournament 39", "tournament 40", "tournament 41", "tournament 42", "tournament 43", "tournament 44", "tournament 45", "tournament 46", "tournament 47", "tournament 48", "tournament 49", "tournament 50"];
//   tournamentsPerPage: number = 10;
//   currentPage: number = 1;
//   displayedTournaments: string[] = [];
//   pages: number[] = [];
//   totalPages: number = 0;
//   searchTerm: string = '';

//   ngOnInit() {
//     this.calculatePages();
//     this.getTournaments();
//   }

//   calculatePages() {
//     this.totalPages = Math.ceil(this.data.length / this.tournamentsPerPage);
//     this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
//   }

//   getTournaments() {
//     const startIndex = (this.currentPage - 1) * this.tournamentsPerPage;
//     const endIndex = startIndex + this.tournamentsPerPage;
//     this.displayedTournaments = this.data.slice(startIndex, endIndex);
//   }

//   selectvaluesIntournament(page: number) {
//     this.currentPage = page;
//     this.getTournaments();
//   }

//   previousPage() {
//     if (this.currentPage > 1) {
//       this.currentPage--;
//       this.getTournaments();
//     }
//   }

//   nextPage() {
//     if (this.currentPage < this.totalPages) {
//       this.currentPage++;
//       this.getTournaments();
//     }
//   }
// }

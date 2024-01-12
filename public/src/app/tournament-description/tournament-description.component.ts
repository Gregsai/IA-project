import { Component, AfterViewInit, ElementRef } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { defaults as defaultControls } from 'ol/control';
import { useGeographic } from 'ol/proj';
import { ActivatedRoute } from '@angular/router';
import { TournamentsService } from '../tournaments.service';
import { GeocodingService } from '../geocoding.service';

@Component({
  selector: 'app-tournament-description',
  templateUrl: './tournament-description.component.html',
  styleUrls: ['./tournament-description.component.css']
})
export class TournamentDescriptionComponent implements AfterViewInit {
  private map!: Map;
  tournamentData: any;
  tournamentSponsors: any;
  tournamentParticipants: any;
  address = '1600 Amphitheatre Parkway, Mountain View, CA';
  latitude: number = 1;
  longitude: number = 1;

  constructor(
    private elementRef: ElementRef,
    private route: ActivatedRoute,
    private tournamentsService: TournamentsService,
    private geocodingService: GeocodingService
  ) {}

  ngOnInit() {
    this.geocodeAddress();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const mapContainer = this.elementRef.nativeElement.querySelector('.map-container');
      if (mapContainer.clientWidth > 0 && mapContainer.clientHeight > 0) {
        const tournamentId = this.route.snapshot.params['id'];
        console.log(tournamentId);
        this.initializeMap(mapContainer);
        this.getTournamentInformation(tournamentId);
        this.getTournamentSponsors(tournamentId);
        this.getTournamentParticipantsList(tournamentId);
      } else {
        console.warn('Map container has zero dimensions.');
      }
    }, 0);
  }

  private initializeMap(targetElement: HTMLElement) {
    useGeographic();

    const baseLayer = new TileLayer({
      source: new OSM(),
    });

    this.map = new Map({
      layers: [baseLayer],
      target: targetElement,
      controls: defaultControls({ attribution: false, zoom: false, rotate: false }),
      view: new View({
        center: [0, 0], // Centre initial, sera mis à jour plus tard
        zoom: 15,
      }),
    });
  }

  private updateMapView() {
    const latitude = parseFloat(this.latitude.toString());
    const longitude = parseFloat(this.longitude.toString());

    if (this.map && latitude && longitude) {
      this.map.getView().setCenter([longitude, latitude]);
    }
  }

  private getTournamentInformation(tournamentId: string) {
    this.tournamentsService.getTournamentInformation(tournamentId).subscribe(
      (data) => {
        this.tournamentData = data;
        this.address = this.tournamentData.address;
        this.geocodeAddress();
      },
      (error) => {
        console.error('Error fetching tournament information:', error);
      }
    );
  }

  private getTournamentSponsors(tournamentId: string) {
    this.tournamentsService.getTournamentSponsors(tournamentId).subscribe(
      (data) => {
        console.log('Tournament Sponsors:', data);
        console.log("addresses:", data.address)
        this.tournamentSponsors = data;
      },
      (error) => {
        console.error('Error fetching tournament sponsors:', error);
      }
    );
  }

  private getTournamentParticipantsList(tournamentId: string) {
    this.tournamentsService.getTournamentParticipantsList(tournamentId).subscribe(
      (data) => {
        this.tournamentParticipants = data;

        this.updateMapView();
      },
      (error) => {
        console.error('Error fetching tournament participants:', error);
      }
    );
  }

  geocodeAddress() {
    this.geocodingService.geocode(this.address).subscribe(
      (data: any) => {
        console.log("address", this.address)
        if (data.length > 0) {
          this.latitude = data[0].lat;
          this.longitude = data[0].lon;
        } else {
          console.error('Geocoding result is empty');
        }

        this.updateMapView();
      },
      (error) => {
        console.error('Error during geocoding:', error);
      }
    );
  }
}

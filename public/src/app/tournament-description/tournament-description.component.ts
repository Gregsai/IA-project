import { Component, AfterViewInit, ElementRef } from '@angular/core';
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tournament-description',
  templateUrl: './tournament-description.component.html',
  styleUrls: ['./tournament-description.component.css']
})
export class TournamentDescriptionComponent implements AfterViewInit {
  private map!: Map;

  constructor(
    private elementRef: ElementRef,
    private route: ActivatedRoute) {

    }

    ngAfterViewInit(): void {
      setTimeout(() => {
        const mapContainer = this.elementRef.nativeElement.querySelector('.map-container');

        if (mapContainer.clientWidth > 0 && mapContainer.clientHeight > 0) {
          const tournamentId = this.route.snapshot.params['id'];
          console.log(tournamentId)
          this.initializeMap(mapContainer);
        } else {
          console.warn("Map container has zero dimensions.");
        }
      }, 0);
    }

  private initializeMap(targetElement: HTMLElement) {
    const baseLayer = new TileLayer({
      source: new OSM(),
    });

    this.map = new Map({
      layers: [baseLayer],
      target: targetElement,
      view: new View({
        center: [0, 0],
        zoom: 10,
      })
    });
  }
}

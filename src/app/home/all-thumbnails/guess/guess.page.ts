import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as L from 'leaflet';
import { latLng, MapOptions, marker, Marker, tileLayer, Map, LatLng } from 'leaflet';
import { Thumbnail } from 'src/app/models/thumbnail';
import { ThumbnailsService } from 'src/app/services/thumbnails.service';
import { GuessesService } from 'src/app/services/guesses.service';
import { NavController } from '@ionic/angular';
import { User } from 'src/app/models/user';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
import { defaultIcon } from 'src/app/models/marker';

@Component({
  selector: 'app-guess',
  templateUrl: './guess.page.html',
  styleUrls: ['./guess.page.scss'],
})

export class GuessPage implements OnInit {
  thumbnail: Thumbnail;
  guessId: string;
  mapMarkers: Marker[];
  latitude: number;
  longitude: number;
  user: User;
  isLoading = false;
  private thumbnailSub: Subscription;
  mapOptions: MapOptions;
  
  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private guessesService:GuessesService,
    private thumbnailsService: ThumbnailsService,
    private navCtrl: NavController,
    ) {
    this.mapOptions = {
      layers: [
        tileLayer(
          'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          { maxZoom: 30 }
        )
      ],
      zoom: 13,
      center: latLng(46.778186, 6.641524)
    };/*
    this.mapMarkers = [
      marker([ 46.778186, 6.641524 ], { icon: defaultIcon }),
      marker([ 46.780796, 6.647395 ], { icon: defaultIcon }),
      marker([ 46.784992, 6.652267 ], { icon: defaultIcon })
    ];*/
  }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('guessId')) {
        this.navCtrl.navigateBack('/home/all-thumbnails');
        return;
      }
      this.guessId = paramMap.get('guessId');
      this.isLoading = true;
      this.thumbnailSub = this.thumbnailsService
      .getThumbnail(paramMap.get('guessId'))
      .subscribe(
        thumbnail => {
          this.thumbnail = thumbnail;
          this.isLoading = false;
        }
      )
    });
  }

  onMapReady(map: Map) {
    setTimeout(() => map.invalidateSize(), 0);
    var popup = L.popup();

    map.on('click', (e: L.LeafletMouseEvent) => {
      console.log(e);
      popup
      .setLatLng(e.latlng)
      .setContent("You clicked the map at " + e.latlng.toString())
      .openOn(map);

      this.latitude = e.latlng.lat;
      this.longitude = e.latlng.lng;

      console.log(this.latitude);
      console.log(this.longitude);      
    });
  }


  onValidate() {
  //get values
    this.auth.getUser().subscribe(user => {
      this.user = user;
    });

    console.log(this.thumbnail.location.coordinates[0]);
    //var score = this.thumbnail.location.coordinates[];

    console.log(this.latitude);
    console.log(this.longitude);

    const data = {
      "thumbnail_id": this.thumbnail._id,
      "user_id": this.user._id,
      "score": 35,
      "location": {"type": "Point", "coordinates": [this.longitude, this.latitude ]}
    }

    console.log("debug");
    this.guessesService.postGuess(data);
  }


  public myClass = 'show';
  public iconRight = 'hide';
  public buttonIcon: string = "arrow-dropdown";
  public availableIcon = "";

  setButton() {
    this.availableIcon = "checkmark";
  }

  toggleClass(){
    if (this.myClass=="show") {
      this.myClass='hide';
    } else {
      this.myClass='show';
    };
    if (this.iconRight=="hide") {
      this.iconRight='show';
    } else {
      this.iconRight='hide';
    };
    if (this.buttonIcon === 'arrow-dropright') {
      this.buttonIcon = "arrow-dropdown";
    }
    else if (this.buttonIcon === 'arrow-dropdown') {
      this.buttonIcon = "arrow-dropright";
    }
  }
}




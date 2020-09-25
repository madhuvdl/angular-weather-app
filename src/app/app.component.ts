import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { WeatherService } from './services/weather.service';
import { IWeatherData } from './models/IWeatherData.interface';
import { IWeatherRawData } from './models/IWeatherRawData.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'My Weather App';
  cityDetails: IWeatherData;

  constructor(
    private weatherService: WeatherService,
    ) {}

    ngOnInit() {
    }

  getCityDetails(woeid) {
    /*
      CHALLENGE
       - pass the city id to service.getCityDetails(woeid)
    */
   this.weatherService.getCityDetails(woeid)
    // .subscribe((data: any) => this.rawData = data);
    .subscribe((data: any) => {
      this.cityDetails = this.weatherService.transformRawData(data);
      return this.cityDetails;
    });
  }
}

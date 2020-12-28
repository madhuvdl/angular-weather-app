import { ICityWeather } from './../models/IWeatherData.interface';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { IWeatherRawData } from '../models/IWeatherRawData.interface';
import { ISearchResult, IWeatherData } from '../models/IWeatherData.interface';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(
    private http: HttpClient,
  ) { }

  baseUrl = 'https://cors-anywhere.herokuapp.com/https://www.metaweather.com';


  searchLocation(term): Observable<ISearchResult[]> {
    /*
      CHALLANGE
       - get list of cities based on the searched string
       sample url: baseUrl/api/location/search/?query=paris
    */
   if (!term.trim()) {
    return null;
   }
   return this.http.get<ISearchResult[]>(this.baseUrl + '/api/location/search/?query=' + term);

  }

  getCityDetails(woeid): Observable<IWeatherData> {
    /*
      woeid is the city id(number).
      you can use below sample url to fetch the city weather details
      sample url : baseUrl/api/location/111111
    */
   /*
   CHALLENGE
   - fetch the city weather data
   - transform the received data to required "IWeatherData" format using transformRawData() func
   */

    return this.http.get<IWeatherData>(this.baseUrl + '/api/location/' + woeid);

  }

    transfromDate(date) {
        console.log('Dat', date);
        const dateInput = date.split('-');
        const event = new Date(Date.UTC(dateInput[0], dateInput[1], dateInput[2]));
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        // console.log(event.toLocaleDateString(undefined, options));
        return event.toLocaleDateString(undefined, options);
      }

  transformRawData(rawData: IWeatherRawData) {
    const transformedWeather: Array<ICityWeather> = [];

    const options = { year: 'numeric', month: 'short', day: 'numeric' };


    rawData.consolidated_weather.splice(0, 4).forEach(function(obj) {

      console.log('obj.applicable_date ', obj.applicable_date);
      const dateInput = obj.applicable_date.split('-');
      const year = Number(dateInput[0]);
      const month = Number(dateInput[1]) - 1;
      const day = Number(dateInput[2]);
      const event = new Date(Date.UTC(year, month, day));
      // const date = event.toLocaleDateString(undefined, options);
      const date = obj.applicable_date;
      const temperature = obj.the_temp;
      const weather_name = obj.weather_state_name.trim();
      const image_path = weather_name.toLowerCase().split(' ').length > 1;
      let img_Url;
      if (image_path) {
        img_Url = weather_name.split(' ')[0].charAt(0).toLowerCase() + weather_name.split(' ')[1].charAt(0).toLowerCase();
      } else {
        img_Url = weather_name.split(' ')[0].charAt(0).toLowerCase();
      }
      const weather_image = `https://www.metaweather.com/static/img/weather/${img_Url}.svg`;

      transformedWeather.push({ date, temperature, weather_name, weather_image } as ICityWeather);
    });

    return {
      city: rawData.title,
      title: rawData.title,
      country: rawData.parent.title,
      weather: transformedWeather,
      consolidated_weather: [],
      parent: {
        title: rawData.parent.title
      }
    };
  }



}


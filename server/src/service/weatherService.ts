import dotenv from 'dotenv';
import { get } from 'http';
dotenv.config();

// interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// class for the Weather object
class Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: string;
  windSpeed: string;
  humidity: string;

  constructor(
    city: string,
    date: string,
    icon: string,
    iconDescription: string,
    tempF: string,
    windSpeed: string,
    humidity: string
  ) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  baseURL?: string; 
  apiKey?: string;
  cityName: string; 

  constructor () {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
    this.cityName = '';
  }
  // fetchLocationData method
  private async fetchLocationData(query: string) {
    try {
      const response = await fetch(query); 
      const locationData = await response.json();
      return locationData[0];
    }
    catch (err) {
      console.log('Error: ', err);
      return err;
    }
  }
  private destructureLocationData(locationData: any): Coordinates{
     return { 
      lat: locationData.lat,
      lon: locationData.lon 
    };
  }
  private buildGeocodeQuery(): string {
    return `${this.baseURL}/geo/1.0/direct?q=${this.cityName}&appid=${this.apiKey}`;
  }
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
  }
  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    return await this.destructureLocationData(this.fetchLocationData(this.buildGeocodeQuery()));
  }
  private async fetchWeatherData(coordinates: Coordinates) {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    const weatherData = await response.json();
    return weatherData.list;
  }
  private buildForecastArray(weatherData: any[]) {
    let forecastArray: Weather[] = weatherData.map(i=>{
      const forecast = new Weather(
        this.cityName, 
        i.dt, 
        i.weather.icon, 
        i.weather.description, 
        i.main.temp, 
        i.wind.speed, 
        i.main.humidity
      )
      return forecast;
    });
    return forecastArray;
  }
  async getWeatherForCity(city: string) {
    this.cityName = city;
    const forecastArray = this.buildForecastArray(await this.fetchWeatherData(await this.fetchAndDestructureLocationData()));
    return forecastArray;
  }
}

export default new WeatherService();

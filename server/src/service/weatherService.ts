import dotenv from 'dotenv';
// import { get } from 'http';
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
  private async fetchLocationData(query: string) {
    try {
      const response = await fetch(query); 
      const locationData = await response.json();
      return locationData;
    }
    catch (err) {
      console.log('Error: ', err);
      return err;
    }
  }
  private destructureLocationData(locationData: any): Coordinates{
    const coords = {
      lat: locationData[0].lat,
      lon: locationData[0].lon
    };
    return coords;
  }
  private buildGeocodeQuery(): string {
    return `${this.baseURL}/geo/1.0/direct?q=${this.cityName},US&appid=${this.apiKey}`;
  }
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`;
  }
  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    return await this.destructureLocationData(await this.fetchLocationData(this.buildGeocodeQuery()));
  }
  private async fetchWeatherData(coordinates: Coordinates) {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    const weatherData = await response.json();
    return weatherData.list;
  }
  private buildForecastArray(weatherData: any[]) {
    let forecastArray: Weather[] = [];
    for (let i = 0; i < weatherData.length; i+=7){
      const forecast = new Weather(
        this.cityName, 
        weatherData[i].dt_txt, 
        weatherData[i].weather[0].icon, 
        weatherData[i].weather[0].description, 
        weatherData[i].main.temp, 
        weatherData[i].wind.speed, 
        weatherData[i].main.humidity
      );
      forecastArray.push(forecast);
    }
    return forecastArray;
  }
  async getWeatherForCity(city: string) {
    this.cityName = city;
    const forecastArray = this.buildForecastArray(await this.fetchWeatherData(await this.fetchAndDestructureLocationData()));
    return forecastArray;
  }
}

export default new WeatherService();

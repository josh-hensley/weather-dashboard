import fs from 'node:fs/promises'

class City {
  name: string;
  id: number;

  constructor (
    name: string, 
    id: number
  ){
    this.name = name;
    this.id = id;
  } 
}

// TODO: Complete the HistoryService class
class HistoryService {
  // read method that reads from the searchHistory.json file
  private async read() {
    return await fs.readFile('db/db.json', {
      flag: 'a+',
      encoding: 'utf-8'
    });
  }
  // write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    return await fs.writeFile(
      'db/db.json',
      JSON.stringify(cities, null, '\t')
    );
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    return await this.read().then((cities)=>{
      let parsedCities: City[];
      try {
        parsedCities = [].concat(JSON.parse(cities));
      }
      catch (err) {
        parsedCities = [];
      }
      return parsedCities;
    });
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    if (!city) {
      throw new Error('city cannot be blank');
    }
    const cities = await this.getCities();
    if (cities.find((index)=>index.name === city)){
      return cities
    }
    const newCity: City = new City(city, cities.length);
    const updatedCities = [...cities, newCity];
    this.write(updatedCities);
    return updatedCities;
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}
}

export default new HistoryService();

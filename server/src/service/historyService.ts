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
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
    return await fs.readFile('db/db.json', {
      flag: 'a+',
      encoding: 'utf-8'
    });
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    return await fs.writeFile(
      'db/db.json',
      JSON.stringify(cities, null, '\t')
    );
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    let cities: City[] = [];
    const data = JSON.parse(await this.read());
    data.forEach((item: City) => {
      const city = new City(item.name, item.id);
      cities.push(city); 
    });
    return cities;
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    let cities = await this.getCities();
    const newCity = new City(city, cities.length)
    cities.push(newCity);
    this.write(cities);
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}
}

export default new HistoryService();

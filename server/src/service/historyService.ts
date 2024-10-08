
class City {
  name: string;
  id: number;
  constructor (name: string, id: number){
    this.name = name;
    this.id = id;
  } 
}

// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    const searchHistory = await fetch('../../db/db.json')
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    let currentCities = this.getCities();
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    let cities: City[] = [];
    const data = await this.read();
    data.forEach(item=>{
      const city = new City(item.name, item.id);
      cities.push(city); 
    });
    return cities;
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {}
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}
}

export default new HistoryService();

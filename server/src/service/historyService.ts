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

class HistoryService {
  private async read() {
    return await fs.readFile('db/db.json', {
      flag: 'a+',
      encoding: 'utf-8'
    });
  }
  private async write(cities: City[]) {
    return await fs.writeFile(
      'db/db.json',
      JSON.stringify(cities, null, '\t')
    );
  }
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
  async removeCity(id: string) {
    try {
      const idNum = Number.parseInt(id);
      const cities = await this.getCities();
      const filteredCities = cities.filter(city=>{
        return city.id != idNum;
      });
      this.write(filteredCities);
    }
    catch (err){
      console.log(err);
    }
  }
}

export default new HistoryService();

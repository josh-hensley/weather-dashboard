import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

router.post('/', async (req: Request, res: Response) => {
  try {
    const cityName = req.body.cityName;
    const forecast = await WeatherService.getWeatherForCity(cityName);
    HistoryService.addCity(cityName);
    res.json(forecast);
  }
  catch(err) {
    console.log(err);
  }
});

router.get('/history', async (_req: Request, res: Response) => {
  try {
    const history = await HistoryService.getCities();
    res.json(history);
  }
  catch (err){
    console.log(err);
    res.status(500).json(err);
  }
});

router.delete('/history/:id', async (req: Request, _res: Response) => {
  HistoryService.removeCity(req.params.id);
});

export default router;

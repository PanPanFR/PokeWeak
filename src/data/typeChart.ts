import typesRaw from './types.json';
import { validateTypeChart } from './schemas';

export const typeChart = validateTypeChart(typesRaw);

import { Spark } from '../types/spark';
import { clusterSparks } from '../utils/clustering';

export const mapService = {
  clusterSparks: (sparks: Spark[]) => clusterSparks(sparks),
  markerSizeForCount: (count: number) => Math.min(56, 28 + count * 6)
};

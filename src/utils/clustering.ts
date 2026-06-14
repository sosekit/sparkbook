import { Spark, SparkCluster } from '../types/spark';
import { distanceKm } from './distance';

export function clusterSparks(sparks: Spark[], thresholdKm = 0.85): SparkCluster[] {
  const active = sparks.filter((spark) => spark?.id && spark.status === 'active' && Number.isFinite(spark.latitude) && Number.isFinite(spark.longitude));
  const clusters: SparkCluster[] = [];

  for (const spark of active) {
    const existing = clusters.find((cluster) => distanceKm(cluster, spark) <= thresholdKm);
    if (existing) {
      existing.sparks.push(spark);
      existing.count = existing.sparks.length;
      existing.latitude = average(existing.sparks.map((item) => item.latitude));
      existing.longitude = average(existing.sparks.map((item) => item.longitude));
    } else {
      clusters.push({
        id: `cluster-${spark.id}`,
        latitude: spark.latitude,
        longitude: spark.longitude,
        count: 1,
        sparks: [spark],
        markerType: 'single',
        displaySize: 28
      });
    }
  }

  return clusters.map((cluster) => ({
    ...cluster,
    markerType: cluster.count > 1 ? 'cluster' : 'single',
    displaySize: Math.min(64, 28 + cluster.count * 7)
  }));
}

function average(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

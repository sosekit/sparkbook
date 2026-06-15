import { Spark } from '../types/spark';

export const CURRENT_PROFILE_ID = 'profile-ray';

export function canEditSpark(spark?: Pick<Spark, 'createdBy' | 'status'> | null) {
  return Boolean(spark?.status === 'active' && spark.createdBy === CURRENT_PROFILE_ID);
}

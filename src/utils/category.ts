import { categories } from '../data/categories';
import { Spark, SparkCategory } from '../types/spark';

export const DEFAULT_CATEGORY: SparkCategory = {
  id: 'custom',
  name: 'Custom',
  iconKey: 'custom',
  color: '#4E6585',
  createdAt: '2026-01-01T00:00:00.000Z'
};

export function getSafeCategoryId(spark?: Pick<Spark, 'categoryId'> | null) {
  return spark?.categoryId || 'custom';
}

export function getCategoryById(categoryId?: string | null) {
  return categories.find((category) => category.id === categoryId)
    ?? categories.find((category) => category.id === 'custom')
    ?? DEFAULT_CATEGORY;
}

export function getCategoryForSpark(spark?: Pick<Spark, 'categoryId'> | null) {
  return getCategoryById(getSafeCategoryId(spark));
}

import { describe, it } from 'vitest';

describe('Beauty Tracker Auth Gates (BEAU-07)', () => {
  describe('Product actions require authentication', () => {
    it.todo('getBeautyProducts throws Unauthorized without session');
    it.todo('getBeautyProductById throws Unauthorized without session');
    it.todo('createBeautyProduct throws Unauthorized without session');
    it.todo('updateBeautyProduct throws Unauthorized without session');
    it.todo('deleteBeautyProduct throws Unauthorized without session');
    it.todo('toggleFavorite throws Unauthorized without session');
    it.todo('searchBeautyProducts throws Unauthorized without session');
  });
  describe('Category actions require authentication', () => {
    it.todo('getBeautyCategories throws Unauthorized without session');
    it.todo('createBeautyCategory throws Unauthorized without session');
    it.todo('updateBeautyCategory throws Unauthorized without session');
    it.todo('deleteBeautyCategory throws Unauthorized without session');
  });
  describe('Routine actions require authentication', () => {
    it.todo('getRoutinesWithSteps throws Unauthorized without session');
    it.todo('addRoutineStep throws Unauthorized without session');
    it.todo('removeRoutineStep throws Unauthorized without session');
    it.todo('reorderRoutineSteps throws Unauthorized without session');
  });
});

import {
  isset,
  generateId,
} from '../src/utils';

describe('util', () => {
  describe('isset', () => {
    test('returns false if variable is undefined', () => {
      expect(isset()).toBe(false);
    });

    test('returns false if variable is null', () => {
      expect(isset(null)).toBe(false);
    });

    test('returns false if variable is empty string', () => {
      expect(isset('')).toBe(false);
    });

    test('returns true if is defined', () => {
      expect(isset('string')).toBe(true);
      expect(isset(100)).toBe(true);
      expect(isset({})).toBe(true);
      expect(isset([])).toBe(true);
      expect(isset(true)).toBe(true);
      expect(isset(false)).toBe(true);
    });
  });

  describe('gnerateId', () => {
    test('generates random id s with 36 digits', () => {
      const generatedIds = [];
      for (let x = 0; x < 100; x += 1) {
        const newId = generateId();
        expect(newId).toHaveLength(36);
        expect(generatedIds.includes(newId)).toBe(false);
      }
    });
  });
});

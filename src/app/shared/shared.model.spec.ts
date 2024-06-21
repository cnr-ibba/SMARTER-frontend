import { ObjectDate } from './shared.model';

describe('ObjectDate', () => {
  it('should create an instance with a Date object', () => {
    const date = new Date();
    const objectDate = new ObjectDate(date);
    expect(objectDate.$date).toEqual(date);
  });

  it('should create an instance with a string', () => {
    const dateString = '2022-01-01T00:00:00Z';
    const objectDate = new ObjectDate(dateString);
    expect(objectDate.$date).toEqual(new Date(dateString));
  });

  it('should copy the original date for for invalid date string', () => {
    const invalidDateString = 'invalid-date';
    const objectDate = new ObjectDate(invalidDateString);
    expect(objectDate.$date).toEqual(invalidDateString);
  });
});

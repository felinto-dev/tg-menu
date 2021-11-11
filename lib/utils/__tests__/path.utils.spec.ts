import { sanitizeMenuPath } from '../path.utils';

describe(sanitizeMenuPath.name, () => {
  it('should throws an error when have does not have slashes in beginner or end', () => {
    expect(() => sanitizeMenuPath('producer/accounts')).toThrow();
    expect(() => sanitizeMenuPath('/producer/accounts')).toThrow();
    expect(() => sanitizeMenuPath('producer/accounts/')).toThrow();
  });

  it('should throw an error when path is invalid', () => {
    expect(() => sanitizeMenuPath('producer//accounts')).toThrowError();
  });
});

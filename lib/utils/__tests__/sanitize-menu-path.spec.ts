import { sanitizeMenuPath } from '../sanitize-menu-path';

describe(sanitizeMenuPath.name, () => {
  it('should sanitize path slashes', () => {
    const expected = '/producer/accounts/';
    expect(sanitizeMenuPath('producer/accounts')).toEqual(expected);
    expect(sanitizeMenuPath('/producer/accounts')).toEqual(expected);
    expect(sanitizeMenuPath('producer/accounts/')).toEqual(expected);
  });

  it('should throw an error when path is invalid', () => {
    expect(() => sanitizeMenuPath('producer//accounts')).toThrowError();
  });
});

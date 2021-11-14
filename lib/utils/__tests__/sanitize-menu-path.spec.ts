import { sanitizeMenuPath } from '../sanitize-menu-path';

describe(sanitizeMenuPath.name, () => {
  it('should sanitize path slashes', () => {
    const expected = '/producer/accounts/';
    expect(sanitizeMenuPath('producer/accounts')).toEqual(expected);
    expect(sanitizeMenuPath('/producer/accounts')).toEqual(expected);
    expect(sanitizeMenuPath('producer/accounts/')).toEqual(expected);
  });

  it('should normalize when path has double slash ("/")', () => {
    expect(sanitizeMenuPath('producer//accounts')).toEqual(
      '/producer/accounts/',
    );
  });
});

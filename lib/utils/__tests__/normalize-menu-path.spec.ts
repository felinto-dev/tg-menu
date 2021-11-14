import { normalizeMenuPath } from '../normalize-menu-path';

describe(normalizeMenuPath.name, () => {
  it('should sanitize path slashes', () => {
    const expected = '/producer/accounts/';
    expect(normalizeMenuPath('producer/accounts')).toEqual(expected);
    expect(normalizeMenuPath('/producer/accounts')).toEqual(expected);
    expect(normalizeMenuPath('producer/accounts/')).toEqual(expected);
  });

  it('should normalize when path has double slash ("/")', () => {
    expect(normalizeMenuPath('producer//accounts')).toEqual(
      '/producer/accounts/',
    );
  });
});

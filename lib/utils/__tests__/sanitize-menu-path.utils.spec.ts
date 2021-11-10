import { sanitizeMenuPath } from '../sanitize-menu-path.utils';

describe(sanitizeMenuPath.name, () => {
  it('should remove slash in beginner and end of path', () => {
    const expectedOutput = 'producer/accounts';
    expect(sanitizeMenuPath('/producer/accounts')).toEqual(expectedOutput);
    expect(sanitizeMenuPath('/producer/accounts/')).toEqual(expectedOutput);
  });

  it('should throw an error when path is invalid', () => {
    expect(() => sanitizeMenuPath('producer//accounts')).toThrowError();
  });
});

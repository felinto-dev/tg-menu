import { RequestMethod } from '@nestjs/common';
import { generatePathRegex, parsePath, sanitizeMenuPath } from '../path.utils';

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

describe(generatePathRegex.name, () => {
  it('should match simple callback URL style', () => {
    expect('GET /producer/products/').toMatch(
      generatePathRegex(RequestMethod.GET, '/producer/products/'),
    );
    expect('POST /producer/products/').toMatch(
      generatePathRegex(RequestMethod.POST, '/producer/products/'),
    );
    expect('POST /producer/products/').not.toMatch(
      generatePathRegex(RequestMethod.GET, '/producer/products/'),
    );
  });

  it('should match callback with path parameters', () => {
    expect('GET /producer/products/1/').toMatch(
      generatePathRegex(RequestMethod.GET, '/producer/products/:productId/'),
    );
    expect('POST /producer/products/123/456/').toMatch(
      generatePathRegex(
        RequestMethod.POST,
        '/producer/products/:productId/:groupId/',
      ),
    );
    expect('POST /producer/products/1/').not.toMatch(
      generatePathRegex(RequestMethod.GET, '/producer/products/:productId/'),
    );
  });

  it('should match callback with query parameters', () => {
    expect('GET /producer/products/?page=1').toMatch(
      generatePathRegex(RequestMethod.GET, '/producer/products/'),
    );
    expect('GET /producer/products/?page=1&sortBy=downloads').toMatch(
      generatePathRegex(RequestMethod.GET, '/producer/products/'),
    );
  });
});

describe(parsePath.name, () => {
  it('should parse path parameters', () => {
    expect(
      parsePath(
        'GET /producer/products/1/',
        'GET /producer/products/:productId/',
      ).params,
    ).toStrictEqual({
      productId: '1',
    });

    expect(
      parsePath(
        'GET /producer/products/123/456/',
        'GET /producer/products/:productId/:groupId/',
      ).params,
    ).toStrictEqual({
      productId: '123',
      groupId: '456',
    });
  });
});

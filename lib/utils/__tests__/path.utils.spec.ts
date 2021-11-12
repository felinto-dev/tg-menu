import { RequestMethod } from '@nestjs/common';
import {
  pathToRegex,
  parsePath,
  sanitizeMenuPath,
  generatePathSubmenu,
} from '../path.utils';

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

describe(pathToRegex.name, () => {
  it('should match simple callback URL style', () => {
    expect('GET /producer/products/').toMatch(
      pathToRegex(RequestMethod.GET, '/producer/products/'),
    );
    expect('POST /producer/products/').toMatch(
      pathToRegex(RequestMethod.POST, '/producer/products/'),
    );
    expect('POST /producer/products/').not.toMatch(
      pathToRegex(RequestMethod.GET, '/producer/products/'),
    );
    expect('GET /').toMatch(pathToRegex(RequestMethod.GET, '/'));
  });

  it('should match callback with path parameters', () => {
    expect('GET /producer/products/1/').toMatch(
      pathToRegex(RequestMethod.GET, '/producer/products/:productId/'),
    );
    expect('POST /producer/products/123/456/').toMatch(
      pathToRegex(
        RequestMethod.POST,
        '/producer/products/:productId/:groupId/',
      ),
    );
    expect('POST /producer/products/1/').not.toMatch(
      pathToRegex(RequestMethod.GET, '/producer/products/:productId/'),
    );
  });

  it('should match callback with query parameters', () => {
    expect('GET /producer/products/?page=1').toMatch(
      pathToRegex(RequestMethod.GET, '/producer/products/'),
    );
    expect('GET /producer/products/?page=1&sortBy=downloads').toMatch(
      pathToRegex(RequestMethod.GET, '/producer/products/'),
    );
  });
});

describe(parsePath.name, () => {
  it('should parse path parameters', () => {
    expect(
      parsePath(
        'GET /producer/products/:productId/',
        'GET /producer/products/1/',
      ).params,
    ).toStrictEqual({
      productId: '1',
    });
  });

  it('should parse two path parameters', () => {
    expect(
      parsePath(
        'GET /producer/products/:productId/:groupId/',
        'GET /producer/products/123/456/',
      ).params,
    ).toStrictEqual({
      productId: '123',
      groupId: '456',
    });
  });

  it('should parse query parameters', () => {
    expect(
      parsePath(
        'GET /producer/products/:productId/:groupId/',
        'GET /producer/products/123/456?page=1',
      ).query,
    ).toStrictEqual({
      page: '1',
    });
  });

  it('should parse multiple query parameters', () => {
    expect(
      parsePath(
        'GET /producer/products/:productId/:groupId/',
        'GET /producer/products/123/456/?page=1&sortBy=downloads',
      ),
    ).toStrictEqual({
      query: { page: '1', sortBy: 'downloads' },
      params: {
        productId: '123',
        groupId: '456',
      },
    });
  });
});

describe(generatePathSubmenu.name, () => {
  it('generate submenu path', () => {
    expect(generatePathSubmenu('/', 'test')).toEqual('/test');
    expect(generatePathSubmenu('/producer/', 'products')).toEqual(
      'GET /producer/products/',
    );
    expect(generatePathSubmenu('/producer?page=1', 'products')).toEqual(
      'GET /producer/products/',
    );
    expect(generatePathSubmenu('/producer?page=1/', 'products')).toEqual(
      'GET /producer/products/',
    );
  });

  it('should does not populate query parameters when extra params is an empty object', () => {
    expect(
      generatePathSubmenu('/producer/', 'products', RequestMethod.GET, {}),
    ).toEqual('GET /producer/products/');
  });

  it('generate submenu path with query parameters', () => {
    expect(
      generatePathSubmenu('/producer/', 'products', RequestMethod.GET, {
        page: '2',
        sortBy: 'downloads',
      }),
    ).toEqual('GET /producer/products?page=2&sortBy=downloads/');
  });

  it('generate submenu path with custom request method', () => {
    expect(
      generatePathSubmenu('/producer/', 'products', RequestMethod.POST),
    ).toEqual('POST /producer/products/');
  });
});
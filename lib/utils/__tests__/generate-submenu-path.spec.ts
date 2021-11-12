import { RequestMethod } from '@nestjs/common';

import { generateSubmenuPath } from '../generate-submenu-path';

describe(generateSubmenuPath.name, () => {
  it('generate submenu path', () => {
    expect(generateSubmenuPath('GET /', 'test')).toEqual('GET /test/');
    expect(generateSubmenuPath('GET /producer/', 'products')).toEqual(
      'GET /producer/products/',
    );
    expect(generateSubmenuPath('GET /producer?page=1', 'products')).toEqual(
      'GET /producer/products/',
    );
    expect(generateSubmenuPath('GET /producer?page=1/', 'products')).toEqual(
      'GET /producer/products/',
    );
  });

  it('should generate submenu path when current path has query parameters', () => {
    expect(generateSubmenuPath('GET /products/?page=2', 'productId')).toEqual(
      'GET /products/productId/',
    );
  });

  it('should does not populate query parameters when extra params is an empty object', () => {
    expect(
      generateSubmenuPath('GET /producer/', 'products', RequestMethod.GET, {}),
    ).toEqual('GET /producer/products/');
  });

  it('generate submenu path with query parameters', () => {
    expect(
      generateSubmenuPath('GET /producer/', 'products', RequestMethod.GET, {
        page: '2',
        sortBy: 'downloads',
      }),
    ).toEqual('GET /producer/products?page=2&sortBy=downloads/');
  });

  it('generate submenu path with custom request method', () => {
    expect(
      generateSubmenuPath('GET /producer/', 'products', RequestMethod.POST),
    ).toEqual('POST /producer/products/');
  });
});

import { RequestMethod } from '@nestjs/common';

import { pathToRegex } from '../path-to-regex';

describe(pathToRegex.name, () => {
  it('should match simple callback URL style', () => {
    expect('GET /producer/products/').toMatch(
      pathToRegex(RequestMethod.GET, '/producer/products/'),
    );
    expect('POST /producer/products/').toMatch(
      pathToRegex(RequestMethod.POST, '/producer/products/'),
    );
    expect('GET /').toMatch(pathToRegex(RequestMethod.GET, '/'));

    expect('POST /producer/products/').not.toMatch(
      pathToRegex(RequestMethod.GET, '/producer/products/'),
    );
    expect('GET /producer/products/').not.toMatch(
      pathToRegex(RequestMethod.GET, '/producer/'),
    );
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
    expect('GET /producer/products/?page=1/').toMatch(
      pathToRegex(RequestMethod.GET, '/producer/products/'),
    );
    expect('GET /producer/products/?page=1&sortBy=downloads/').toMatch(
      pathToRegex(RequestMethod.GET, '/producer/products/'),
    );
  });
});

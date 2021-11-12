import { parsePath } from '../parse-path';

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

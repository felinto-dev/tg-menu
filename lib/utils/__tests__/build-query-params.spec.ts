import { buildQueryParams } from '../build-query-params';

describe(buildQueryParams.name, () => {
  it('should return 1 query parameter', () => {
    expect(
      buildQueryParams('GET /producer/accounts/', {
        page: '1',
      }),
    ).toEqual('GET /producer/accounts/?page=1/');
  });

  it('should return 2 query parameter', () => {
    expect(
      buildQueryParams('GET /producer/accounts/', {
        page: '1',
        sortBy: 'downloads',
      }),
    ).toEqual('GET /producer/accounts/?page=1&sortBy=downloads/');
  });

  it('should remove query parameters', () => {
    expect(
      buildQueryParams('GET /producer/accounts/?page=1/', {
        page: '1',
      }),
    ).toEqual('GET /producer/accounts/?page=1/');
  });
});

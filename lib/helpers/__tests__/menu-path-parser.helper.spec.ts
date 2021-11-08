import { MenuPathParser } from '../menu-path-parser.helper';

describe(MenuPathParser.name, () => {
  it('should throws an error when template does not starts with "/"', () => {
    const template = 'producer/products';
    expect(() => new MenuPathParser(template)).toThrowError();
  });

  it('should match only correct routes', () => {
    const template = '/producer/products/:productId';
    const regex = new MenuPathParser(template).templateToRegex();
    expect(regex.test('/producer/products/teste1')).toBeTruthy();
    expect(regex.test('/producer/products/teste1?a=1')).toBeTruthy();
    expect(regex.test('/producer/products/teste1?a=1&b=2')).toBeTruthy();
    expect(regex.test('/producer/products/teste1?')).not.toBeTruthy();
    expect(regex.test('/producer/products/111111/group')).not.toBeTruthy();
    expect(regex.test('/producer/products/111111?a=1/group')).not.toBeTruthy();
    expect(regex.test('/producer/products/11111?a=111/')).not.toBeTruthy();
  });

  it('should return path parameters', () => {
    expect(
      new MenuPathParser('/producer/products/:productId').parse(
        '/producer/products/TEST',
      ).params.productId,
    ).toEqual('TEST');

    expect(
      new MenuPathParser('/producer/products/:productId/:groupId').parse(
        '/producer/products/TEST/111',
      ).params.groupId,
    ).toEqual('111');
  });

  it('should return query parameters', () => {
    expect(
      new MenuPathParser('/producer/products/:productId').parse(
        '/producer/products/TEST?page=1',
      ).query.page,
    ).toEqual('1');

    expect(
      new MenuPathParser('/producer/products/:productId').parse(
        '/producer/products/TEST?page=1&author=felipe',
      ).query.author,
    ).toEqual('felipe');

    expect(
      new MenuPathParser('/producer/products/:productId/:groupId').parse(
        '/producer/products/TEST/groupId?sortBy=alphabetic',
      ).query.sortBy,
    ).toEqual('alphabetic');
  });
});

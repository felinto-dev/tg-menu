import { RequestMethod } from '@nestjs/common';

import { MenuPathParser } from '../menu-path-parser.helper';

describe(MenuPathParser.name, () => {
  describe('template', () => {
    it('should match only correct routes', () => {
      const template = '/producer/products/:productId';
      const regex = new MenuPathParser(
        RequestMethod.GET,
        template,
      ).templateToRegex();
      expect(regex.test('GET /producer/products/teste1')).toBeTruthy();
      expect(regex.test('GET /producer/products/teste1/')).toBeTruthy();
      expect(regex.test('GET /producer/products/teste1?a=1')).toBeTruthy();
      expect(regex.test('GET /producer/products/teste1?a=1&b=2')).toBeTruthy();
      expect(regex.test('GET /producer/products/11111?a=111/')).toBeTruthy();
      expect(regex.test('GET /producer/products/teste1?')).not.toBeTruthy();
      expect(
        regex.test('GET /producer/products/111111/group'),
      ).not.toBeTruthy();
      expect(
        regex.test('GET /producer/products/111111?a=1/group'),
      ).not.toBeTruthy();
    });
  });

  describe('path parameters', () => {
    it('should return path parameters', () => {
      expect(
        new MenuPathParser(
          RequestMethod.GET,
          '/producer/products/:productId',
        ).parse('GET /producer/products/TEST').params.productId,
      ).toEqual('TEST');

      expect(
        new MenuPathParser(
          RequestMethod.GET,
          '/producer/products/:productId/:groupId',
        ).parse('GET /producer/products/TEST/111').params.groupId,
      ).toEqual('111');
    });
  });

  describe('query parameters', () => {
    it('should return query parameters', () => {
      expect(
        new MenuPathParser(
          RequestMethod.GET,
          '/producer/products/:productId',
        ).parse('GET /producer/products/TEST?page=1').query.page,
      ).toEqual('1');

      expect(
        new MenuPathParser(
          RequestMethod.GET,
          '/producer/products/:productId',
        ).parse('GET /producer/products/TEST?page=1&author=felipe').query
          .author,
      ).toEqual('felipe');

      expect(
        new MenuPathParser(
          RequestMethod.GET,
          '/producer/products/:productId/:groupId',
        ).parse('GET /producer/products/TEST/groupId?sortBy=alphabetic').query
          .sortBy,
      ).toEqual('alphabetic');
    });
  });

  describe('submenu', () => {
    it('should generate submenu using the GET request method', () => {
      const stu = new MenuPathParser(RequestMethod.GET, '/producer/accounts');

      expect(stu.parse('GET /producer/accounts').submenu('products')).toEqual(
        'GET /producer/accounts/products',
      );
    });
  });
});

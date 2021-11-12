import { RequestMethod } from '@nestjs/common';

export class MenuPathParser {
  constructor(
    private readonly requestMethod: RequestMethod,
    public template: string,
  ) {
    this.sanitizeTemplate();
    this.validateTemplate();
  }

  public path: string;

  public regexLibrary = {
    queryParameters: /(\?|&)([^=]+)=([^&/]+)/,
    pathParameters: /:(?<regexKey>[a-z]+)(<(?<regexTemplate>[a-z]+)>)?/i,
  };

  private sanitizeTemplate() {
    if (!this.template.startsWith('/')) {
      this.template = `/${this.template}`;
    }
    if (!this.template.endsWith('/')) {
      this.template += '/';
    }
  }

  private validateTemplate() {
    if (this.template.match(/\/\//)) {
      throw new Error();
    }
  }

  private resolvePathParametersRegex() {
    const paths = this.template.split('/');

    return paths
      .map((path) => {
        const pathParametersMatch = this.regexLibrary.pathParameters.exec(path);

        if (pathParametersMatch) {
          const { regexKey } = pathParametersMatch.groups;
          return `(?<${regexKey}>[a-z\\d\\-_]+)`;
        }

        return path;
      })
      .join('/');
  }

  templateToRegex(): RegExp {
    const menuPath = this.resolvePathParametersRegex();
    const queryParametersRegex = this.regexLibrary.queryParameters.source;
    return new RegExp(
      `^${menuPath}(?<queryParams>${queryParametersRegex})*/?$`,
      'i',
    );
  }

  private parseQueries(path: string) {
    return Object.fromEntries(
      new URLSearchParams(
        this.templateToRegex().exec(path)?.groups.queryParams,
      ),
    );
  }

  removeQueryParameters(path: string) {
    return path.replace(this.regexLibrary.queryParameters, '');
  }

  private parsePathParameters(path: string) {
    const params = path.match(this.templateToRegex()).groups;
    return JSON.parse(JSON.stringify(params)); // hack for remove undefined values
  }

  parse(path: string) {
    if (!path.match(this.templateToRegex())) {
      return null;
    }

    return {
      query: this.parseQueries(path),
      params: this.parsePathParameters(path),
      submenu: (subMenuPath: string) => `${path}/${subMenuPath}`,
    };
  }
}

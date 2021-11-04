import { InternalServerErrorException } from '@nestjs/common';

export class MenuPathParser {
  constructor(public readonly template: string) {
    if (!this.template.startsWith('/')) {
      throw new InternalServerErrorException(
        `The template "${template}" is invalid!`,
      );
    }
  }

  public path: string;

  private regexLibrary = {
    queryParameters: /(\?|&)([^=]+)=([^&]+)/,
    pathParameters: /:(?<regexKey>[a-z]+)(<(?<regexTemplate>[a-z]+)>)?/i,
  };

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
      `^${menuPath}(?<queryParams>${queryParametersRegex})?$`,
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

import 'express';

declare module 'express-serve-static-core' {
  interface Request {
    __(phraseOrOptions: string, ...replace: unknown[]): string;
    __n?(phrase: string, count: number, ...replace: unknown[]): string;
  }
}

declare global {
  // eslint-disable-next-line no-var
  var i18n: {
    __: (key: string, params?: Record<string, unknown>) => string;
    setLocale?: (locale: string) => void;
    getLocale?: () => string;
    [key: string]: unknown;
  };
  interface Global extends NodeJS.Global {
    i18n: {
      __: (key: string, params?: Record<string, unknown>) => string;
      setLocale?: (locale: string) => void;
      getLocale?: () => string;
      [key: string]: unknown;
    };
  }
}

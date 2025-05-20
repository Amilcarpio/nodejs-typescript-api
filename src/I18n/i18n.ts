import path from 'path';
import i18n from 'i18n';

/**
 * Sets up and configures i18n (internationalization) for the application.
 * Loads translation files and attaches i18n to the global context.
 */
export function setupI18n() {
  i18n.configure({
    locales: ['pt', 'en'],
    defaultLocale: 'pt',
    directory: path.join(__dirname),
    objectNotation: true,
    autoReload: false,
    updateFiles: false,
    syncFiles: false,
    queryParameter: 'lang',
    header: 'accept-language',
    register: global,
  });
  return i18n;
}

export default i18n;

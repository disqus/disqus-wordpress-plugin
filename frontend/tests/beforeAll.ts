import { getDefaultAdminConfig } from './fixtures';

// tslint:disable:no-string-literal
global['__'] = (str: string) => str;
global['DISQUS_WP'] = getDefaultAdminConfig();
// tslint:enable:no-string-literal

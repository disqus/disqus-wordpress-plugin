import { DEFAULT_ADMIN_CONFIG } from './fixtures';

// tslint:disable:no-string-literal
global['__'] = (str: string) => str;
global['DISQUS_WP'] = DEFAULT_ADMIN_CONFIG;
// tslint:enable:no-string-literal

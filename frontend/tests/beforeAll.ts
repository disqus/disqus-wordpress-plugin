import { getDefaultAdminConfig } from './fixtures';

declare var global: any

global.__ = (str: string) => str;
global.DISQUS_WP = getDefaultAdminConfig();

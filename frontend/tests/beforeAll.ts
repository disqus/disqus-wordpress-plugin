import { getDefaultAdminConfig } from './fixtures';

global.__ = (str: string) => str;
global.DISQUS_WP = getDefaultAdminConfig();

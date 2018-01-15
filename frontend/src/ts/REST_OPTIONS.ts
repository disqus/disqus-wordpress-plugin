import { IDisqusWordpressWindow } from './reducers/AdminState';

const WIN = window as IDisqusWordpressWindow;
const REST_OPTIONS = WIN.DISQUS_WP && WIN.DISQUS_WP.rest;

export default REST_OPTIONS;

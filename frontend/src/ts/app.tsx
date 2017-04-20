import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Main from './components/Main';
import { DisqusWordpressWindow } from './plugin';

const WIN = window as DisqusWordpressWindow;

const container: HTMLElement = document.getElementById('disqus-admin');
if (container)
    ReactDOM.render(<Main config={WIN.DISQUS_WP} />, container);

import React from 'react';
import ReactDOM from 'react-dom';
import Main from 'components/Main';

const container = window.document.getElementById('disqus-admin');
if (container)
    ReactDOM.render(<Main />, container);

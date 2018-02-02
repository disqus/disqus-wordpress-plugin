import * as React from 'react';

const HelpResources = () => (
    <ul>
        <li>
            <a href='https://status.disqus.com/' target='_blank'>
                {__('Disqus System Status')}
            </a>
        </li>
        <li>
            <a href='https://github.com/disqus/disqus-wordpress-plugin' target='_blank'>
                {__('Github Project')} (disqus-wordpress-plugin)
            </a>
        </li>
    </ul>
);

export default HelpResources;

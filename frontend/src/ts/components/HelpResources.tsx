import * as React from 'react';

const HelpResources = () => (
    <ul className='description'>
        <li>
            <p>In addition to our free-to-use, ad-supported Basic plan, we also offer ad-optional subscription plans that come with more advanced features and access to priority support. Please see our <a href='' target='_blank'>pricing page</a> for more details.</p>
        </li>
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

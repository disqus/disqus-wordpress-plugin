import * as React from 'react';

const SupportLinks = () => (
    <ul className='dsq-support-list-container'>
        <li className='dsq-support-list-item'>
            <div>
                <a
                    href='https://help.disqus.com/customer/en/portal/articles/472005'
                    target='_blank'
                >
                    <div className='dashicons dashicons-lightbulb dsq-icon-support' />
                    {__('WordPress FAQ')}
                </a>
            </div>
        </li>
        <li className='dsq-support-list-item'>
            <div>
                <a
                    href='https://disqus.com/home/channel/discussdisqus/'
                    target='_blank'
                >
                    <div className='dashicons dashicons-groups dsq-icon-support' />
                    {__('Community Forum')}
                </a>
            </div>
        </li>
        <li className='dsq-support-list-item'>
            <div>
                <a
                    href='https://disqus.com/support/?article=contact_wordpress'
                    target='_blank'
                >
                    <div className='dashicons dashicons-email-alt dsq-icon-support' />
                    {__('Contact Support')}
                </a>
            </div>
        </li>
    </ul>
);

export default SupportLinks;

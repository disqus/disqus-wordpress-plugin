import * as React from 'react';

const latestVersion = '3.0.25';
const updates = [
    'The Disqus Embed will now render properly on sites using WordPress Block Themes in addition to Classic Themes',
    'A refreshed UI for the Disqus plugin admin panel',
    'Robust improvements to manual and automatic syncing: multiple bug fixes and increased allowable manual syncing data range',
    'More informative error messaging in the browser console and plugin UI when encountering issues with manual and automatic syncing for easier troubleshooting'
]

const WhatsNew: React.FC = () => {
    return (
        <div className={'whats-new'}>
            <h2>
                What's New in v{latestVersion}:
            </h2>
            <ul>
                {updates.map((update, index) => <li key={index}>- {update}</li>)}
            </ul>
        </div>
    );
};

export default WhatsNew;

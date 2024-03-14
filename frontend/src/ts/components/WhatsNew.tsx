import * as React from 'react';

const versionNumber = '3.0.25';
const updates = [
    'The Disqus Embed will now render properly on sites using WordPress Block Themes in addition to Classic Themes',
    'A refreshed and improved UI for the Disqus plugin admin panel'
]

const WhatsNew: React.FC = () => {
    return (
        <div className={'whats-new'}>
            <h2>
                What's New in v{versionNumber}:
            </h2>
            <ul>
                {updates.map(update => <li>- {update}</li>)}
            </ul>
        </div>
    );
};

export default WhatsNew;

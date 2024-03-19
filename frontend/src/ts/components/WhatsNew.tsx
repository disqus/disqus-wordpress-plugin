import * as React from 'react';

const latestVersion: String = '3.0.25';
const updates: Array<String> = [
    'The Disqus Embed will now render properly on sites using WordPress Block Themes in addition to Classic Themes',
    'A refreshed UI for the Disqus plugin admin panel',
    'Robust improvements to manual and automatic syncing: multiple bug fixes and increased allowable manual syncing data range',
    'More informative error messaging in the browser console and plugin UI when encountering issues with manual and automatic syncing for easier troubleshooting'
]

const WhatsNew: React.FC = () => {
    const [showWhatsNew, setShowWhatsNew] = React.useState<boolean>(false);

    const handleClick = (): void => {
        setShowWhatsNew(!showWhatsNew);
    }
    return (
        <React.Fragment>
            <button className='button' onClick={handleClick}>{showWhatsNew ? 'Hide' : `What's New in v${latestVersion}?`}</button>
            <div className={`whats-new${showWhatsNew ? '' : ' hidden'}`}>
                <ul>
                    {updates.map((update, index) => <li key={index}>- {update}</li>)}
                </ul>
            </div>
        </React.Fragment>
    );
};

export default WhatsNew;

import * as React from 'react';
import { pricingPolls } from '../constants/links';

const latestVersion: String = '3.1.5';
const updates: Array<String> = [
    'Fixed synced comments attaching to missing WordPress posts and leaving an empty In response to column',
    'Show a Disqus thread link in In response to when a synced comment has no matching local post (WordPress 6.1+)',
]

const WhatsNew: React.FC = () => {
    const [showWhatsNew, setShowWhatsNew] = React.useState<boolean>(false);

    const handleClick = (): void => {
        setShowWhatsNew(!showWhatsNew);
    }
    return (
        <div className={`whats-new${showWhatsNew ? ' visible' : ''}`}>
            <button className='button' onClick={handleClick}>{showWhatsNew ? 'Hide' : `What's New in v${latestVersion}?`}</button>
            <div className={`${showWhatsNew ? '' : ' hidden'}`}>
                <ul>
                    {updates.map((update, index) => <li key={index}>{update}</li>)}
                </ul>
            </div>
        </div>
    );
};

export default WhatsNew;

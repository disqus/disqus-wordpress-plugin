import * as React from 'react';
import { pricingPolls } from '../constants/links';

const latestVersion: String = '3.1.4';
const updates: Array<String> = [
    'Added dismissible admin notice explaining free version ads and paid plan options',
    'Fixed deprecation warning when syncing comments with null author name',
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

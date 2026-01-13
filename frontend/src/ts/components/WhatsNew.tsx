import * as React from 'react';
import { pricingPolls } from '../constants/links';

const latestVersion: String = '3.1.4';
const updates: Array<String> = [
    'Clarify Free Plan Ads',
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
                <li>
                    <a href={pricingPolls} key='pricing-link'>Get started with Disqus Polls today</a>
                </li>
                </ul>
            </div>
        </div>
    );
};

export default WhatsNew;

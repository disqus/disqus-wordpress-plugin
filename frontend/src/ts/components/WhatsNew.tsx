import * as React from 'react';
import { pricingPolls } from '../constants/links';

const latestVersion: String = '3.1.2';
const updates: Array<String> = [
    'Disqus Polls is now live! Engage your audiences with interactive polls, and seamlessly install them on your site.'
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

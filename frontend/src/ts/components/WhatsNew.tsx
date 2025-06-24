import * as React from 'react';
import { pricingPolls } from '../constants/links';

const latestVersion: String = '3.1.3';
const updates: Array<String> = [
    'Fixed bug with Disqus SSO and Gravatar Images',
    'Switched DISQUSVERSION to constant',
    'Fixed comment data issue if post author is null',
    'Fixed various conditions missing type checks',
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

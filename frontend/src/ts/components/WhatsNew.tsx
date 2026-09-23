import * as React from 'react';

const latestVersion: String = '3.1.5';
const MIN_WP_FOR_IN_RESPONSE_COLUMN = '6.1';
const updates: Array<String> = [
    'Fixed synced comments attaching to missing WordPress posts and leaving an empty In response to column',
    'Show a Disqus thread link in In response to when a synced comment has no matching local post (WordPress 6.1+)',
];
const olderWordpressUpdate: String =
    'Notify admins on older WordPress that unmatched synced comments may have an empty In response to column until they upgrade';

interface IWhatsNewProps {
    wordpressVersion?: string;
}

const needsOlderWordpressNotice = (wordpressVersion?: string): boolean => {
    if (!wordpressVersion) {
        return false;
    }

    return wordpressVersion.localeCompare(MIN_WP_FOR_IN_RESPONSE_COLUMN, undefined, { numeric: true }) < 0;
};

const WhatsNew: React.FC<IWhatsNewProps> = ({ wordpressVersion }) => {
    const [showWhatsNew, setShowWhatsNew] = React.useState<boolean>(false);
    const visibleUpdates = needsOlderWordpressNotice(wordpressVersion) ?
        updates.concat(olderWordpressUpdate) :
        updates;

    const handleClick = (): void => {
        setShowWhatsNew(!showWhatsNew);
    };
    return (
        <div className={`whats-new${showWhatsNew ? ' visible' : ''}`}>
            <button className='button' onClick={handleClick}>{showWhatsNew ? 'Hide' : `What's New in v${latestVersion}?`}</button>
            <div className={`${showWhatsNew ? '' : ' hidden'}`}>
                <ul>
                    {visibleUpdates.map((update, index) => <li key={index}>{update}</li>)}
                </ul>
            </div>
        </div>
    );
};

export default WhatsNew;

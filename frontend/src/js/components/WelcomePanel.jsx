import React from 'react';
import { getForumAdminUrl } from 'utils';

const WelcomePanel = props =>
    <div className="welcome-panel">
        <div className="welcome-panel-content">
            <p className="about-description">
                {__('Check out what\'s new')}
            </p>
            <div className="welcome-panel-column-container">
                <div className="welcome-panel-column">
                    <h3>
                        {__('Comments')}
                    </h3>
                    <a
                        className="button button-primary button-hero"
                        href={getForumAdminUrl(props.shortname, 'moderate')}
                    >
                        {__('Moderate')}
                    </a>
                    <p className="description">
                        <a href={getForumAdminUrl(props.shortname, 'filters/banned')} target="_blank">
                            {__('Manage banned users and word filters')}
                        </a>
                    </p>
                </div>
                <div className="welcome-panel-column">
                    <h3>
                        {__('Analytics')}
                    </h3>
                    <ul>
                        <li>
                            <a
                                className="welcome-icon dashicons-megaphone"
                                href={getForumAdminUrl(props.shortname, 'analytics/comments')}
                                target="_blank"
                            >
                                {__('Engagement')}
                            </a>
                        </li>
                        <li>
                            <a
                                className="welcome-icon dashicons-chart-line"
                                href={getForumAdminUrl(props.shortname, 'analytics/revenue')}
                                target="_blank"
                            >
                                {__('Revenue')}
                            </a>
                        </li>
                        <li>
                            <a
                                className="welcome-icon dashicons-heart"
                                href={getForumAdminUrl(props.shortname, 'analytics/content')}
                                target="_blank"
                            >
                                {__('Popular Content')}
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="welcome-panel-column">
                    <h3>
                        {__('Settings')}
                    </h3>
                    <ul>
                        <li>
                            <a
                                className="welcome-icon dashicons-admin-appearance"
                                href={getForumAdminUrl(props.shortname, 'settings/general')}
                                target="_blank"
                            >
                                {__('Identity')}
                            </a>
                        </li>
                        <li>
                            <a
                                className="welcome-icon dashicons-format-chat"
                                href={getForumAdminUrl(props.shortname, 'settings/community')}
                                target="_blank"
                            >
                                {__('Community Rules')}
                            </a>
                        </li>
                        <li>
                            <a
                                className="welcome-icon dashicons-admin-settings"
                                href={getForumAdminUrl(props.shortname, 'settings/advanced')}
                                target="_blank"
                            >
                                {__('Advanced')}
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>;

export default WelcomePanel;

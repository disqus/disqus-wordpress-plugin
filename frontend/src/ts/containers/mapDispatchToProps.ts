import * as moment from 'moment';
import * as Redux from 'redux';
import {
    changeInstallStateAction,
    setMessageAction,
    setValueAction,
    toggleValueAction,
    updateAdminOptionsAction,
    updateLocalOptionAction,
    updateSyncStatusAction,
} from '../actions';
import { DisqusApi } from '../DisqusApi';
import { IAdminOptions } from '../reducers/AdminOptions';
import {
    InstallationState,
} from '../reducers/AdminState';
import { createRandomToken } from '../utils';
import WordPressCommentExporter from '../WordPressCommentExporter';
import {
    IRestResponse,
    WordPressRestApi,
} from '../WordPressRestApi';
import { Moment } from 'moment';

const UPDATABLE_FIELDS: string[] = [
    'disqus_forum_url',
    'disqus_public_key',
    'disqus_secret_key',
    'disqus_admin_access_token',
    'disqus_sso_button',
    'disqus_sso_enabled',
    'disqus_sync_token',
    'disqus_render_js',
];

const valueFromInput = (element: HTMLInputElement): string => {
    const isCheckbox: boolean = element.type === 'checkbox';

    let value: string;
    if (isCheckbox)
        value = element.checked ? '1' : '';
    else
        value = element.value;

    return value;
};


let syncedComments = 0;
let totalSyncedComments = 0;

const syncComments = async (commentQueue: any[], dispatch: Redux.Dispatch<Redux.Action>, commentType: String) => {
    const parallelRequests: Promise <void> [] = [];
    // We need to throttle the amount of parallel sync requests that we make
    // because large forums could be syncing thousands of comments
    // Parent comments can be synced in parallel but child comments need to be synced 1 at a time
    const maxParallelRequests = commentType === 'parentComments' ? 100 : 1;
    for (let comment of commentQueue) {
        // Make the sync request and add its promise to the queue,
        // and remove it from queue when complete
        const requestPromise = WordPressRestApi.instance.pluginRestPostAsync(
            'sync/comment',
            {
                object_type: 'post',
                transformed_data: comment,
                verb: 'force_sync',
            },
            (syncResponse: IRestResponse<string>) => {
                const datestr: string = moment().format('YYYY-MM-DD h:mm:ss a');
                dispatch(updateSyncStatusAction({
                    is_manual: true,
                    progress_message: `Syncing ${syncedComments} of ${totalSyncedComments} comments`,
                    last_message: `Manually synced comment "${comment.id}" from Disqus: ${datestr}`,
                }));
            },
        ).then(() => {
            parallelRequests.splice(parallelRequests.indexOf(requestPromise), 1);
            syncedComments += 1;
        });
        parallelRequests.push(requestPromise);

        // If the number of parallel requests matches our limit, wait for one
        // to finish before enqueueing more
        if (parallelRequests.length >= maxParallelRequests) {
            await Promise.race(parallelRequests);
        }
    }
    Promise.all(parallelRequests).then(() => {
        // We sync parent comments first then child comments immediately after, so we only update the state of the sync after child comments
        if (commentType === 'childComments') {
            dispatch(setValueAction('isManualSyncRunning', false));
        }
        dispatch(updateSyncStatusAction({
            is_manual: true,
            progress_message: `Completed (${syncedComments} of ${totalSyncedComments})`,
        }));
    });
}

const mapDispatchToProps = (dispatch: Redux.Dispatch<Redux.Action>) => {
    const handleClearMessage = (event: React.SyntheticEvent<HTMLButtonElement>): void => {
        dispatch(setMessageAction(null));
    };
    return {
        onCopyText: (elementId: string): void => {
            try {
                const element: HTMLInputElement = window.document.getElementById(elementId) as HTMLInputElement;
                if (element) {
                    element.select();
                    window.document.execCommand('copy');
                }
            } catch (err) {
                // Continue
            }
        },
        onDateSelectorInputchange: (key: string, event: React.SyntheticEvent<HTMLInputElement>): void => {
            const value: string = valueFromInput(event.currentTarget);
            dispatch(setValueAction(key, value));
        },
        onGenerateRandomSyncToken: (event: React.SyntheticEvent<HTMLAnchorElement>): void => {
            event.preventDefault();

            const newToken = createRandomToken();
            dispatch(updateLocalOptionAction('disqus_sync_token', newToken));
        },
        onInputChange: (key: string, event: React.SyntheticEvent<HTMLInputElement>): void => {
            const value: string = valueFromInput(event.currentTarget);
            dispatch(updateLocalOptionAction(key, value));
        },
        onSubmitExportCommentsForm: (event: React.SyntheticEvent<HTMLFormElement>): void => {
            event.preventDefault();

            const exporter: WordPressCommentExporter = new WordPressCommentExporter(dispatch);

            exporter.startExportPosts();
        },
        onSubmitManualSyncForm: (event: React.SyntheticEvent<HTMLFormElement>) => {
            event.preventDefault();

            const rangeStartInput: HTMLInputElement =
                event.currentTarget.elements.namedItem('manualSyncRangeStart') as HTMLInputElement;

            const rangeEndInput: HTMLInputElement =
                event.currentTarget.elements.namedItem('manualSyncRangeEnd') as HTMLInputElement;

            const getDateFromInput = (input: HTMLInputElement) => {
                const dateValue: string = input && input.value;
                const timestamp = moment(dateValue).endOf('day');

                return timestamp;
            };
            const startDate: Moment = getDateFromInput(rangeStartInput);
            const endDate: Moment = getDateFromInput(rangeEndInput);

            // Create a queue of comments within the provided date-range from the Disqus API
            const parentCommentList: any[] = [];
            const childCommentList: any[] = [];
            const getDisqusComments = async (cursor: string = '') => {
                return new Promise((resolve, reject) => {
                    DisqusApi.instance.listPostsForForum(cursor, startDate, endDate, 100, async (xhr: Event) => {
                        let disqusData = null;
                        try {
                            disqusData = JSON.parse((xhr.target as XMLHttpRequest).responseText);
                        } catch (error) {
                            // Continue
                        }

                        if (!disqusData || disqusData.code !== 0) {
                            reject(disqusData);
                        } else {
                            dispatch(updateSyncStatusAction({
                                is_manual: true,
                                progress_message: `Collecting ${totalSyncedComments} comments`,
                                last_message: null,
                            }));
                        }

                        const pendingComments = disqusData.response;
                        totalSyncedComments += pendingComments.length;

                        pendingComments.forEach((comment: any) => {
                            comment.parent ? childCommentList.push(comment) : parentCommentList.push(comment);
                        });
                        const nextCursor = disqusData.cursor;
                        if (nextCursor && nextCursor.hasNext) {
                            await getDisqusComments(nextCursor.next);
                        }
                        const commentQueue = [parentCommentList, childCommentList];
                        resolve(commentQueue);
                    });
                });
            };

            dispatch(setValueAction('isManualSyncRunning', true));
            getDisqusComments()
                .then((commentQueue: any[]) => {
                    syncComments(commentQueue[0], dispatch, 'parentComments');
                    return commentQueue;
                })
                .then((commentQueue: any[]) => {
                    syncComments(commentQueue[1], dispatch, 'childComments');
                })
                .catch((err: any) => {
                    dispatch(setMessageAction({
                        onDismiss: handleClearMessage,
                        text: (err && err.response) || 'Error connecting to the Disqus API',
                        type: 'error',
                    }));
                });
        },
        onSubmitSiteForm: (event: React.SyntheticEvent<HTMLFormElement>) => {
            event.preventDefault();

            const fields = UPDATABLE_FIELDS.reduce((previousValue: any, currentIdKey: string): any => {
                if (currentIdKey in event.currentTarget.elements) {
                    const currentField: Element | HTMLCollection = event.currentTarget.elements.namedItem(currentIdKey);
                    const currentInputElement = currentField as HTMLInputElement;
                    const value: string = valueFromInput(currentInputElement);

                    return (Object as any).assign({
                        [currentInputElement.name]: value,
                    }, previousValue);
                }
                return previousValue;
            }, {});

            WordPressRestApi.instance.pluginRestPost(
                'settings',
                fields,
                (response: IRestResponse<IAdminOptions>): void => {
                    if (!response)
                        return;

                    if (response.code !== 'OK') {
                        dispatch(setMessageAction({
                            onDismiss: handleClearMessage,
                            text: response.message,
                            type: 'error',
                        }));
                        return;
                    }

                    dispatch(updateAdminOptionsAction(response.data));
                    dispatch(setMessageAction({
                        onDismiss: handleClearMessage,
                        text: __('Changes saved successfully.'),
                        type: 'success',
                    }));
                    dispatch(toggleValueAction('isSiteFormLocked'));
                },
            );
        },
        onSubmitSyncConfigForm: (event: React.SyntheticEvent<HTMLFormElement>): void => {
            event.preventDefault();

            const endpoint: string = event.currentTarget.name;

            WordPressRestApi.instance.pluginRestPost(endpoint, null, (response: IRestResponse<IAdminOptions>): void => {
                if (!response)
                    return;

                if (response.code !== 'OK') {
                    dispatch(setMessageAction({
                        onDismiss: handleClearMessage,
                        text: response.message,
                        type: 'error',
                    }));
                    return;
                }

                dispatch(updateSyncStatusAction(response.data));
                dispatch(setMessageAction({
                    onDismiss: handleClearMessage,
                    text: __('Changes saved successfully.'),
                    type: 'success',
                }));
            });
        },
        onToggleState: (key: string) => {
            dispatch(toggleValueAction(key));
        },
        onUpdateInstallationState: (newState: InstallationState) => {
            dispatch(changeInstallStateAction(newState));
        },
    };
};

export { UPDATABLE_FIELDS };

export default mapDispatchToProps;

import * as Redux from 'redux';
import {
    changeInstallStateAction,
    setMessageAction,
    toggleValueAction,
    updateAdminOptionsAction,
    updateExportPostLogAction,
    updateLocalOptionAction,
    updateSyncStatusAction,
} from '../actions';
import { DisqusApi } from '../DisqusApi';
import { IAdminOptions } from '../reducers/AdminOptions';
import {
    ExportLogStaus,
    InstallationState,
} from '../reducers/AdminState';
import {
    IRestResponse,
    WordPressRestApi,
} from '../WordPressRestApi';

const UPDATABLE_FIELDS: string[] = [
    'disqus_forum_url',
    'disqus_public_key',
    'disqus_secret_key',
    'disqus_admin_access_token',
    'disqus_sso_button',
    'disqus_sso_enabled',
    'disqus_sync_token',
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
        onInputChange: (key: string, event: React.SyntheticEvent<HTMLInputElement>): void => {
            const value: string = valueFromInput(event.currentTarget);
            dispatch(updateLocalOptionAction(key, value));
        },
        onSubmitExportCommentsForm: (event: React.SyntheticEvent<HTMLFormElement>): void => {
            event.preventDefault();

            const dispatchError = (post: any, error: string): void => {
                dispatch(updateExportPostLogAction({
                    error,
                    id: post.id,
                    link: post.link,
                    numComments: null,
                    status: ExportLogStaus.failed,
                    title: post.title.rendered,
                }));
            };

            const dispatchComplete = (post: any, numComments: number): void => {
                dispatch(updateExportPostLogAction({
                    error: null,
                    id: post.id,
                    link: post.link,
                    numComments,
                    status: ExportLogStaus.complete,
                    title: post.title.rendered,
                }));
            };

            const postsPerPage = 10;
            let currentPage = 1;
            const exportPost = (post: any): void => {
                WordPressRestApi.instance.pluginRestPost('export/post', { postId: post.id }, (response: any): void => {

                    if (!response || response.code !== 'OK') {
                        dispatchError(post, response.message);
                        return;
                    }

                    if (!response.data.comments.length) {
                        dispatchComplete(post, response.data.comments.length);
                        return;
                    }

                    const wxr = response.data.wxr;
                    DisqusApi.instance.createImport(wxr.xmlContent, wxr.filename, (xhr: Event) => {
                        let jsonObject = null;
                        try {
                            jsonObject = JSON.parse((xhr.target as XMLHttpRequest).responseText);
                        } catch (error) {
                            // Continue
                        }

                        if (!jsonObject) {
                            dispatchError(post, __('Unknown error uploading to the Disqus servers'));
                            return;
                        }

                        if (jsonObject.code !== 0) {
                            dispatchError(post, jsonObject.response);
                            return;
                        }

                        dispatchComplete(post, response.data.comments.length);
                    });
                });
            };

            const fetchPosts = (): void => {
                WordPressRestApi.instance.wordpressRestGet(
                    'posts',
                    `per_page=${postsPerPage}&page=${currentPage}`,
                    (response: any): void => {
                        if (Array.isArray(response)) {
                            response.forEach((post: any) => {
                                dispatch(updateExportPostLogAction({
                                    error: null,
                                    id: post.id,
                                    link: post.link,
                                    numComments: null,
                                    status: ExportLogStaus.pending,
                                    title: post.title.rendered,
                                }));
                                exportPost(post);
                            });

                            if (response.length === postsPerPage) {
                                currentPage += 1;
                                fetchPosts();
                            }
                        }
                    },
                );
            };

            fetchPosts();
        },
        onSubmitSiteForm: (event: React.SyntheticEvent<HTMLFormElement>) => {
            event.preventDefault();

            const fields = (UPDATABLE_FIELDS as any).reduce((previousValue: any, currentIdKey: string): any => {
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

export default mapDispatchToProps;

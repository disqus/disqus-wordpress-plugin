import * as Redux from 'redux';
import { updateExportPostLogAction } from './actions';
import { DisqusApi } from './DisqusApi';
import { ExportLogStaus } from './reducers/AdminState';
import { WordPressRestApi } from './WordPressRestApi';

const POSTS_PER_PAGE: number = 10;

class WordPressCommentExporter {
    private currentPage: number;
    private dispatch: Redux.Dispatch<Redux.Action>;

    constructor(dispatch: Redux.Dispatch<Redux.Action>) {
        this.dispatch = dispatch;
        this.currentPage = 1;
    }

    public startExportPosts(): void {
        WordPressRestApi.instance.wordpressRestGet(
            'posts',
            `per_page=${POSTS_PER_PAGE}&page=${this.currentPage}`,
            this.handlePostsResponse,
        );
    }

    private exportPost(post: any): void {
        WordPressRestApi.instance.pluginRestPost(
            'export/post',
            { postId: post.id },
            this.handleExportPostResponse.bind(null, post),
        );
    }

    private dispatchComplete(post: any, numComments: number): void {
        this.dispatch(updateExportPostLogAction({
            error: null,
            id: post.id,
            link: post.link,
            numComments,
            status: ExportLogStaus.complete,
            title: post.title.rendered,
        }));
    }

    private dispatchError(post: any, error: string): void {
        this.dispatch(updateExportPostLogAction({
            error,
            id: post.id,
            link: post.link,
            numComments: null,
            status: ExportLogStaus.failed,
            title: post.title.rendered,
        }));
    }

    private handleDisqusImportResponse(post: any, exportPostResponse: any, xhr: Event): void {
        let jsonObject = null;
        try {
            jsonObject = JSON.parse((xhr.target as XMLHttpRequest).responseText);
        } catch (error) {
            // Continue
        }

        if (!jsonObject) {
            this.dispatchError(post, __('Unknown error uploading to the Disqus servers'));
            return;
        }

        if (jsonObject.code !== 0) {
            this.dispatchError(post, jsonObject.response);
            return;
        }

        this.dispatchComplete(post, exportPostResponse.data.comments.length);
    }

    private handleExportPostResponse(post: any, response: any): void {
        if (!response || response.code !== 'OK') {
            this.dispatchError(post, response.message);
            return;
        }

        if (!response.data.comments.length) {
            this.dispatchComplete(post, response.data.comments.length);
            return;
        }

        const wxr = response.data.wxr;
        DisqusApi.instance.createImport(
            wxr.xmlContent,
            wxr.filename,
            this.handleDisqusImportResponse.bind(null, post, response),
        );
    }

    private handlePostsResponse(response: any): void {
        if (Array.isArray(response)) {
            response.forEach((post: any) => {
                this.dispatch(updateExportPostLogAction({
                    error: null,
                    id: post.id,
                    link: post.link,
                    numComments: null,
                    status: ExportLogStaus.pending,
                    title: post.title.rendered,
                }));
                this.exportPost(post);
            });

            if (response.length === POSTS_PER_PAGE) {
                this.currentPage += 1;
                this.startExportPosts();
            }
        }
    }
}

export { POSTS_PER_PAGE };

export default WordPressCommentExporter;

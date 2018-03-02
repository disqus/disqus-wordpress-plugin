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

        this.handleDisqusImportResponse = this.handleDisqusImportResponse.bind(this);
        this.handleExportPostResponse = this.handleExportPostResponse.bind(this);
        this.handlePostsResponse = this.handlePostsResponse.bind(this);
    }

    public startExportPosts(): XMLHttpRequest {
        return WordPressRestApi.instance.wordpressRestGet(
            'posts',
            `per_page=${POSTS_PER_PAGE}&page=${this.currentPage}`,
            this.handlePostsResponse,
        );
    }

    public exportPost(post: any): void {
        WordPressRestApi.instance.pluginRestPost(
            'export/post',
            { postId: post.id },
            this.handleExportPostResponse.bind(null, post),
        );
    }

    public dispatchComplete(post: any, numComments: number): void {
        this.dispatch(updateExportPostLogAction({
            error: null,
            id: post.id,
            link: post.link,
            numComments,
            status: ExportLogStaus.complete,
            title: post.title.rendered,
        }));
    }

    public dispatchError(post: any, error: string): void {
        this.dispatch(updateExportPostLogAction({
            error,
            id: post.id,
            link: post.link,
            numComments: null,
            status: ExportLogStaus.failed,
            title: post.title.rendered,
        }));
    }

    public handleDisqusImportResponse(post: any, exportPostResponse: any, xhr: Event): void {
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

    public handleExportPostResponse(post: any, response: any): void {
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

    public handlePostsResponse(response: any): void {
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

import WordPressCommentExporter, { POSTS_PER_PAGE } from '../src/ts/WordPressCommentExporter';
import { WordPressRestApi } from '../src/ts/WordPressRestApi';

describe('WordPressCommentExporter', () => {

    test('startExportPosts makes a request to the WordPress REST API', () => {
        const mockWordpressRestGet: jest.Mock = jest.fn();
        WordPressRestApi.instance.wordpressRestGet = mockWordpressRestGet;
        const mockDispatch = jest.fn();
        const exporter = new WordPressCommentExporter(mockDispatch);

        const xhr: XMLHttpRequest = exporter.startExportPosts();

        expect(mockWordpressRestGet).toHaveBeenCalledWith(
            'posts',
            `per_page=${POSTS_PER_PAGE}&page=1`,
            exporter.handlePostsResponse,
        );

    });

});

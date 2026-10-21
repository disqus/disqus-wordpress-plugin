<?php
/**
 * Tests for Disqus_Public class.
 */

class Test_Disqus_Public extends WP_UnitTestCase {

    /**
     * Test ensure_gravatar_extension with Gravatar URLs.
     */
    function test_ensure_gravatar_extension_with_gravatar_urls() {
        $reflection = new ReflectionClass('Disqus_Public');
        $method = $reflection->getMethod('ensure_gravatar_extension');
        $method->setAccessible(true);

        // Test Gravatar URL without extension
        $url = 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50';
        $result = $method->invoke(null, $url);
        $this->assertEquals('https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50.jpg', $result);

        // Test Gravatar URL with query params
        $url = 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=92';
        $result = $method->invoke(null, $url);
        $this->assertEquals('https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50.jpg?s=92', $result);

        // Test Gravatar URL already with extension
        $url = 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50.jpg';
        $result = $method->invoke(null, $url);
        $this->assertEquals('https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50.jpg', $result);

        // Test Gravatar URL with extension and query params
        $url = 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50.jpg?s=92';
        $result = $method->invoke(null, $url);
        $this->assertEquals('https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50.jpg?s=92', $result);

        // Test secure Gravatar URL
        $url = 'https://secure.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50';
        $result = $method->invoke(null, $url);
        $this->assertEquals('https://secure.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50.jpg', $result);
    }

    /**
     * Test ensure_gravatar_extension with non-Gravatar URLs.
     */
    function test_ensure_gravatar_extension_with_non_gravatar_urls() {
        $reflection = new ReflectionClass('Disqus_Public');
        $method = $reflection->getMethod('ensure_gravatar_extension');
        $method->setAccessible(true);

        // Test non-Gravatar URL (should remain unchanged)
        $url = 'https://example.com/avatar.png';
        $result = $method->invoke(null, $url);
        $this->assertEquals('https://example.com/avatar.png', $result);

        // Test non-Gravatar URL without extension
        $url = 'https://example.com/avatar';
        $result = $method->invoke(null, $url);
        $this->assertEquals('https://example.com/avatar', $result);
    }

    /**
     * Test ensure_gravatar_extension with custom extension.
     */
    function test_ensure_gravatar_extension_with_custom_extension() {
        $reflection = new ReflectionClass('Disqus_Public');
        $method = $reflection->getMethod('ensure_gravatar_extension');
        $method->setAccessible(true);

        // Test with custom extension
        $url = 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50';
        $result = $method->invoke(null, $url, '.png');
        $this->assertEquals('https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50.png', $result);

        // Test with custom extension without dot
        $result = $method->invoke(null, $url, 'png');
        $this->assertEquals('https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50.png', $result);
    }

    /**
     * Test ensure_gravatar_extension edge cases.
     */
    function test_ensure_gravatar_extension_edge_cases() {
        $reflection = new ReflectionClass('Disqus_Public');
        $method = $reflection->getMethod('ensure_gravatar_extension');
        $method->setAccessible(true);

        // Test empty URL
        $result = $method->invoke(null, '');
        $this->assertEquals('', $result);

        // Test URL with multiple query params
        $url = 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=92&d=identicon';
        $result = $method->invoke(null, $url);
        $this->assertEquals('https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50.jpg?s=92&d=identicon', $result);

        // Test URL with different case
        $url = 'https://www.GRAVATAR.com/avatar/205e460b479e2e5b48aec07710c08d50';
        $result = $method->invoke(null, $url);
        $this->assertEquals('https://www.GRAVATAR.com/avatar/205e460b479e2e5b48aec07710c08d50.jpg', $result);
    }

    /**
     * The identifier for a real post is "<ID> <guid>".
     */
    function test_dsq_identifier_for_post() {
        $post = $this->factory->post->create_and_get();

        $this->assertEquals( $post->ID . ' ' . $post->guid, Disqus_Public::dsq_identifier_for_post( $post ) );
    }

    /**
     * Posts that aren't WP_Post instances but carry an ID and guid must keep their identifier.
     */
    function test_dsq_identifier_for_post_like_object() {
        $post = (object) array( 'ID' => 123, 'guid' => 'http://example.org/?p=123' );

        $this->assertEquals( '123 http://example.org/?p=123', Disqus_Public::dsq_identifier_for_post( $post ) );
    }

    /**
     * Requests without a current post (404s, empty search results) must not raise warnings.
     * Warnings fail tests because phpunit.xml.dist converts them to exceptions.
     */
    function test_dsq_identifier_for_null_post() {
        $this->assertSame( ' ', Disqus_Public::dsq_identifier_for_post( null ) );
    }

    /**
     * Third-party plugins call embed_vars_for_post() with the global $post, which is null on 404 pages.
     */
    function test_embed_vars_for_post() {
        $post = $this->factory->post->create_and_get();

        $embed_vars = Disqus_Public::embed_vars_for_post( $post );

        $this->assertEquals( $post->ID . ' ' . $post->guid, $embed_vars['disqusIdentifier'] );
        $this->assertEquals( $post->ID, $embed_vars['postId'] );
    }

    function test_embed_vars_for_null_post() {
        $embed_vars = Disqus_Public::embed_vars_for_post( null );

        $this->assertSame( ' ', $embed_vars['disqusIdentifier'] );
        $this->assertNull( $embed_vars['postId'] );
    }
}

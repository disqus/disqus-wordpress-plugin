<?php
/**
 * Basic plugin tests.
 */

class PluginTest extends WP_UnitTestCase {

    /**
     * Check that activation doesn't break.
     */
    function test_plugin_activated() {
        $this->assertTrue( is_plugin_active( PLUGIN_PATH ) );
    }

    /**
     * Check that the Disqus link is in the admin menu.
     */
     function test_disqus_admin_menu() {
        $user_id = $this->factory->user->create( array( 'role' => 'administrator' ) );
        wp_set_current_user( $user_id );

        global $menu;

        var_dump($menu);

        $this->assertTrue( array_key_exists( 24, $menu ) ); // Index 24 is the custom position of Disqus menu page.
        $this->assertFalse( array_key_exists( 25, $menu ) ); // Index 25 is the default WordPress comments page.
        $this->assertTrue( $menu[24][0] === 'Disqus' );
     }
}

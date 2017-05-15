<?php
/**
 * Basic plugin tests.
 */

class Test_Plugin extends WP_UnitTestCase {

    /**
     * Check that activation doesn't break.
     */
    function test_plugin_activated() {
        $this->assertTrue( is_plugin_active( PLUGIN_PATH ) );
    }
}

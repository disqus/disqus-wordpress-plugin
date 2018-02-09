[![Build Status](https://travis-ci.org/disqus/disqus-wordpress-plugin.svg?branch=master)](https://travis-ci.org/disqus/disqus-wordpress-plugin)

# Disqus WordPress Plugin

## Local Testing

There's a Docker configuration to bootstrap a local WordPress installation. To start it:

- From the root directory, run `$ make run`.
- Install wordpress with the default values by running `$ make install`.
- Activate the Disqus plugin using `$ make activate`.
- Alternatively you can now complete configuration by going to: http://localhost:8888/wp-admin/install.php
- Otherwise you can continue to: http://localhost:8888/

## Install

To install the plugin on an existing WordPress site, you'll need to build the frontend and create a .zip file:

- From the root directory, run `$ make js`.
- Compress the entire `disqus` directory into a `.zip` file.
- From your WordPress plugin page, select Plugins->Add New->Upload Plugin and choose the `disqus.zip` file you created.
- Activate the plugin and then install using the instructions in the plugin.

## Custom Filters

### dsq_can_load

You can override when Disqus loads on a certain page using the `dsq_can_load` filter. By default Disqus won't load scripts on:
- On RSS feed pages
- If the `shortname` is missing from the configuration

Additionally Disqus will not load the embed.js script:
- On pages that are not 'post' or 'page' types
- Posts or pages that have comment turned off
- Draft posts

The filter will pass one argument, the `$script_name` enumeration, which can be:
- `'count'` — The count.js script file for showing comment counts next to a link
- `'embed'` — The commenting embed.js file

In this example, you can add a filter which disables the comment count script, while still allowing the comments embed to load:

```php
function filter_dsq_can_load( $script_name ) {
    // $script_name is either 'count' or 'embed'.
	if ( 'count' === $script_name ) {
		return false;
	}

	return true;
}
add_filter( 'dsq_can_load', 'filter_dsq_can_load' );
```

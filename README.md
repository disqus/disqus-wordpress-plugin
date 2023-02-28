[![Build Status](https://travis-ci.org/disqus/disqus-wordpress-plugin.svg?branch=master)](https://travis-ci.org/disqus/disqus-wordpress-plugin)

# Disqus WordPress Plugin

## Development Environment Running on the Internet

- Use a cloud provider like Amazon Lightsail or Digital Ocean and spin up a VM using the Bitnami WordPress application installed.
    - Use at least 1GB RAM.

- Wait a few minutes for WordPress to start up

- Install prerequisites on the server:
    ```sh
    sudo apt update && sudo apt install -y git yarnpkg
    ```

- Disable PHP caching by running:
    ```sh
    sudo sed -i 's/opcache.enable = 1/opcache.enable = 0/' /opt/bitnami/php/etc/php.ini
    sudo systemctl restart bitnami
    ```

- Enable debugging for WordPress by editing `/opt/bitnami/wordpress/wp-config.php` and adding the following lines before `/* That's all, stop editing! Happy blogging. */`.  Make sure to remove the `WP_DEBUG` line above.
    ```php
    define( 'WP_DEBUG', true );
    define( 'WP_DEBUG_LOG', true );
    ```

- Install the plugin:
    ```sh
    cd $HOME
    git clone https://github.com/disqus/disqus-wordpress-plugin
    cd disqus-wordpress-plugin
    yarnpkg install
    yarnpkg run build
    ln -s $HOME/disqus-wordpress-plugin/disqus /opt/bitnami/wordpress/wp-content/plugins/disqus
    ``` 

## Local Testing

There's a Docker configuration to bootstrap a local WordPress installation. To start it:

- You'll need both [Docker](https://docs.docker.com/install/) and [yarn](https://yarnpkg.com/) installed on your local machine.
- From the root directory, run `$ yarn` to install the frontend dependencies.
- Once that's done, run `$ make run` to build the docker image.
- Install wordpress with the default values by running `$ make install`.
- Activate the Disqus plugin using `$ make activate`.
- Alternatively you can now complete configuration by going to: http://localhost:8888/wp-admin/install.php
- Otherwise you can continue to: http://localhost:8888/

### Unit tests

To run unit tests locally:

- Run `$ make docker-test`.

This will run all frontend (Jest) and backend (PHPUnit) tests.

## Installing to existing WordPress site

To install the plugin on an existing WordPress site, you'll need to build the frontend and create a .zip file:

- Make sure you have [yarn](https://yarnpkg.com/) installed on your local machine.
- From the root directory, run `$ make dist`.
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

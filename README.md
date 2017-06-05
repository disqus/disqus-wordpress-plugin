[![Build Status](https://travis-ci.org/ryanvalentin/disqus-wordpress-plugin.svg?branch=master)](https://travis-ci.org/ryanvalentin/disqus-wordpress-plugin)

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

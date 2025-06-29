=== Disqus Comment System ===
Contributors: disqus, alexkingorg, crowdfavorite, zeeg, tail, thetylerhayes, ryanv12, iamfrancisyo, brevityness, tterb, chrisjtang
Tags: disqus, comments, engagement, threaded, email, notification, spam, avatars, community, profile, widget
Requires at least: 4.4
Tested up to: 6.8
Stable tag: 3.1.3
Requires PHP: 5.6

Disqus is the web's most popular comment system. Use Disqus to increase engagement, retain readers, and grow your audience. **NEW: Disqus Polls – Engage your audiences with interactive polls, and seamlessly install them on your site.**

== Description ==

[Disqus](https://disqus.com/) is the web’s most popular commenting system trusted by millions of publishers to increase reader engagement, grow audience and traffic, and monetize content. Disqus helps publishers of all sizes engage directly with their audiences to build loyalty, retain readers, and foster thriving communities.

The Disqus for WordPress plugin lets site owners and developers easily add Disqus to their sites, replacing the default WordPress comment system. Disqus installs in minutes and automatically imports your existing comments.

In addition to our free-to-use, ad-supported Basic plan, we also offer ad-optional subscription plans that come with more advanced features and access to priority support. Please see our [pricing page](https://disqus.com/pricing/) for more details.

**NEW: [Disqus Polls](https://disqus.com/polls)** – Engage your audiences with interactive polls, and seamlessly install them on your site.

= Why Disqus? =

* Simple one-click installation that seamlessly integrates with WordPress without ever needing to edit a single line of code or losing any of your existing comments
* Keep users engaged on your site longer with a commenting experience readers love
* Bring users back to your site with web and email notifications and personalized digests
* Improve SEO ranking with user generated content
* Keep spam out with our best-in-class anti-spam filter powered by Akismet
* Single profile for commenting on over 4 million sites including social login support for Facebook, Twitter, and Google accounts
* Trusted by sites like ABC News, Entertainment Weekly, and Rotten Tomatoes

= Disqus Features =

* Syncs comments automatically to WordPress for backup and flexibility if you ever decide to switch to a different platform
* Loads asynchronously with advanced caching so that Disqus doesn’t affect your site’s performance
* Monetization options to grow revenue
* Export comments to WordPress-compatible XML to backup or migrate to another system
* Analytics dashboard for measuring overall engagement on your site
* Mobile responsive design
* **NEW: Disqus Polls** – Create and embed interactive polls directly on your site to boost engagement and gather insights from your audience.

= Engagement Features =

* Realtime comments system with fun discussion interactions: voting, photo and video upload, rich media embed (Youtube, Twitter, Vimeo, and more), spoiler tags, mentions
* Comment text formatting (e.g. bold, link, italics, quote) using HTML tags as well as code syntax highlighting
* Threaded comment display (nested 3 levels) with ability to collapse individual threads
* Sort discussion by oldest, newest, and best comments
* Flexible login options - Social login with Facebook, Twitter, and Google, SSO, and guest commenting support
* Instant activity notifications, email notifications, and digests pull readers back in
* User profiles that show you recent comment history and frequented communities
* Recommendations widget that shows where active discussions are happening elsewhere on your site

= Moderation Features =

* Automatic anti-spam filter powered by Akismet
* Automated pre-moderation controls to flag comments based on links, user reputation
* Moderate directly in the discussion, via email, or moderation panel
* Email notifications for newly posted comments, replies
* Moderation Panel that lets you search, filter, sort, and manage your comments
* Self-moderation tools like user blocking, comment flagging

== Support ==

* Search our [Knowledge Base](https://help.disqus.com/customer/portal/articles/472005) for solutions to common troubleshooting questions
* Check out our support community, [Discuss Disqus](https://disqus.com/home/channel/discussdisqus/), to see if your question has been answered
* Talk to our Support team at [disqus.com/support](disqus.com/support)
* Visit our [Getting Started](https://help.disqus.com/customer/en/portal/articles/1264625-getting-started) page to learn the basics of Disqus

== Frequently Asked Questions ==

= Is Disqus free to use on my site? =

Yes! Disqus is free to use. We also provide [subscription plans](https://help.disqus.com/customer/en/portal/articles/2759918-disqus-pricing-and-plans) for larger, commercial sites that want access to more powerful moderation and audience tools and customization.

= How do I customize the look-and-feel of Disqus? =

Disqus automatically checks your site's font and background color and adapts to either a light or dark color scheme, along with a serif or sans-serif font. If these are detected incorrectly, you can [override them](https://help.disqus.com/customer/en/portal/articles/545277-disqus-appearance-tweaks) in your Settings.

= Will I lose comments if I deactivate Disqus? =

The Disqus for WordPress plugin automatically syncs comments back to WordPress. These comments will remain in WordPress should Disqus be deactivated or removed. You can also [export your comments](https://help.disqus.com/customer/en/portal/articles/1104797-importing-exporting#exporting) from Disqus at any time.

= Can I import my existing WordPress comments into Disqus? =

Yes, you can import your existing WordPress comments into Disqus during installation.

= How do I set up Single Sign-On (SSO)? =

SSO allows users in your database to comment without requiring them to register with Disqus. Access to SSO is currently available as an add-on for users with a [Business subscription](https://help.disqus.com/customer/en/portal/articles/2759918-disqus-pricing-and-plans#business-plan). If you would like to enable this feature, [contact our Support team](https://disqus.com/support/?article=contact_SSO). Also check out our guide for [setting up SSO on WordPress](https://help.disqus.com/customer/portal/articles/1148635).

= I’m experiencing an issue with my installation of Disqus. =

Check out our [WordPress Troubleshooting guide](https://help.disqus.com/customer/portal/articles/472005-wordpress-troubleshooting) with specific solutions for potential problems you might be experiencing.

== Installation ==

1. Go to **"Plugins"** > **"Add Plugin"**
2. Search for **"Disqus Comment System"** by Disqus
3. Click **"Install Now"**
4. Activate the plugin
5. (**Automatic: easiest**) From the Install page of the Disqus plugin settings, follow the Automatic Installation steps to set up Disqus on your site. During this process, you will need to [create a Disqus account](https://disqus.com/profile/signup/) and register your site. This also creates the API application required for enabling Comment Syncing.
6. (**Manual: fastest**) Enter your site's [Disqus shortname](https://help.disqus.com/customer/en/portal/articles/466208) in **Site Configuration**. This requires you to have [created a Disqus account](https://disqus.com/profile/signup/) and registered your site.

**NOTE: It is recommended that you [backup your database](http://codex.wordpress.org/Backing_Up_Your_Database) before installing the plugin.**

https://www.youtube.com/watch?v=a4JBJXyuaFk

= Syncing comments to WordPress =
Comment Syncing copies comments made in Disqus to your WordPress installation as backup in case you ever decide to switch back to native WordPress comments. Syncing is not enabled by default. To enable syncing, you'll need to set it up either by creating an API application (follow [instructions here](https://help.disqus.com/customer/portal/articles/960360)) or via Automatic Installation in the plugin.

For more information, go to [https://help.disqus.com/customer/portal/articles/960360](https://help.disqus.com/customer/portal/articles/960360)

= Installation trouble? =

Go to [https://disqus.com/help/wordpress](https://disqus.com/help/wordpress)

== Screenshots ==

1. Disqus Comments
2. Disqus Polls
3. Disqus Audience Platform
4. Featured Comment
5. Recommendations (part of Disqus Comments)
6. Mentions
7. Real-time Comments
8. Commenter User Profile
9. Moderation Panel
10. Moderation Panel Comments
11. Moderate by Email Notifications

== Changelog ==
= 3.1.3 =
* Fixed bug with Disqus SSO and Gravatar Images
* Switched DISQUSVERSION to constant (issue #139)
* Fixed comment data issue if post author is null (issue #140)
* Fixed various conditions missing type checks (issue #141)

= 3.1.2 =
* Add Disqus Polls Information

= 3.1.1 =
* Add WP 6.5 to Github Actions CI

= 3.1 =
* Disqus Embed now loads correctly on WordPress Block Themes.
* Improved visibility for latest plugin version and important changes.
* Added links to remove ads and clarified language around ad-supported plans.
* Modernized styling and effects to match Disqus colors.

= 3.0.24.1 =
* Add WP 6.4 to Github Actions CI and fixed dependency issues for WP 6.4

= 3.0.24 =
* Fixed multiple bugs with the manual syncing tool regarding syncing comments without parents and syncing comments missing thread data.
* Increased allowable date range for manual syncing tool to allow for easier syncing of historical comment data.
* Improved automatic syncing tool's error messaging and troubleshooting with regards to issues with fetching sync status and starting automatic syncing.
* Improved the error messages that get exposed to the browser console when issues occur with the manual and automatic syncing tools for easier future troubleshooting.

= 3.0.23 =
* Fixed a bug with the automatic comment import tool with newer versions of WordPress and added tests.
* Improved visual layout of the plugin.  Updated corresponding snapshot for frontend test.
* Added updated directions for running tests locally.
* Update CI/CD to use GitHub actions.

= 3.0.22 =
* Added improvements to manual comment syncing (thanks Artem Russakovskii)
* Fixed a bug with the embed handling pages with missing container IDs
* Fixed a bug with REST URLs handling emtpy host configurations

= 3.0.21 =
* Fixed issue with mismatched DISQUSVERSION causing admin issues

= 3.0.20 =
* Fixed issue with comments syncing to one sticky post

= 3.0.19 =
* Fixed issue with missing admin bundles

= 3.0.18 =
* Tested plugin with WordPress 5.6 and updated documentation
* Fixed count.js script being loaded on unnecessary pages
* Fixed comments showing sync date instead of creation date in WordPress admin

= 3.0.17 =
* Bumping version for WP 5.1 version bump. (Changes to README versions and main php file's version)
* Fixed Undefined index bug where HTTP_HOST could not find web server

= 3.0.16 =

* Add a manual syncing option that allows retroactive syncing within a selected date range
* Fixed bug where SSO avatar URLs were malformed (Thanks to [klaufel](https://github.com/disqus/disqus-wordpress-plugin/pull/49))

= 3.0.15 =

* Fixed bug preventing sites from importing WordPress comments to Disqus

= 3.0.14 =

* Add a prompt to create a secret key if missing. Fixes issue preventing some sites from using automatic installation and enabling syncing
* Made it easier to reinstall the same site without having to select a new one
* Bug fix for some browsers from autofilling site configuration forms
* Bug fix for sites whose admin URL was different than their public site URL
* Prevent Disqus from loading on pending and scheduled posts

= 3.0.13 =

* Added a new option for rendering comments javascript directly into page markup
* Fixed warning that stated "cannot access private method Disqus_Rest_Api::dsq_get_settings_schema()"
* A few small copy changes in plugin's admin UI

= 3.0.12 =

* Disabled browser autocomplete for site configuration form
* Fixed an issue where admin JavaScript bundle was missing for sites with WP_DEBUG enabled
* Implemented a dsq_can_load filter for custom control of when Disqus loads

= 3.0.11 =

* Improved UX on updating the site configuration manually
* Fixed an issue causing a site crash with PHP version 5.2
* Added additional information to support diagnostics

= 3.0.10 =

* Lowered minimum-supported version of PHP to 5.4
* Fixed a syntax issue in PHP version 5.3

= 3.0.9 =

* Added a check to deactivate plugin if PHP version is earlier than the minimum-supported version 5.6.

= 3.0.8 =

* Fixed a bug that prevented automatic installation when upgrading from version 2.86 or earlier.

= 3.0.7 =

* Plugin has been completely rewritten to support modern and secure WordPress features.
* Added new Automatic Installation for installing Disqus on your site. This also creates the API application required for enabling comment syncing.
* Completely redesigned plugin settings page. Disqus replaces the Comments menu link in your WordPress admin and includes shortcut links to popular settings.

= 2.86 =

* Don't attempt to use cURL on IIS servers
* Check is dsq_sync_forum is scheduled before scheduling
* Add updates for Travis CI
* Fixes a bug in the upgrade process

= 2.85 =

* Fixes deprecation warnings on sites running PHP7
* Removes a javascript alert from the admin

= 2.84 =

* Fixes a bug where the comment count won't work on some themes

= 2.83 =

* Fix errors when using SSO and rendering javascript inline

= 2.82 =

* Fix PHP errors when there are no comments to sync
* Adds a new option to render Disqus javascript directly in page markup

= 2.81 =

* Fix for automatic comment syncing
* Make sure all markup validates for HTML5

= 2.80 =

* Move all scripts to separate files instead of rendering them in php
* Added a hook to attach custom functions to disqus_config in javascript
* Fixed exporting bug introduced in 2.78 (Thanks to mkilian)
* Numerous small compatibility and security enhancements

= 2.79 =

* Reinstate changes removed by 2.78

= 2.78 =

* Security fixes
* Compatibility for Wordpress version 4.0

= 2.77 =

* Fixes login by email issue
* Make sure Disqus is enabled after installation
* Additional security fixes

= 2.76 =

* Security fixes (Thanks to Nik Cubrilovic, Alexander Concha and Marc-Alexandre Montpas)
* Bump tested Wordpress version to 3.9.1
* Remove obsolete SSO button uploader
* Enable 'Output javascript in footer' by default during installation
* Fix for 'Reset' function not completely working the first time

= 2.75 =

* Bump supported WordPress version to 3.8.
* Properly encode site name for SSO login button.
* Increased timeout for comment exporter to 60 seconds.
* Use https: for admin pages
* Miscellaneous bug fixes and improvements.

= 2.74 =

* Updated settings UI
* Add filter hook for setting custom Disqus language
* For WP >= 3.5, use new media uploader
* Disable internal Wordpress commenting if Disqus is enabled (thanks Artem Russakovskii)
* Cleaned up installation and configuration flow
* Added link to WP backup guide in README
* Fix admin bar comments link
* Added a check to avoid a missing key notice when WP_DEBUG=TRUE (thanks Jason Lengstorf)
* Prevent 404 errors for embed.js from being reported by Google Webmaster Tools (missed in 2.73 README)

= 2.73 =

* Apply CDATA patch from Wordpress 3.4 to dsq_export_wxr_cdata() (thanks Artem
  Russakovskii for the patch).
* Added Single Sign-On log-in button and icon to options (only for sites using SSO)
* Output user website if set in SSO payload
* Added plugin activation statuses to debug info
* Bump supported WordPress version to 3.4.1
* Fixed issue where disqus_dupecheck won't properly uninstall
* Load second count.js (output-in-footer version) reference via SSL too
* Added screenshots

= 2.72 =

* Load count.js via SSL when page is accessed via HTTPS
* Fixed styling issue with Disqus admin.

= 2.71 =

* Fixed issue where embed wasn't using SSL if page was loaded via HTTPS
* Fixed issue with syncing where to user's without a display_name would
  revert back to Anonymous (really this time).
* Fixed issue where Google Webmaster Tools would incorrectly report 404s.
* Fixed issue with Disqus admin display issues.

= 2.70 =

* Properly uninstall disqus_dupecheck index when uninstalling plugin.
* Fixed issue with syncing where to user's without a display_name would
  revert back to Anonymous.
* Fixed issue where IP addresses weren't being synced properly.
* Allow non-Administrators (e.g., editors) to see Disqus Moderate panel
  inline (fixes GH-3)

= 2.69 =

* Bumped version number.

= 2.68 =

* Removed debugging information from web requests in CLI scripts (thanks
  Ryan Dewhurst for the report).
* Reduced sync lock time to 1 hour.
* Fixed an issue which was not allowing pending posts (for sync) to clear.
* Fixed an issue with CLI scripts when used with certain caching plugins.

= 2.67 =

* Bumped synchronization timer delays to 5 minutes.
* wp-cli.php now requires php_sapi_name to be set to 'cli' for execution.
* Fixed a bug with imported comments not storing the correct relative date.
* Added a lock for dsq_sync_forum, which can be overriden in the command line script
  with the --force tag.
* dsq_sync_forum will now handle all pending post metadata updates (formerly a separate
  cron task, dsq_sync_post).

= 2.66 =

* Fixed issue with jQuery usage which conflicted with updated jQuery version.

= 2.65 =

* Corrected a bug that was causing posts to not appear due to invalid references.

= 2.64 =

* Added an option to disable Disqus without deactivating the plugin.
* Added a second check for comment sync to prevent stampede race conditions in WP cron.

= 2.63 =

* Added command line script to import comments from DISQUS (scripts/import-comments.php).
* Added command line script to export comments to DISQUS (scripts/export-comments.php).
* The exporter will now only do one post at a time.
* The exporter now only sends required attributes to DISQUS.
* Moved media into its own directory.

= 2.62 =

* Changed legacy query to use = operator instead of LIKE so it can be indexed.

= 2.61 =

* Fixed an issue which was causing invalid information to be presented in RSS feeds.

= 2.60 =

* Added support for new Single Sign-On (API version 3.0).
* Improved support for legacy Single Sign-On.

= 2.55 =

* Added support for get_comments_number in templates.

= 2.54 =

* Updated URL to forum moderation.

= 2.53 =

* Fixed an issue with fsockopen and GET requests (only affects certain users).

= 2.52 =

* Fixed issue with Disqus-API package not getting updated (only affecting PHP4).

= 2.51 =

* Added CDATA comments for JavaScript.
* Syncing comments will now restore missing thread information from old imports.
* Install and uninstall processes have been improved.
* Fixed an issue in PHP4 with importing comments.
* Fixed an issue that could cause duplicate comments in some places.
* Added an option to remove existing imported comments when importing.

= 2.50 =

* Added missing file.

= 2.49 =

* Database usage has been optimized for storing comment meta data.

You can perform this migration automatically by visiting Comments -> Disqus, or if
you have a large database, you may do this by hand:

CREATE INDEX disqus_dupecheck ON `wp_commentmeta` (meta_key, meta_value(11));
INSERT INTO `wp_options` (blog_id, option_name, option_value, autoload) VALUES (0, 'disqus_version', '2.49', 'yes') ON DUPLICATE KEY UPDATE option_value = VALUES(option_value);

= 2.48 =

* Comment synchronization has been optimized to be a single call per-site.
* disqus.css will now only load when displaying comments

= 2.47 =

* Fixed a security hole with comment importing.
* Reverted ability to use default template comments design.
* Comments will now store which version they were imported under.
* Added an option to disable server side rendering.

= 2.46 =

* Better debugging information for export errors.
* Added the ability to manual import Disqus comments into Wordpress.
* Added thread_identifier support to exports.
* Cleaned up API error messages.
* Fixed a bug which was causing the import process to not grab only the latest set of comments.
* Added an option to disable automated synchronization with Disqus.

= 2.45 =

* Comments should now store thread information as well as certain other meta data.
* Optimize get_thread polling to only pull comments which aren't stored properly.

= 2.44 =

* Fixed JavaScript response for comments sync call.
* Comments are now marked as closed while showing the embed (fixes showing default respond form).

= 2.43 =

* Fixed a JavaScript syntax error which would cause linting to fail.
* Correct an issue that was causing comments.php to throw a syntax error under some configurations.

= 2.42 =

* Correct a bug with saving disqus_user_api_key (non-critical).
* Added settings to Debug Information.
* Adjusting all includes to use absolute paths.
* Adjusted JSON usage to solve a problem for some clients.

= 2.41 =

* Correct a bug with double urlencoding titles.

= 2.40 =

* Comments are now synced with Disqus as a delayed asynchronous cron event.
* Comment count code has been updated to use the new widget. (Comment counts
  must be linked to get tracked within "the loop" now).
* API bindings have been migrated to the generic 1.1 Disqus API.
* Pages will now properly update their permalink with Disqus when it changes. This is
  done within the sync event above.
* There is now a Debug Information pane under Advanced to assist with support requests.
* When Disqus is unreachable it will fallback to the theme's built-in comment display.
* Legacy mode is no longer available.
* The plugin management interface can now be localized.
* The plugin is now valid HTML5.

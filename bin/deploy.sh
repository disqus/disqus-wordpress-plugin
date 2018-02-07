#! /bin/bash
# Based on https://github.com/GaryJones/wordpress-plugin-git-flow-svn-deploy for instructions and credits.

# Set up some default values. Feel free to change these in your own script
PLUGINSLUG="disqus"
CURRENTDIR=`pwd`
SVNPATH="$CURRENTDIR/tmp"
PLUGINDIR="$CURRENTDIR/$PLUGINSLUG"
MAINFILE="$PLUGINSLUG.php"

echo "Slug: $PLUGINSLUG"
echo "Temp checkout path: $SVNPATH"
echo "Remote SVN repo: $SVNURL"
echo "SVN username: $SVNUSER"
echo "Plugin directory: $PLUGINDIR"
echo "Main file: $MAINFILE"
echo

# Let's begin...
echo ".........................................."
echo
echo "Preparing to deploy WordPress plugin"
echo
echo ".........................................."
echo

# Make sure the SVN temporary folder is removed
rm -fr $SVNPATH/

# Check version in readme.txt is the same as plugin file after translating both to unix line breaks to work around grep's failure to identify mac line breaks
PLUGINVERSION=`grep "Version:" $PLUGINDIR/$MAINFILE | awk -F' ' '{print $NF}' | tr -d '\r'`
echo "$MAINFILE version: $PLUGINVERSION"
READMEVERSION=`grep "^Stable tag:" $PLUGINDIR/README.txt | awk -F' ' '{print $NF}' | tr -d '\r'`
echo "README.txt version: $READMEVERSION"

# Check the version in package.json and make sure it's also the same
PACKAGEVERSION=`cat $CURRENTDIR/package.json | jq -r '.version'`
echo "package.json version: $PACKAGEVERSION"

if [ "$READMEVERSION" = "trunk" ]; then
	echo "Version in readme.txt & $MAINFILE don't match, but Stable tag is trunk. Continuing..."
elif [ "$PLUGINVERSION" != "$READMEVERSION" ]; then
	echo "Version in readme.txt & $MAINFILE don't match. Exiting..."
	exit 1;
elif [ "$PACKAGEVERSION" != "$PLUGINVERSION" ]; then
	echo "Version in package.json & $MAINFILE don't match. Exiting..."
	exit 1;
elif [ "$PLUGINVERSION" = "$READMEVERSION" ]; then
	echo "Versions match in readme.txt, package.json and $MAINFILE. Continuing..."
fi

echo
echo "Creating local copy of SVN repo trunk ..."
svn checkout $SVNURL $SVNPATH --non-interactive --no-auth-cache --username=$SVNUSER --password=$SVNPASS --depth immediates
svn update --quiet $SVNPATH/trunk --set-depth infinity --non-interactive --no-auth-cache --username=$SVNUSER --password=$SVNPASS

# Check latest version tag on SVN and see if this version is a duplicate
cd $SVNPATH
TAGREVISION=`svn info $SVNURL/tags/$PLUGINVERSION --non-interactive --no-auth-cache --username=$SVNUSER --password=$SVNPASS | grep Revision | tr -d 'Revison: '`

if [ -z "$TAGREVISION" ]; then
    echo "No tag for $PLUGINVERSION yet. Continuing..."
else
    echo "Error: A tag exists with the plugin version $PLUGINVERSION. Make sure you update the plugin version before deploying"
    exit 1;
fi

cd ..

echo "Ignoring GitHub specific files"
svn propset svn:ignore "README.md
Thumbs.db
.github/*
.git
.gitattributes
.gitignore" "$SVNPATH/trunk/"

# Make sure assets and trunk files are clean
echo "Removing all files from /assets and /trunk"
rm -rf $SVNPATH/trunk/*
rm -rf $SVNPATH/assets/*

# Move the folder with the plugin files into trunk
echo "Copying plugin files into trunk"
cp -r $PLUGINDIR/* $SVNPATH/trunk/

# Support for the /assets folder on the .org repo.
echo "Copying asset files"
# Make the directory if it doesn't already exist
mkdir -p $SVNPATH/assets/
cp -r $CURRENTDIR/assets/* $SVNPATH/assets/

svn add --force $SVNPATH/assets/

echo "Changing directory to SVN and committing to trunk"
cd $SVNPATH/trunk/
# Delete all files that should not now be added.
svn status | grep -v "^.[ \t]*\..*" | grep "^\!" | awk '{print $2"@"}' | xargs svn del
# Add all new files that are not set to be ignored
svn status | grep -v "^.[ \t]*\..*" | grep "^?" | awk '{print $2"@"}' | xargs svn add
svn commit --non-interactive --no-auth-cache --username=$SVNUSER --password=$SVNPASS -m "Preparing for $PLUGINVERSION release"

echo "Updating WordPress plugin repo assets and committing"
cd $SVNPATH/assets/
# Delete all new files that are not set to be ignored
svn status | grep -v "^.[ \t]*\..*" | grep "^\!" | awk '{print $2"@"}' | xargs svn del
# Add all new files that are not set to be ignored
svn status | grep -v "^.[ \t]*\..*" | grep "^?" | awk '{print $2"@"}' | xargs svn add
svn update --non-interactive --no-auth-cache --username=$SVNUSER --password=$SVNPASS --accept mine-full $SVNPATH/assets/*
svn commit --non-interactive --no-auth-cache --username=$SVNUSER --password=$SVNPASS -m "Updating assets"

echo "Creating new SVN tag and committing it"
cd $SVNPATH
svn update --quiet $SVNPATH/tags/$PLUGINVERSION --non-interactive --no-auth-cache --username=$SVNUSER --password=$SVNPASS
svn copy --quiet trunk/ tags/$PLUGINVERSION/
# Remove trunk folder from tag directory
svn delete --force --quiet $SVNPATH/tags/$PLUGINVERSION/trunk
cd $SVNPATH/tags/$PLUGINVERSION
svn commit --non-interactive --no-auth-cache --username=$SVNUSER --password=$SVNPASS -m "Tagging version $PLUGINVERSION"

echo "Removing temporary directory $SVNPATH"
cd $SVNPATH
cd ..
rm -fr $SVNPATH/

echo "*** FIN ***"

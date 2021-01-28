#!/usr/bin/env bash

# Retrieve the current version number and bump the versions of all required files by the specified amount, create a git version tag, and push the changes to master, triggering a new deploy.
# Based on https://gist.github.com/andyexeter/da932c9644d832e3be6706d20d539ff7

# Usage: ./bin/publish.sh <major|minor|patch> - Increments the relevant version part by one.

set -e


function bump() {
	echo -n "Updating $1..."
	tmp_file=$(mktemp)
	rm -f "$tmp_file"
	sed -i "" "s/$2/$3/1w $tmp_file" $1
	if [ -s "$tmp_file" ]; then
		echo "Done"
	else
		echo "Nothing to change"
	fi
	rm -f "$tmp_file"
}

function confirm() {
	read -r -p "$@ [Y/n]: " confirm

	case "$confirm" in
		[Nn][Oo]|[Nn])
			echo "Aborting."
			exit
			;;
	esac
}


if [ "$1" == "" ]; then
	echo >&2 "No version type provided. Aborting."
	exit 1
fi

if [ "$1" == "major" ] || [ "$1" == "minor" ] || [ "$1" == "patch" ]; then

    # Get the current plugin version from the package.json
    current_version=$(cat package.json | grep version | head -1  | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')

	IFS='.' read -a version_parts <<< "$current_version"

	major=${version_parts[0]}
	minor=${version_parts[1]}
	patch=${version_parts[2]}

	case "$1" in
		"major")
			major=$((major + 1))
			minor=0
			patch=0
			;;
		"minor")
			minor=$((minor + 1))
			patch=0
			;;
		"patch")
			patch=$((patch + 1))
			;;
	esac
	new_version="$major.$minor.$patch"
else
	if [ "$2" == "" ]; then
		echo >&2 "No 'to' version set. Aborting."
		exit 1
	fi
	current_version="$1"
	new_version="$2"
fi

if ! [[ "$new_version" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
	echo >&2 "'to' version doesn't look like a valid semver version tag (e.g: 1.2.3). Aborting."
	exit 1
fi

confirm "Bump version number from $current_version to $new_version?"

# Update package.json version
bump package.json "\"version\": \"$current_version\"" "\"version\": \"$new_version\""

# Update README.txt version
bump disqus/README.txt "Stable tag: $current_version" "Stable tag: $new_version"

# Update disqus.php version
bump disqus/disqus.php "Version:           $current_version" "Version:           $new_version"

# Create commit with version updates
echo "Committing version changes: \"Update plugin version to v$new_version\""
git add package.json disqus/README.txt disqus/disqus.php
git commit -m "Update plugin version to v$new_version"

# Create a new git version tag
echo "Adding new version tag: $new_version"
git tag "$new_version"

# Push version changes and version tag to master
echo "Pushing version changes to master"
git push --tags origin master

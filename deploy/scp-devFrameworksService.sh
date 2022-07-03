#!/bin/bash

# STARTED="copy files 143.198.232.218/var/docker"

# echo $STARTED 

# ssh -t zsysadmin@143.198.232.218 'sudo chown -R zsysadmin:zsysadmin /var/appdata/authServiceDev'

rsync -ahP --delete \
--exclude '.git' --exclude 'node_modules' --exclude 'deploy' --exclude '.vscode' \
$PWD/ zsysadmin@137.184.91.244:/var/appdata/frameworks

# ssh -t zsysadmin@143.198.232.218 'sudo chown -R authServiceDev:authServiceDev /var/appdata/authServiceDev'

# Resources
# https://www.cyberciti.biz/faq/unix-linux-execute-command-using-ssh/
# https://linux.die.net/man/1/rsync
# https://www.digitalocean.com/community/tutorials/how-to-use-rsync-to-sync-local-and-remote-directories
# https://linuxize.com/post/how-to-exclude-files-and-directories-with-rsync/
# https://blog.duklabs.com/using-rsync-on-mac-to-copy-files/

# OverQuota Frameworks Service Server Set Up

- Create droplet with ssh access on DigitalOcean
  
- Loosely Following this tutorial to set up the server: <https://blog.nodeswat.com/set-up-a-secure-node-js-web-application-9256b8790f11>

- Set up a user with limited privileges <https://www.digitalocean.com/community/questions/how-to-enable-ssh-access-for-non-root-users>
  
- Set user bash <https://www.tecmint.com/change-a-users-default-shell-in-linux/>

- Used this post to install node and npm <https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-20-04>

- Here is a good tutorial on systemd services and node <https://www.cloudbees.com/blog/running-node-js-linux-systemd> & <https://www.shubhamdipt.com/blog/how-to-create-a-systemd-service-in-linux/>
  
- Used this post to install nginx <https://www.linuxbabe.com/ubuntu/install-nginx-latest-version-ubuntu-18-04>

## Deploying changes to the live auth server

- https://dev.frameworks.service.viewportmedia.org/

- $ deploy/scp-devFrameworksService.sh

- $ ssh zsysadmin@143.198.232.218

- $ cd /var/appdata/frameworks/

- $ npm ci
  
## Restart the node and nginx services

- $ pm2 restart pm2.config.js --env development --attach && pm2 save

- $ pm2 restart pm2.config.js --env production --attach && pm2 save

- $ sudo systemctl restart nginx


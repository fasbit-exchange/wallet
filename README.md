# online-wallet-server

Node.JS script to host online wallet.

Ubuntu 16.04 - Basic Install
1) Install node.js
sudo apt-get install -y build-essential
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs

2) Install MongoDB - Community Edition

Import Public Key
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5

Create a List File for Mongo
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.6 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.6.list

Reload Package DataBase
sudo apt-get update

Install Mongo Package
sudo apt-get install -y mongodb-org

Start Mongo
sudo service mongod start

Open Mongo Shell
mongo --host 127.0.0.1:27017

In same folder as Script..
npm install
npm start

In Browser
http://localhost:3000/users/login

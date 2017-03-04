# NomikiAuth
Nomiki Auth (Get all announcements on your mobile automatically)

Playstore app: https://play.google.com/store/apps/details?id=com.geotzinos.nomikiauth


#Setup:

#Front-end Tutorial

1) Download and install nodejs (Latest)

2) Install dependencies

npm install -g cordova ionic
cd /project_folder
npm install
ionic platform add android && ionic build android && ionic emulate android

#Back-end Tutorial (For linux server):
More info: https://first-web-scraper.readthedocs.io/en/latest/ (Linux, Windows)

1) Download and install pip

wget https://bootstrap.pypa.io/get-pip.py
python get-pip.py

or

sudo apt install python-pip

2) Installing dependencies

pip install BeautifulSoup4
pip install Requests
apt-get install python-mysqldb

3) Install apache2 php mysql

 sudo apt-get install apache2
 sudo apt-get install mysql-server
 sudo apt-get install php libapache2-mod-php php-mcrypt php-mysql
 sudo a2enmod rewrite
 sudo service apache2 restart
 sudo apt install php-curl





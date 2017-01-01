import requests
import time
from BeautifulSoup import BeautifulSoup

#Global notifications list
notifications = {}

def initializeNotifications():
    notifications = {
        "kosmitia": {},
        "tmimatos": {},
        "upotrofies": {},
        "prokirikseis": {},
        "nea_apo_tritous": {},
        "vathmologia": {}
    }
    
def getNotifications():
    #Define url
    url = 'http://www.law.auth.gr/'
    #Send request to get the page object
    response = requests.get(url)
    #Get the content
    html = response.content
    #Parse it using the BeautifulSoup library
    soup = BeautifulSoup(html)

    #Kosmitia
    getNotificationsForHomeCategory(soup, 'kosmitia', 'qt-news-ui-tabs1')

    #Tmimatos
    getNotificationsForHomeCategory(soup, 'tmimatos', 'qt-news-ui-tabs2')

    #Ypotrofies
    getNotificationsForHomeCategory(soup, 'upotrofies', 'qt-news-ui-tabs3')

    #Prokirikseis
    getNotificationsForHomeCategory(soup, 'prokirikseis', 'qt-news-ui-tabs4')

    #Nea apo tritous
    getNotificationsForHomeCategory(soup, 'nea_apo_tritous', 'qt-news-ui-tabs5')

    #Vathmologia
    getNotificationsForHomeCategory(soup, 'vathmologia', 'qt-news-ui-tabs6')


#Get notifications categories
def getNotificationsForHomeCategory(content, category_name, category_tab_id):
    #Get tab content
    category_tab = content.find('div', attrs={'id': category_tab_id}).find('div').find('div', attrs={'class': 'view-content'})

    #Initialize indexes
    index = 0 #len(notifications[category_name])

    for notification_div in category_tab.findAll('div'):
        #Get date text
        
        dateText = notification_div.find('div', attrs={'class': 'views-field-created'})#.find('span').text
        print dateText

        #Get title text
        titleText = notification_div.find('div', attrs={'class': 'views-field-title'})#.find('span').text

        #Insert date in list
        notifications[category_name][index]["date"] = dateText
        #Insert text in list
        notifications[category_name][index]["title"] = titleText

        #Get the next available index number
        index += 1

#Initialize notifications list
initializeNotifications()

#while True:
getNotifications()

for category in notifications.iteritems():
    for notification in category.iteritems():
        print notification["title"] + " " + notification["date"]

#time.sleep(10)
import time
import requests
from bs4 import BeautifulSoup
import MySQLdb
import unicodedata

database = None

def openDatabaseConnection():
    # Open database connection
    global database
    database = MySQLdb.connect(host="localhost",use_unicode = True, charset = "utf8", user="root",passwd="",db="law" )

    return database

def closeDatabaseConnection():
    global database
    database.close()

def executeSelect(query):
    global database
    # prepare a cursor object using cursor() method
    cursor = database.cursor()

    # execute SQL query using execute() method.
    cursor.execute(query)

    return cursor

def executeQuery(query, notification, category):
    global database
    # prepare a cursor object using cursor() method
    cursor = database.cursor()

    title = unicodedata.normalize('NFKD', notification["title"]).encode('utf-8')
    url = unicodedata.normalize('NFKD', notification["url"]).encode('utf-8')
    date = unicodedata.normalize('NFKD', notification["date"]).encode('utf-8')
    print title
    
    try:
        # execute SQL query using execute() method.
        affected_rows = cursor.execute(query, (title, url, category, date))

        database.commit()
        return affected_rows
    except MySQLdb.IntegrityError:
        #database.rollback()
        return 0


#Global notifications list
notifications = {}
#New notifications list
new_notifications = {}
#Have new notifications ?
have_new_notifications = False

#CONSTANT with all urls to get notifications
PAGE_URLS = {
    "kosmitia": "http://www.law.auth.gr/el/news?tid=7",
    "tmimatos": "http://www.law.auth.gr/el/news?tid=8",
    "upotrofies": "http://www.law.auth.gr/el/news?tid=9",
    "prokirikseis": "http://www.law.auth.gr/el/news?tid=10",
    "nea_apo_tritous": "http://www.law.auth.gr/el/news?tid=11",
    "vathmologia": "http://www.law.auth.gr/el/news?tid=14",
    "tomeas_astikou": "http://www.law.auth.gr/el/civil",
    "tomeas_dimosiou": "http://www.law.auth.gr/el/public",
    "tomeas_diethnwn": "http://www.law.auth.gr/el/public",
    "tomeas_eborikou": "http://www.law.auth.gr/el/commercial",
    "tomeas_istorikou": "http://www.law.auth.gr/el/philosophy",
    "tomeas_poinikwn": "http://www.law.auth.gr/el/criminal",
    "library": "http://www.law.auth.gr/el/library/news"
}
def initializeNotifications():
    #openDatabaseConnection()

    #cur = executeSelect("Select * from announcements")

    #cur.fetchAll()

    #closeDatabaseConnection()

    global notifications
    notifications = {
        "kosmitia": {},
        "tmimatos": {},
        "upotrofies": {},
        "prokirikseis": {},
        "nea_apo_tritous": {},
        "vathmologia": {},
        "tomeas_astikou": {},
        "tomeas_dimosiou": {},
        "tomeas_diethnwn": {},
        "tomeas_eborikou": {},
        "tomeas_istorikou": {},
        "tomeas_poinikwn": {},
        "library": {}
    }
    global new_notifications
    new_notifications = {
        "kosmitia": {},
        "tmimatos": {},
        "upotrofies": {},
        "prokirikseis": {},
        "nea_apo_tritous": {},
        "vathmologia": {},
        "tomeas_astikou": {},
        "tomeas_dimosiou": {},
        "tomeas_diethnwn": {},
        "tomeas_eborikou": {},
        "tomeas_istorikou": {},
        "tomeas_poinikwn": {},
        "library": {}
    }

    global have_new_notifications
    have_new_notifications = False
def initializeNewNotifications():
    global new_notifications
    new_notifications = {
        "kosmitia": {},
        "tmimatos": {},
        "upotrofies": {},
        "prokirikseis": {},
        "nea_apo_tritous": {},
        "vathmologia": {},
        "tomeas_astikou": {},
        "tomeas_dimosiou": {},
        "tomeas_diethnwn": {},
        "tomeas_eborikou": {},
        "tomeas_istorikou": {},
        "tomeas_poinikwn": {},
        "library": {}
    }

    global have_new_notifications
    have_new_notifications = False

def getUrlContent(url):
    #Send request to get the page object
    response = requests.get(url)
    #Get the content
    html = response.content
    #Parse it using the BeautifulSoup library
    soup = BeautifulSoup(html, "html.parser")
    return soup

def getPageLength(content):
    pager = content.find("li", {"class": "pager-last"})
    
    if(pager == None):
        return 0
    else:
        href = pager.find("a").attrs["href"]
        matches_number = href.count("=")
        match = -1
        for i in range(1,matches_number+1):
            match = href.index("=", match + 1)
        return href[match+1:len(href)]

def getNotificationsForCategory(content, category_name):
    """
    Get notifications categories
    """
    global notifications
    global new_notifications
    global have_new_notifications
    #Get tab content
    notifications_content = content.find('div', {'class': 'view-content'})

    #Initialize indexes
    index = len(notifications[category_name])

    for notification_div in notifications_content.find_all('div', {'class': 'views-row'}):
        #Get date text
        
        dateText = notification_div.find('div', {'class': 'views-field-created'}).find('span').text

        #Get title text
        titleText = notification_div.find('div', {'class': 'views-field-title'}).find('span').text

        #Get url
        url = notification_div.find('div', {'class': 'views-field-title'}).find('span').find('a').attrs['href']
        count_slash = url.count("/")

        match_slash = -1
        for i in range(0, count_slash):
            match_slash = url.index("/", match_slash+1)

        url_code = str(url[match_slash+1:len(url)])

        #Insert date,text, url in list
        if notifications[category_name].get(url_code) == None:
            notifications[category_name][url_code] = {
                "date": dateText,
                "title": titleText,
                "url": url
            }
            new_notifications[category_name][url_code] = {
               "date": dateText,
                "title": titleText,
                "url": url
            }
            have_new_notifications = True

        #Get the next available index number
        index += 1

def getFullNotifications():
    for key,url in PAGE_URLS.iteritems():
        page_length = int(getPageLength(getUrlContent(url)))
        if url.count("?") != 0:
            query_field = "&page="
        else:
            query_field = "?page="
        for i in range(0, page_length+1):
            html_doc = getUrlContent(url + query_field + str(i))
            getNotificationsForCategory(html_doc, key)

def getNewNotifications():
    for key,url in PAGE_URLS.iteritems():
        page_length = 0 #int(getPageLength(getUrlContent(url)))
        if url.count("?") != 0:
            query_field = "&page="
        else:
            query_field = "?page="
        for i in range(0, page_length+1):
            html_doc = getUrlContent(url + query_field + str(i))
            getNotificationsForCategory(html_doc, key)


print "---- Scraper Started ----"

print "Initialize Notifications objects"
#Initialize notifications list
initializeNotifications()

print "Get Full notifications"
getFullNotifications()

#print "Loop through all full notifications"
#for category in sorted(notifications):
#        for notification in sorted(notifications[category]):
#            print notifications[category][notification]["title"]
#            print notifications[category][notification]["date"] 
#            print notifications[category][notification]["url"]

print "While True"
while(True):

    if have_new_notifications:
        print "Open database connection"
        openDatabaseConnection()

        print "Loop through all new notifications"
        for category in sorted(new_notifications):
            for notification in sorted(new_notifications[category]):
                query = "INSERT INTO announcements (title, url, category, date) VALUES (%s,%s,%s,%s)"
                executeQuery(query,new_notifications[category][notification], category)
        
        print "Close database connection"
        closeDatabaseConnection()

    #print "Initialize the new notifications object"
    initializeNewNotifications()

    #print "Sleep for some seconds"
    time.sleep(10)

    #print "Repeat the proccess"
    getNewNotifications()
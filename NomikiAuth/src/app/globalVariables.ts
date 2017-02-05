'use strict';

//Initialize announcements
export var announcements = null;

export function setAnnouncements(data)
{
    announcements = data;
}

//Initialize language
export var language = "gr";

export function setLanguage(data)
{
    language = data;
}

//Selected categories to filter
export var categoriesObj = {
    "kosmitia": {
        name: {
            "gr": "Κοσμητείας",
            "en": ""
        },
        checked: true
    },
    "tmimatos": {
        name: {
            "gr": "Τμήματος",
            "en": ""
        },
        checked: true
    },
    "upotrofies": {
        name: {
            "gr": "Υποτροφίες",
            "en": ""
        },
        checked: true
    },
    "prokirikseis": {
        name: {
            "gr": "Προκυρήξεις",
            "en": ""
        },
        checked: true
    },
    "nea_apo_tritous": {
        name: {
            "gr": "Νέα από Τρίτους",
            "en": ""
        },
        checked: true
    },
    "vathmologia": {
        name: {
            "gr": "Βαθμολογίες",
            "en": ""
        },
        checked: true
    },
    "tomeas_astikou": {
        name: {
            "gr": "Τομέα Αστικού",
            "en": ""
        },
        checked: true
    },
    "tomeas_dimosiou": {
        name: {
            "gr": "Τομέα Δημοσίου",
            "en": ""
        },
        checked: true
    },
    "tomeas_diethnwn": {
        name: {
            "gr": "Τομέα Διεθνών σπουδών",
            "en": ""
        },
        checked: true
    },
    "tomeas_eborikou": {
        name: {
            "gr": "Τομέα Εμπορικού",
            "en": ""
        },
        checked: true
    },
    "tomeas_istorikou": {
        name: {
            "gr": "Τομέα Φιλοσοφίας",
            "en": ""
        },
        checked: true
    },
    "tomeas_poinikwn": {
        name: {
            "gr": "Τομέα ποινικού",
            "en": ""
        },
        checked: true
    },
    "library": {
        name: {
            "gr": "Βιβλιοθήκης",
            "en": ""
        },
        checked: true
    },
}

export function setSelectedCategories(category_name, checked)
{
    categoriesObj[category_name].name[language] = checked;
}
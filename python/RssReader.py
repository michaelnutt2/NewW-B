# Python program to download Ars articles for database project

import csv
import requests
from requests.exceptions import HTTPError
import feedparser
import json
import xml.etree.ElementTree as etree
import io
import os

print(os.getcwd())

def main():
    while(True):
        print("Welcome to the Ars Technica News Feed")
        print("Options:\n[R]efresh\n[S]ave\n[E]xit")
        option = input()

        if option.lower() == 'r':
            loadRSS()
        if option.lower() == 's':
            parseRSS()
        if option.lower() == 'e':
            return

def loadRSS():
    invalid = True
    while(invalid):
        option = input("[A]rs Technica\n")

        if option.lower() == 'a':
            invalid = False
            url = 'https://arstechnica.com/feed/?t=c951724f17882c293435a61d10002d8b'
        else:
            print("Invalid option")

    try:
        r = requests.get(url)
        r.raise_for_status()
    except HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')
    except Exception as err:
        print(f'Other error occured: {err}')
    else:
        print("Success!")

    with io.open('../Articles/news.xml', "w", encoding="utf-8") as f:
        f.write(r.text)

def parseXML(xmlfile):
    tree = etree.parse(xmlfile)

    root = tree.getroot()

    articles = []

    # for item in root.findall('item'):
    #     article = {}

    for item in root.findall('./channel/item'):
        article = {}
        categories = []
        for child in item:
            if child.tag == 'title':
                article['title'] = child.text
            if child.tag == 'content':
                article['content'] = child.text
            if child.tag == 'dc:creator':
                article['author'] = child.text
            if child.tag == 'category':
                categories.append(child.text)
        article['categories'] = categories
        articles.append(article)
    
    print(articles[0])

def parseRSS():
    f = feedparser.parse(r'../Articles/news.xml')

    articles = []

    for entry in f['entries']:
        article = {
            'newsgroup': f.feed.title,
            'title': entry.title,
            'url': entry.link,
            'author': entry.author,
            'date': entry.published,
            'description': entry.summary,
            'content': entry.content[0].value,
            'category': entry.tags[0]['term'],
            'tags':  [tag['term'] for tag in entry.tags[1:]]
        }
        articles.append(article)
    print(articles)

    exportData(articles)

def exportData(articles):
    metadata = []
    for article in articles:

        stripped_title = "".join([c for c in article['title'] if c.isalpha() or c.isdigit() or c==' ']).rstrip()
        filename = "../Articles/" + stripped_title + ".html"
        metadata.append({
            'newsgroup': article['newsgroup'],
            'title': article['title'],
            'author': article['author'],
            'date': article['date'],
            'url': article['url'],
            'filepath': filename,
            'summary': article['description'],
            'tags': article['category'],
            'keywords': article['tags'],
            'rank':  0,
            'text': article['content']
        })
        with io.open(filename, "w", encoding="utf-8") as f:
            f.write(article['content'])
        #with open(filename, 'w') as fp:
        #    fp.write(article['content'])

    with open('../Articles/metadata.json', 'a') as fp:
        json.dump(metadata,fp)

    # with open('metadata.json', 'r') as fp:
    #     data = json.load(fp)


    # data.append(metadata)

    # with open('metadata.json', 'w') as fp:
    #     json.dump(metadata, fp)
    
if __name__ == "__main__":
    main()
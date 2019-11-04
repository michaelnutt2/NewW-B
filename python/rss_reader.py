# Python program to download Ars articles for database project

import csv
import requests
from requests.exceptions import HTTPError
import feedparser
import json
import xml.etree.ElementTree as etree
import io
import os
from bs4 import BeautifulSoup
from datetime import datetime
from dateutil import parser

PATH = ('../Articles')


print(os.getcwd())

def main():

    def loadRSS():
        url = 'https://arstechnica.com/feed/?t=c951724f17882c293435a61d10002d8b'

        try:
            r = requests.get(url)
            r.raise_for_status()
        except HTTPError as http_err:
            print(f'HTTP error occurred: {http_err}')
        except Exception as err:
            print(f'Other error occured: {err}')
        else:
            print("Success!")

        with io.open(PATH +'/news.xml', "w", encoding="utf-8") as f:
            f.write(r.text)

    def parseRSS():
        f = feedparser.parse(r'../Articles/news.xml')

        articles = []

        for entry in f['entries']:
            article = {
                'newsgroup': f.feed.title,
                'title': entry.title,
                'url': entry.link,
                'author': entry.author,
                'date': parser.parse(entry.published),
                'description': entry.summary,
                'content': entry.content[0].value,
                'category': entry.tags[0]['term'],
                'tags':  [tag['term'] for tag in entry.tags[1:]],
                'img': BeautifulSoup(entry.content[0].value, 'html.parser').img['src']
            }
            articles.append(article)
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
                'img' : article['img']
            })
            with io.open(filename, "w", encoding="utf-8") as f:
                f.write(article['content'])

        with open('../Articles/metadata.json', 'w+') as fp:
            json.dump(metadata,fp)
    
    loadRSS()
    parseRSS()

if __name__ == "__main__":
    main()
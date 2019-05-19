import json
from recipe_scrapers import scrape_me


def scrape_url(url):
    scraper = scrape_me(url)

    data = {
        "name": scraper.title(),
        "sourceName": scraper.host(),
        "sourceUrl": url,
        "time": scraper.total_time(),
        "ingredients": scraper.ingredients(),
        "instructions": scraper.instructions(),
    }
    print(json.dumps(data))


if __name__ == "__main__":
    import sys

    scrape_url(sys.argv[1])

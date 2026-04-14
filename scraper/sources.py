"""
All news sources for the Trump Diary scraper.
Each source has: name, url (RSS feed), category, description.

Categories:
  - mainstream       : Major wire services and newspapers of record
  - progressive      : Left-leaning / progressive outlets
  - satirical        : Satire and comedy news
  - international    : Non-US outlets covering US politics
  - investigative    : Fact-checkers and watchdog organizations
  - ironic           : Right-wing or surprising sources (enemy monitoring)
  - commentary       : Substacks and opinion writers
  - legal            : Legal analysis and accountability orgs
  - aggregator       : Community-driven and aggregator sites
"""

SOURCES = [
    # =========================================================================
    # MAINSTREAM / SERIOUS (13)
    # Major wire services, newspapers of record, and TV network news
    # =========================================================================
    {
        "name": "Reuters - World",
        "url": "https://www.reutersagency.com/feed/",
        "category": "mainstream",
        "description": "Gold-standard wire service; factual, unspun global news coverage",
    },
    {
        "name": "NPR Politics",
        "url": "https://feeds.npr.org/1014/rss.xml",
        "category": "mainstream",
        "description": "Public radio's politics desk; balanced, in-depth US political reporting",
    },
    {
        "name": "New York Times - Politics",
        "url": "https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml",
        "category": "mainstream",
        "description": "Paper of record; comprehensive White House, Congress, and elections coverage",
    },
    {
        "name": "Washington Post - Politics",
        "url": "https://feeds.washingtonpost.com/rss/politics",
        "category": "mainstream",
        "description": "Democracy dies in darkness; strong investigative and White House beat reporting",
    },
    {
        "name": "CNN Politics",
        "url": "http://rss.cnn.com/rss/cnn_allpolitics.rss",
        "category": "mainstream",
        "description": "24-hour cable news; fast-breaking political coverage and analysis",
    },
    {
        "name": "CBS News - Politics",
        "url": "https://www.cbsnews.com/latest/rss/politics",
        "category": "mainstream",
        "description": "Network TV news politics coverage with strong investigative tradition",
    },
    {
        "name": "ABC News - Politics",
        "url": "https://feeds.abcnews.com/abcnews/politicsheadlines",
        "category": "mainstream",
        "description": "Network news politics desk; straightforward headline coverage",
    },
    {
        "name": "NBC News",
        "url": "https://feeds.nbcnews.com/nbcnews/public/news",
        "category": "mainstream",
        "description": "Major network news with broad US and world political coverage",
    },
    {
        "name": "Politico",
        "url": "https://www.politico.com/rss/politics08.xml",
        "category": "mainstream",
        "description": "Capitol Hill bible; insider political reporting on Congress and campaigns",
    },
    {
        "name": "The Atlantic",
        "url": "https://www.theatlantic.com/feed/all/",
        "category": "mainstream",
        "description": "Long-form analysis and essays on democracy, culture, and political trends",
    },
    {
        "name": "Axios",
        "url": "https://api.axios.com/feed/",
        "category": "mainstream",
        "description": "Smart brevity format; concise political news and policy analysis",
    },
    {
        "name": "USA Today",
        "url": "http://rssfeeds.usatoday.com/UsatodaycomNation-TopStories",
        "category": "mainstream",
        "description": "Widely-read national newspaper; broad middle-America perspective",
    },
    {
        "name": "AP News - Politics",
        "url": "https://news.google.com/rss/search?q=site:apnews.com+politics&hl=en-US&gl=US&ceid=US:en",
        "category": "mainstream",
        "description": "Wire service via Google News RSS proxy (AP killed native RSS); factual baseline",
    },

    # =========================================================================
    # PROGRESSIVE / LEFT-LEANING (13)
    # Explicitly progressive editorial stance
    # =========================================================================
    {
        "name": "MSNBC",
        "url": "https://www.msnbc.com/feeds/latest",
        "category": "progressive",
        "description": "Progressive cable news; strong opinion programming and Trump accountability coverage",
    },
    {
        "name": "HuffPost Politics",
        "url": "https://www.huffpost.com/section/politics/feed",
        "category": "progressive",
        "description": "Liberal digital-first outlet; viral-friendly progressive politics coverage",
    },
    {
        "name": "The Daily Beast",
        "url": "https://feeds.thedailybeast.com/rss/articles",
        "category": "progressive",
        "description": "Sharp, aggressive political reporting and opinion with liberal editorial stance",
    },
    {
        "name": "Mother Jones",
        "url": "https://www.motherjones.com/politics/feed/",
        "category": "progressive",
        "description": "Nonprofit investigative journalism; exposes corruption and power abuses",
    },
    {
        "name": "Salon",
        "url": "https://www.salon.com/feed/",
        "category": "progressive",
        "description": "Progressive commentary and fearless cultural-political criticism",
    },
    {
        "name": "Slate - News & Politics",
        "url": "https://slate.com/feeds/news-and-politics.rss",
        "category": "progressive",
        "description": "Contrarian liberal analysis; sharp takes on policy and political culture",
    },
    {
        "name": "The Intercept",
        "url": "https://theintercept.com/feed/?lang=en",
        "category": "progressive",
        "description": "Adversarial journalism focused on surveillance, war, corruption, and civil liberties",
    },
    {
        "name": "The New Republic",
        "url": "https://newrepublic.com/pages/rss-feeds",
        "category": "progressive",
        "description": "Historic liberal magazine; sharp political commentary and cultural criticism",
    },
    {
        "name": "Daily Kos",
        "url": "https://www.dailykos.com/blogs/main.rss",
        "category": "progressive",
        "description": "Progressive grassroots community; activism-oriented political news and analysis",
    },
    {
        "name": "Raw Story",
        "url": "https://www.rawstory.com/feeds/feed.rss",
        "category": "progressive",
        "description": "Investigative progressive news; surfaces stories mainstream media overlooks",
    },
    {
        "name": "Common Dreams",
        "url": "https://www.commondreams.org/feeds/feed.rss",
        "category": "progressive",
        "description": "Nonprofit progressive news; strong on economic inequality and peace issues",
    },
    {
        "name": "Truthout",
        "url": "https://truthout.org/latest/feed/",
        "category": "progressive",
        "description": "Nonprofit progressive journalism; covers systemic injustice and policy failures",
    },
    {
        "name": "Vox",
        "url": "https://www.vox.com/rss/index.xml",
        "category": "progressive",
        "description": "Explanatory journalism; makes complex policy and politics accessible",
    },

    # =========================================================================
    # SATIRICAL / COMEDY (7)
    # Humor, satire, and parody news
    # =========================================================================
    {
        "name": "The Onion",
        "url": "https://theonion.com/feed/",
        "category": "satirical",
        "description": "America's finest news source; gold standard of political satire since 1988",
    },
    {
        "name": "Borowitz Report (New Yorker)",
        "url": "https://www.newyorker.com/feed/humor/borowitz-report",
        "category": "satirical",
        "description": "Andy Borowitz's satirical news column; biting one-liners about political absurdity",
    },
    {
        "name": "McSweeney's Internet Tendency",
        "url": "https://feeds.feedburner.com/mcsweeneys",
        "category": "satirical",
        "description": "Literary humor site; brilliant satirical essays and lists about politics and culture",
    },
    {
        "name": "Reductress",
        "url": "https://reductress.com/feed/",
        "category": "satirical",
        "description": "Satirical women's magazine; skewers patriarchy and political absurdity",
    },
    {
        "name": "The Daily Mash",
        "url": "https://www.thedailymash.co.uk/feed",
        "category": "satirical",
        "description": "British Onion equivalent; outsider perspective on American political insanity",
    },
    {
        "name": "NewsBiscuit",
        "url": "https://www.newsbiscuit.com/blog-feed.xml",
        "category": "satirical",
        "description": "UK satirical news; described by NYT as the British version of The Onion",
    },
    {
        "name": "The Halfway Post",
        "url": "https://halfwaypost.com/feed/",
        "category": "satirical",
        "description": "Small satirical outlet specializing in Trump parody and political absurdism",
    },

    # =========================================================================
    # INTERNATIONAL PERSPECTIVE (7)
    # Non-US outlets covering American politics from outside
    # =========================================================================
    {
        "name": "The Guardian US",
        "url": "https://www.theguardian.com/us-news/us-politics/rss",
        "category": "international",
        "description": "Britain's leading liberal voice; outsider perspective on US democracy's struggles",
    },
    {
        "name": "BBC - US & Canada",
        "url": "https://feeds.bbci.co.uk/news/world/us_and_canada/rss.xml",
        "category": "international",
        "description": "World's most trusted broadcaster; sober outside-looking-in US coverage",
    },
    {
        "name": "Der Spiegel International",
        "url": "https://www.spiegel.de/international/index.rss",
        "category": "international",
        "description": "Germany's top newsmagazine in English; European perspective on Trump chaos",
    },
    {
        "name": "Al Jazeera English",
        "url": "https://www.aljazeera.com/xml/rss/all.xml",
        "category": "international",
        "description": "Global South perspective; covers US foreign policy impact the US media ignores",
    },
    {
        "name": "France 24 - Americas",
        "url": "https://www.france24.com/en/americas/rss",
        "category": "international",
        "description": "French perspective on American politics; Francophone world's view of US chaos",
    },
    {
        "name": "Deutsche Welle - English",
        "url": "https://rss.dw.com/rdf/rss-en-all",
        "category": "international",
        "description": "German public broadcaster in English; EU perspective on transatlantic relations",
    },
    {
        "name": "The Independent",
        "url": "https://www.independent.co.uk/us/rss",
        "category": "international",
        "description": "British newspaper with strong US desk; progressive international perspective",
    },

    # =========================================================================
    # INVESTIGATIVE / WATCHDOG (5)
    # Fact-checkers and accountability organizations
    # =========================================================================
    {
        "name": "ProPublica",
        "url": "https://feeds.propublica.org/propublica/main",
        "category": "investigative",
        "description": "Pulitzer-winning nonprofit investigative newsroom; exposes abuses of power",
    },
    {
        "name": "PolitiFact",
        "url": "https://www.politifact.com/rss/all/",
        "category": "investigative",
        "description": "Truth-O-Meter fact-checker; rates political claims from True to Pants on Fire",
    },
    {
        "name": "Snopes",
        "url": "https://www.snopes.com/feed/",
        "category": "investigative",
        "description": "Definitive fact-checking site; debunks misinformation and political rumors",
    },
    {
        "name": "FactCheck.org",
        "url": "https://www.factcheck.org/feed/",
        "category": "investigative",
        "description": "Annenberg Public Policy Center fact-checker; nonpartisan claim verification",
    },
    {
        "name": "CREW (Citizens for Ethics)",
        "url": "https://www.citizensforethics.org/feed/",
        "category": "investigative",
        "description": "Government ethics watchdog; tracks Trump administration corruption and conflicts",
    },

    # =========================================================================
    # IRONIC / UNUSUAL (4)
    # Right-wing sources for enemy monitoring and "even Fox says..." moments
    # =========================================================================
    {
        "name": "Fox News - Politics",
        "url": "https://moxie.foxnews.com/google-publisher/politics.xml",
        "category": "ironic",
        "description": "State TV for MAGA; monitor for 'even Fox admits...' moments and spin tracking",
    },
    {
        "name": "Breitbart",
        "url": "https://feeds.feedburner.com/breitbart",
        "category": "ironic",
        "description": "Far-right news; enemy monitoring for MAGA base narratives and talking points",
    },
    {
        "name": "The Babylon Bee",
        "url": "https://babylonbee.com/feed",
        "category": "ironic",
        "description": "Right-wing satire site; useful for tracking conservative humor and grievances",
    },
    {
        "name": "r/politics (Reddit)",
        "url": "https://www.reddit.com/r/politics/.rss",
        "category": "ironic",
        "description": "Reddit's politics megaforum; real-time pulse of what stories are going viral",
    },

    # =========================================================================
    # COMMENTARY / SUBSTACKS (9)
    # Individual voices and opinion writers
    # =========================================================================
    {
        "name": "Heather Cox Richardson",
        "url": "https://heathercoxrichardson.substack.com/feed",
        "category": "commentary",
        "description": "Historian's daily newsletter; contextualizes current politics in American history",
    },
    {
        "name": "Joyce Vance - Civil Discourse",
        "url": "https://joycevance.substack.com/feed",
        "category": "commentary",
        "description": "Former US Attorney; expert legal analysis of Trump's legal jeopardy",
    },
    {
        "name": "Robert Reich",
        "url": "https://robertreich.substack.com/feed",
        "category": "commentary",
        "description": "Former Labor Secretary; sharp takes on economic inequality and oligarchy",
    },
    {
        "name": "Jay Kuo - The Status Kuo",
        "url": "https://statuskuo.substack.com/feed",
        "category": "commentary",
        "description": "Attorney and commentator; accessible legal and political analysis",
    },
    {
        "name": "The Bulwark",
        "url": "https://www.thebulwark.com/feed/",
        "category": "commentary",
        "description": "Never-Trump conservatives; powerful because criticism comes from the right",
    },
    {
        "name": "Mary Trump",
        "url": "https://marytrump.substack.com/feed",
        "category": "commentary",
        "description": "The president's niece; unique family insider perspective on Trump psychology",
    },
    {
        "name": "Dan Rather - Steady",
        "url": "https://steady.substack.com/feed",
        "category": "commentary",
        "description": "Legendary journalist's newsletter; moral clarity and historical perspective",
    },
    {
        "name": "Steve Schmidt - The Warning",
        "url": "https://thewarning.substack.com/feed",
        "category": "commentary",
        "description": "Ex-GOP strategist turned Trump critic; insider knowledge of Republican machinery",
    },
    {
        "name": "Zeteo (Mehdi Hasan)",
        "url": "https://zeteo.com/feed",
        "category": "commentary",
        "description": "Adversarial progressive journalist; fearless interviews and accountability reporting",
    },

    # =========================================================================
    # LEGAL / ACCOUNTABILITY (2)
    # Legal analysis specific to democracy and national security
    # =========================================================================
    {
        "name": "Lawfare",
        "url": "https://www.lawfaremedia.org/feed",
        "category": "legal",
        "description": "National security law blog; essential for understanding Trump legal battles",
    },
    {
        "name": "Just Security",
        "url": "https://www.justsecurity.org/feed/",
        "category": "legal",
        "description": "NYU law forum on security, democracy, and rights; expert legal analysis",
    },
]

SOURCE_COUNT = len(SOURCES)

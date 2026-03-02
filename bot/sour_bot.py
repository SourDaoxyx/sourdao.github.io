"""
SOUR Protocol — Twitter Bot
Zamanlı tweet atar + keşfet reply (Basic API ile)
"""

import tweepy
import schedule
import time
import random
import os
import json
import logging
from datetime import datetime
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

# ─── Logging ───────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler("bot/bot.log", encoding="utf-8"),
        logging.StreamHandler(),
    ],
)
log = logging.getLogger(__name__)

# ─── Twitter Client ────────────────────────────────────────────────────────────
client = tweepy.Client(
    bearer_token=os.getenv("TWITTER_BEARER_TOKEN"),
    consumer_key=os.getenv("TWITTER_API_KEY"),
    consumer_secret=os.getenv("TWITTER_API_SECRET"),
    access_token=os.getenv("TWITTER_ACCESS_TOKEN"),
    access_token_secret=os.getenv("TWITTER_ACCESS_SECRET"),
    wait_on_rate_limit=True,
)

# ─── Tweet Şablonları ──────────────────────────────────────────────────────────
MORNING_TWEETS = [
    """\
Your on-chain reputation starts today. 🫙

Hold $SOUR → score rises 📈
Sell $SOUR → score resets to zero 💀

No platform. No fake reviews.
Just your wallet. Your history. Your identity.

sourdao.xyz/crust

#Solana #DeFi #SOUR #Web3""",

    """\
Good morning, bakers. 🍞

The longest-holding $SOUR wallets
have the highest Crust Scores.

Today is day [X] of holding.
Every day counts.

Check your score 👇
sourdao.xyz/crust

#SOUR #Solana #CrustScore""",

    """\
Modern finance went stale.

Banks charge fees to store YOUR money.
Platforms charge fees to use YOUR skills.
Middlemen charge fees to trust YOUR word.

We came to ferment something different.

The Civilization Protocol is live.
sourdao.xyz

#OrganicFinance #Solana #SOUR""",

    """\
Imagine hiring a developer on-chain.

→ Lock funds in smart contract
→ Work gets done
→ Payment releases automatically
→ Both wallets earn reputation

No Fiverr. No PayPal. No chargebacks.

🤝 Handshake — live on devnet.
sourdao.xyz/handshake

#Solana #Freelance #Web3 #DeFi""",

    """\
Fiverr takes 20%.
Upwork takes 20%.
Your bank takes 3%.

We take 2%.
And half of that goes back to the protocol.

This is what finance looks like
when the community owns it.

sourdao.xyz

#DeFi #Solana #SOUR""",

    """\
Four tiers. One path. 🫙

🥖 Fresh Dough    → 0-99 score
🍞 Rising Dough   → 100-249 score
🥇 Golden Crust   → 250-499 score
⭐ Eternal Starter → 500+ score

Which tier are you?
sourdao.xyz/crust

#SOUR #Solana #CrustScore""",

    """\
Hot take:

Your on-chain wallet history
is worth more than any LinkedIn profile
or Fiverr rating.

We built a protocol around this idea.

sourdao.xyz/crust

#Web3 #Solana #DeFi #Reputation""",
]

EVENING_TWEETS = [
    """\
Evening reminder. 🌙

$SOUR you hold right now
is building your Diamond Hands score.

Day by day. Block by block.

Don't break the streak. 🍞

sourdao.xyz/crust

#SOUR #Solana #DiamondHands""",

    """\
The leaderboard doesn't lie. 👑

Top bakers hold. They build.
They complete Handshakes.
They don't sell when it gets hard.

Where do you rank?
sourdao.xyz/crust/leaderboard

#SOUR #Solana #Leaderboard""",

    """\
What would you use Handshake for?

→ Hiring a developer?
→ Selling a design?
→ OTC settlement?
→ Paying a content creator?

The protocol is trustless.
The possibilities aren't.

sourdao.xyz/handshake

#Solana #Web3 #P2P #SOUR""",

    """\
SOUR is not a memecoin.

It's the infrastructure for trust
between strangers on the internet.

Four pillars:
🍞 Crust — reputation
🤝 Handshake — escrow
🌾 Harvest — community treasury
🏭 Mill — AI marketplace

sourdao.xyz

#Solana #DeFi #SOUR""",

    """\
Your wallet has a history.

Every buy. Every hold. Every deal.
Every day you didn't sell.

That history is your reputation.
On-chain. Immutable. Yours.

sourdao.xyz/crust

#SOUR #Solana #OnChain #Web3""",

    """\
The Bakery is open 24/7. 🫙

→ Connect your wallet
→ See your Crust Score
→ Earn badges
→ Climb the leaderboard

What are you waiting for?

sourdao.xyz/crust

#SOUR #Solana #CrustScore""",

    """\
Fermentation cannot be rushed. 🍞

The starter rises at its own pace.
But once it rises —
it lifts everything around it.

$SOUR. The Civilization Protocol.

sourdao.xyz

#SOUR #Solana #OrganicFinance""",
]

# İz dosyası — aynı şablonu arka arkaya atmamak için
HISTORY_FILE = "bot/tweet_history.json"

def load_history():
    if os.path.exists(HISTORY_FILE):
        with open(HISTORY_FILE, "r") as f:
            return json.load(f)
    return {"morning_last": -1, "evening_last": -1, "replied_ids": []}

def save_history(h):
    with open(HISTORY_FILE, "w") as f:
        json.dump(h, f, indent=2)

def pick_tweet(pool, last_idx):
    """Son kullanılan haricinden rastgele seç."""
    available = [i for i in range(len(pool)) if i != last_idx]
    idx = random.choice(available)
    return idx, pool[idx]


# ─── Tweet Gönder ──────────────────────────────────────────────────────────────
def post_tweet(text, label="tweet"):
    try:
        resp = client.create_tweet(text=text)
        tweet_id = resp.data["id"]
        log.info(f"✅ {label} posted — id={tweet_id}")
        return tweet_id
    except tweepy.TweepyException as e:
        log.error(f"❌ Failed to post {label}: {e}")
        return None


# ─── Sabah Tweeti ──────────────────────────────────────────────────────────────
def morning_tweet():
    h = load_history()
    idx, text = pick_tweet(MORNING_TWEETS, h.get("morning_last", -1))
    tweet_id = post_tweet(text, "morning tweet")
    if tweet_id:
        h["morning_last"] = idx
        save_history(h)


# ─── Akşam Tweeti ─────────────────────────────────────────────────────────────
def evening_tweet():
    h = load_history()
    idx, text = pick_tweet(EVENING_TWEETS, h.get("evening_last", -1))
    tweet_id = post_tweet(text, "evening tweet")
    if tweet_id:
        h["evening_last"] = idx
        save_history(h)


# ─── Keşfet Reply (Basic API gerektirir) ──────────────────────────────────────
KEYWORDS = ["#Solana DeFi", "on-chain reputation", "Solana freelance", "Solana escrow", "pump.fun gem"]

REPLY_TEMPLATES = [
    "We're building exactly this — on-chain reputation that resets if you sell. Check sourdao.xyz 🫙",
    "Interesting angle. At SOUR we encode trust on-chain via Crust Scores + P2P escrow. sourdao.xyz",
    "This is the problem we're solving. Trustless P2P on Solana — sourdao.xyz/handshake 🤝",
    "Your reputation lives on-chain. No platform can take it. sourdao.xyz/crust 🍞",
    "Agreed. The Civilization Protocol is building this on Solana. sourdao.xyz 🫙",
]

def search_and_reply():
    """Basic API ($100/ay) olmadan bu kısım çalışmaz — geçici olarak devre dışı."""
    # Basic API'ye geçince True yap
    BASIC_API_ENABLED = False
    if not BASIC_API_ENABLED:
        log.info("ℹ️  Search/reply deactivated — requires Basic API tier")
        return

    h = load_history()
    replied = set(h.get("replied_ids", []))

    for kw in KEYWORDS:
        try:
            results = client.search_recent_tweets(
                query=f"{kw} -is:retweet lang:en",
                max_results=10,
                tweet_fields=["public_metrics", "author_id"],
            )
            if not results.data:
                continue

            # Sadece 50+ like alan tweetlere reply at
            for tweet in results.data:
                if tweet.id in replied:
                    continue
                likes = tweet.public_metrics.get("like_count", 0)
                if likes < 50:
                    continue

                reply_text = random.choice(REPLY_TEMPLATES)
                try:
                    client.create_tweet(
                        text=reply_text,
                        in_reply_to_tweet_id=tweet.id,
                    )
                    log.info(f"💬 Replied to tweet {tweet.id} (likes={likes})")
                    replied.add(tweet.id)
                    time.sleep(30)  # Rate limit koruması
                except tweepy.TweepyException as e:
                    log.error(f"Reply failed: {e}")

        except tweepy.TweepyException as e:
            log.error(f"Search failed for '{kw}': {e}")

    h["replied_ids"] = list(replied)[-200:]  # Son 200'ü tut
    save_history(h)


# ─── Zamanlama (Türkiye saati = UTC+3) ───────────────────────────────────────
# schedule UTC çalışır — 09:00 TR = 06:00 UTC, 21:00 TR = 18:00 UTC

schedule.every().day.at("06:00").do(morning_tweet)   # 09:00 Türkiye
schedule.every().day.at("18:00").do(evening_tweet)   # 21:00 Türkiye
schedule.every(4).hours.do(search_and_reply)         # Her 4 saatte keşfet tara


# ─── Ana Döngü ─────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    log.info("🫙 SOUR Twitter Bot started")
    log.info(f"Next morning tweet: {schedule.next_run()}")

    # Başlarken hemen bir test tweeti atmak istersen:
    # morning_tweet()

    while True:
        schedule.run_pending()
        time.sleep(60)

// Vercel serverless function — proxies ESPN public scoreboard API
// Deployed at /api/scores?sport=NBA (or MLB, MLS, NFL, College)
// This avoids CORS issues since the request comes from a server, not a browser.

const ESPN_URLS = {
  NBA:     "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard",
  MLB:     "https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard",
  MLS:     "https://site.api.espn.com/apis/site/v2/sports/soccer/usa.1/scoreboard",
  NFL:     "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard",
  College: "https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard",
  NHL:     "https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard",
};

export default async function handler(req, res) {
  // Allow requests from your Vercel domain
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Cache-Control", "s-maxage=25, stale-while-revalidate=55");

  const sport = req.query.sport;
  const url = ESPN_URLS[sport];

  if (!url) {
    return res.status(400).json({ error: "Unknown sport: " + sport });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "ESPN returned " + response.status });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error("ESPN proxy error:", err);
    return res.status(500).json({ error: "Failed to fetch from ESPN", detail: err.message });
  }
}

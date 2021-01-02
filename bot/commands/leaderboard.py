from discord.ext import commands
import discord
import requests
import os

lb_keys = {
  "gameDuration": "avg_gameDuration",
  "kills": "avg_kills",
  "deaths": "avg_deaths",
  "assists": 'avg_assists',
  "goldEarned": "avg_goldEarned",
  "totalMinionsKilled": "avg_totalMinionsKilled",
  "totalDamageDealtToChampions": "avg_totalDamageDealtToChampions",
  "kills15": "avg_kills15",
  "soloKills": "avg_soloKills",
  "gankKills": "avg_gankKills",
  "deaths15": "avg_deaths15",
  "soloDeaths": "avg_soloDeaths",
  "gankDeaths": "avg_gankDeaths",
  "assists15": "avg_assists15",
  "neutralMinionsKilled": "avg_neutralMinionsKilled",
  "neutralMinionsKilledTeamJungle": "avg_neutralMinionsKilledTeamJungle",
  "neutralMinionsKilledEnemyJungle": "avg_neutralMinionsKilledEnemyJungle",
  "firstItemTime": "avg_firstItemTime",
  "goldGen10": "avg_goldGen10",
  "goldGen20": "avg_goldGen20",
  "goldGen30": "avg_goldGen30",
  "xpGen10": "avg_xpGen10",
  "xpGen20": "avg_xpGen20",
  "xpGen30": "avg_xpGen30",
  "csGen10": "avg_csGen10",
  "csGen20": "avg_csGen20",
  "csGen30": "avg_csGen30",
  "physicalDamageDealtToChampions": "avg_physicalDamageDealtToChampions",
  "magicDamageDealtToChampions": "avg_magicDamageDealtToChampions",
  "trueDamageDealtToChampions": "avg_trueDamageDealtToChampions",
  "physicalDamageTaken": "avg_physicalDamageTaken",
  "magicalDamageTaken": "avg_magicalDamageTaken",
  "trueDamageTaken": "avg_trueDamageTaken",
  "totalDamageTaken": "avg_totalDamageTaken",
  "damageDealtToObjectives": "avg_damageDealtToObjectives",
  "damageSelfMitigated": "avg_damageSelfMitigated",
  "totalHeal": "avg_totalHeal",
  "visionScore": "avg_visionScore",
  "wardsPlaced15": "avg_wardsPlaced15",
  "wardsKilled15": "avg_wardsKilled15",
  "wardsPlaced": "avg_wardsPlaced",
  "wardsKilled": "avg_wardsKilled",
  "visionWardsBoughtInGame": "avg_visionWardsBoughtInGame",
  "firstBloodKill": "avg_firstBloodKill",
  "firstBloodAssist": "avg_firstBloodAssist",
  "firstTowerKill": "avg_firstTowerKill",
  "firstTowerAssist": "avg_firstTowerAssist",
  "turretKills": "avg_turretKills",
  "doubleKills": "avg_doubleKills",
  "tripleKills": "avg_tripleKills",
  "quadraKills": "avg_quadraKills",
  "pentaKills": "avg_pentaKills",
  "csDiff10": "avg_csDiff10",
  "csDiff20": "avg_csDiff20",
  "csDiff30": "avg_csDiff30",
  "totalGames": "total_games"
}

class Leaderboards (commands.Cog):
  def __init__ ( self, bot ):
    self.bot = bot

  def camel_case_split(self, identifier):
    m = ""
    for l in identifier:
      if l.isupper():
        m += " "
      if len(m) == 0:
        l = l.upper()
      m += l
    return m

  def generateLeaderboardEmbed(self, players, title, subtitle, key):
    embed = discord.Embed(title=title, description=subtitle, color=discord.Color.dark_blue())
    i = 0
    emojiMap = {
      0 : ":first_place:",
      1: ":second_place:",
      2: ":third_place:",
    }
    for p in players:
      emoji = ""
      a = p["_id"]["player"][0]
      if(i < 3):
          emoji = emojiMap[i]
      embed.add_field(name=f"{emoji} {a}", value=f"\u200B")
      embed.add_field(name="\u200B", value="\u200B")
      embed.add_field(name=f"{p[key]}", value="\u200B")
      i += 1
    return embed

  @commands.command ()
  async def lb(self, ctx, *args):
    
    await self.leaderboard(ctx, *args)

  @commands.command ()
  async def leaderboard(self, ctx, *args):
    if not args[0] in lb_keys:
      await ctx.send("Invalid Category")
      return
    all_avg = requests.get(os.environ["BACKEND_URL"] + "/stats/avg/byplayer").json()
    print(all_avg[0][lb_keys[args[0]]])
    all_avg.sort(key=lambda e: e[lb_keys[args[0]]], reverse=True)
    print('a')
    top_avg = all_avg[:5]
    # t = args[0]
    t = self.camel_case_split(args[0])
    await ctx.send(embed=self.generateLeaderboardEmbed(top_avg, f"Top 5 Players for {t}", f"Out of {len(all_avg)} players", lb_keys[args[0]]))
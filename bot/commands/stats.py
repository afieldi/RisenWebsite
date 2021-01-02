from discord.ext import commands
import discord
import requests
import os

ddIcon = "http://ddragon.leagueoflegends.com/cdn/10.25.1/img/profileicon/"

class Stats (commands.Cog):
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

  def generateStatsEmbed(self, player):
    name = player["_id"]["player"][0]
    embed = discord.Embed(title=f"{name}'s Risen Stats", description=f"\u200B", color=discord.Color.dark_orange())

    r = requests.get(f"https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/{name}", headers={
      "X-Riot-Token": os.environ["RIOT_KEY"]
    })
    if r.status_code == 200:
      icon = r.json()["profileIconId"]
      i_url = ddIcon + str(icon) + ".png"
      embed.set_thumbnail(url=i_url)
      embed.set_author(name=name, icon_url=i_url)
    embed.add_field(name="Games Played", value=f"{player['total_games']}")
    embed.add_field(name="Win Rate", value=f"{round(player['wr'], 2) * 100}%", inline=True)
    embed.add_field(name="\u200B", value="\u200B")

    embed.add_field(name="Damage Per Gold", value=f"{round(player['avg_totalDamageDealtToChampions'] / player['avg_goldEarned'], 2)}", inline=True)
    embed.add_field(name="Damage Per Minute", value=f"{round(player['avg_dpm'], 2)}", inline=True )
    embed.add_field(name="CS per min", value=f"{round(player['avg_cspm'], 2)}", inline=True)

    embed.add_field(name="Kills Per Game", value=f"{round(player['avg_kills'], 2)}", inline=True)
    embed.add_field(name="Deaths Per Game", value=f"{round(player['avg_deaths'], 2)}", inline=True)
    embed.add_field(name="Assists Per Game", value=f"{round(player['avg_assists'], 2)}", inline=True)

    embed.add_field(name="Solo Kills Per Game", value=f"{round(player['avg_soloKills'], 2)}", inline=True)
    embed.add_field(name="Solo Deaths Per Game", value=f"{round(player['avg_soloDeaths'], 2)}", inline=True)
    embed.add_field(name="Gank Deaths Per Game", value=f"{round(player['avg_gankDeaths'], 2)}", inline=True)

    embed.add_field(name="Objective Damage Per Game", value=f"{round(player['avg_damageDealtToObjectives'], 2)}", inline=True)
    embed.add_field(name="Turrets Killed", value=f"{round(player['avg_turretKills'], 2)}" , inline=True)
    embed.add_field(name="Average Vision Score", value=f"{round((player['avg_visionScore']), 2)}", inline=True)

    # embed.add_field(name="\u200B", value="\u200B")

    embed.add_field(name="\u200B", value="\u200B", inline=False)
    # embed.add_field(name="\u200B", value="\u200B")
    # embed.add_field(name="\u200B", value="\u200B")

    embed.add_field(name="XP Diff at 10", value=f"{round(player['avg_xpDiff10'], 2)}", inline=True)
    embed.add_field(name="Gold Diff at 10", value=f"{round(player['avg_goldDiff10'], 2)}", inline=True)
    embed.add_field(name="CS Diff at 10", value=f"{round(player['avg_csDiff10'], 2)}", inline=True)

    # embed.add_field(name="\u200B", value="\u200B")

    embed.add_field(name="XP Diff at 20", value=f"{round(player['avg_xpDiff20'], 2)}", inline=True)
    embed.add_field(name="Gold Diff at 20", value=f"{round(player['avg_goldDiff20'], 2)}", inline=True)
    embed.add_field(name="CS Diff at 20", value=f"{round(player['avg_csDiff20'], 2)}", inline=True)

    embed.add_field(name="XP Diff at 30", value=f"{round(player['avg_xpDiff30'], 2)}", inline=True)
    embed.add_field(name="Gold Diff at 30", value=f"{round(player['avg_goldDiff30'], 2)}", inline=True)
    embed.add_field(name="CS Diff at 30", value=f"{round(player['avg_csDiff30'], 2)}", inline=True)
    return embed

  @commands.command ()
  async def stats(self, ctx, *args):
    name = " ".join(args)
    r = requests.get(os.environ["BACKEND_URL"] + f"/stats/player/name/{name}/agg")
    user = None
    if r.status_code == 404:
      await ctx.send("Could not find user")
      return
    elif r.status_code == 200:
      user = r.json()[0]
    else:
      await ctx.send("Something went wrong")
      return

    await ctx.send(embed=self.generateStatsEmbed(user))
from discord.ext import commands
import discord
import requests
import os

ddIcon = "http://ddragon.leagueoflegends.com/cdn/10.25.1/img/profileicon/"

class Avg (commands.Cog):
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

  def generateStatsEmbed(self, data, role):
    embed = discord.Embed(title=f"Average Risen Stats for {role}", description=f"\u200B", color=discord.Color.dark_orange())

    embed.add_field(name="Games Played", value=f"{data['total_games']}")
    # embed.add_field(name="Win Rate", value=f"{round(data['wr'], 2) * 100}%", inline=True)
    embed.add_field(name="\u200B", value="\u200B")
    embed.add_field(name="\u200B", value="\u200B")

    embed.add_field(name="Damage Per Gold", value=f"{round(data['avg_totalDamageDealtToChampions'] / data['avg_goldEarned'], 2)}", inline=True)
    embed.add_field(name="Damage Per Minute", value=f"{round(data['avg_totalDamageDealtToChampions'] / (data['avg_gameDuration']/60), 2)}", inline=True )
    embed.add_field(name="CS per min", value=f"{round((data['avg_totalMinionsKilled'] + data['avg_neutralMinionsKilled']) / (data['avg_gameDuration']/60), 2)}", inline=True)

    embed.add_field(name="Kills Per Game", value=f"{round(data['avg_kills'], 2)}", inline=True)
    embed.add_field(name="Deaths Per Game", value=f"{round(data['avg_deaths'], 2)}", inline=True)
    embed.add_field(name="Assists Per Game", value=f"{round(data['avg_assists'], 2)}", inline=True)

    embed.add_field(name="Solo Kills Per Game", value=f"{round(data['avg_soloKills'], 2)}", inline=True)
    embed.add_field(name="Solo Deaths Per Game", value=f"{round(data['avg_soloDeaths'], 2)}", inline=True)
    embed.add_field(name="Gank Deaths Per Game", value=f"{round(data['avg_gankDeaths'], 2)}", inline=True)

    embed.add_field(name="Objective Damage Per Game", value=f"{round(data['avg_damageDealtToObjectives'], 2)}", inline=True)
    embed.add_field(name="Turrets Killed", value=f"{round(data['avg_turretKills'], 2)}" , inline=True)
    embed.add_field(name="Average Vision Score", value=f"{round((data['avg_visionScore']), 2)}", inline=True)

    return embed

  @commands.command ()
  async def avg(self, ctx, *args):
    role = "".join(args)
    url = os.environ["BACKEND_URL"] + "/stats/avg"
    lane = "All Lanes"
    if role.lower() in ["middle", "mid"]:
      url += "/role/MIDDLE"
      lane = "Mid Lane"
    elif role.lower() in ["top"]:
      url += "/role/TOP"
      lane = "Top Lane"
    elif role.lower() in ["jng", "jungle"]:
      url += "/role/JUNGLE"
      lane = "Jungle"
    elif role.lower() in ["bot", "bottom", "adc"]:
      url += "/role/BOTTOM"
      lane = "Bot Lane"
    elif role.lower() in ["sup", "support", "utility"]:
      url += "/role/SUPPORT"
      lane = "Support"

    r = requests.get(url)
    data = None
    if r.status_code == 404:
      await ctx.send("Could not find user")
      return
    elif r.status_code == 200:
      data = r.json()[0]
    else:
      await ctx.send("Something went wrong")
      return
    await ctx.send(embed=self.generateStatsEmbed(data, lane))
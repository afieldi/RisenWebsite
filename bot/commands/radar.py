from discord.ext import commands
import discord
import plotly.graph_objects as go
import requests
import os
import io
from IPython.display import Image

class Radar (commands.Cog):
  def __init__ ( self, bot ):
    self.bot = bot

  @commands.command ()
  async def radar(self, ctx, *args):
    name = " ".join(args)
    avg = requests.get(os.environ["BACKEND_URL"] + "/stats/avg").json()[0]
    r = requests.get(os.environ["BACKEND_URL"] + f"/stats/player/name/{name}/agg")
    if r.status_code == 404:
      await ctx.send("Could not find user")
      return
    elif r.status_code == 200:
      user = r.json()[0]
    else:
      await ctx.send("Something went wrong")
      return
    categories = ['KDA', 'CS/min', 'DPM', 'VS/min', 'Gold/min', 'WP/min']

    fig = go.Figure()
    avg_data = [
      (avg["avg_kills"] + avg["avg_assists"]) / avg["avg_deaths"],
      (avg["avg_neutralMinionsKilled"] + avg["avg_totalDamageDealtToChampions"]) / (avg["avg_gameDuration"]/60),
      (avg["avg_totalDamageDealtToChampions"]) / (avg["avg_gameDuration"]/60),
      (avg["avg_visionScore"]) / (avg["avg_gameDuration"]/60),
      (avg["avg_goldEarned"]) / (avg["avg_gameDuration"]/60),
      (avg["avg_wardsPlaced"]) / (avg["avg_gameDuration"]/60),
    ]
    user_data = [
      (user["avg_kills"] + user["avg_assists"]) / user["avg_deaths"],
      (user["avg_neutralMinionsKilled"] + user["avg_totalDamageDealtToChampions"]) / (user["avg_gameDuration"]/60),
      (user["avg_totalDamageDealtToChampions"]) / (user["avg_gameDuration"]/60),
      (user["avg_visionScore"]) / (user["avg_gameDuration"]/60),
      (user["avg_goldEarned"]) / (user["avg_gameDuration"]/60),
      (user["avg_wardsPlaced"]) / (user["avg_gameDuration"]/60),
    ]

    for i in range(len(avg_data)):
      d = avg_data[i] if avg_data[i] > user_data[i] else user_data[i]
      avg_data[i] /= d
      user_data[i] /= d

    fig.add_trace(go.Scatterpolar(
          r=avg_data,
          theta=categories,
          fill='toself',
          name='Risen Average'
    ))
    fig.add_trace(go.Scatterpolar(
          r=user_data,
          theta=categories,
          fill='toself',
          name=name
    ))

    fig.update_layout(
      polar=dict(
        radialaxis=dict(
          visible=False,
          range=[0, 1.1]
        )),
      showlegend=True,
      paper_bgcolor='rgba(0,0,0,0)',
      plot_bgcolor='rgba(0,0,0,0)',
      font_color= 'white',
      font_size=24
    )

    img = fig.to_image(format="png", )
    print(fig.to_image.__code__.co_varnames)
    print(type(img))
    f = discord.File(io.BytesIO(img), filename="chart.png")
    await ctx.send(file=f)
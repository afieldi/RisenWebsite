import discord
import sys
import os
import argparse
from discord.ext import commands
from pathlib import Path

import http

bot = None
class DiscordClient ( commands.Bot ):
  async def on_message ( self, message ):
    await self.process_commands ( message )

def main ( ):
    bot = DiscordClient (
        command_prefix='%'
    )
    # Register commands
    from commands.charts import Charts
    from commands.leaderboard import Leaderboards
    from commands.stats import Stats

    bot.add_cog ( Charts ( bot ) )
    bot.add_cog ( Leaderboards ( bot ) )
    bot.add_cog ( Stats ( bot ) )

    parser = argparse.ArgumentParser ( description="Discord bot" )
    parser.add_argument ( "-p", "--prod", default=False, action='store_true' )
    args = parser.parse_args ( )

    if not args.prod:
      from dotenv import load_dotenv
      env_path = Path('.', '.env.development')
      load_dotenv(dotenv_path=env_path)
      
    # bot_token = bot_token_prod if args.prod else bot_token_test
    print("here")
    bot.run ( os.environ["BOT_TOKEN"] )
    if args.prod:
      # Just so we can run on heroku's web
      server = http.server.HTTPServer(('', os.environ["PORT"]), http.server.BaseHTTPRequestHandler)
      server.serve_forever()

if __name__ == "__main__":
    sys.exit ( main ( ) )
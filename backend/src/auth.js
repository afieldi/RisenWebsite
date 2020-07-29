const fetch = require('node-fetch');
const process = require('process');

function getAdminGuildRoles(callback) {
  fetch(`https://discord.com/api/guilds/${process.env.DISCORD_SERVER_ID}/roles`, {
    method: "GET",
    headers: {
      "Authorization": `Bot ${process.env.DISCORD_TOKEN}`
    }
  }).then(data => {
    data.json().then(roles => {
      let approvedRoles = ["Admin"];
      let approvedIds = [];
      for (let role of roles) {
        if (approvedRoles.includes(role.name)) {
          approvedIds.push(role.id);
        }
      }
      callback(approvedIds);
    })
  });
}

function getGuildUser(userId, callback) {
  fetch(`https://discord.com/api/guilds/${process.env.DISCORD_SERVER_ID}/members/${userId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bot ${process.env.DISCORD_TOKEN}`
    }
  }).then(data => {
    data.json().then(user => {
      callback(user);
    });
  });
}

function exchangeCode(code, callback) {
  const data = {
    'client_id': process.env.DISCORD_CLIENT_ID,
    'client_secret': process.env.DISCORD_CLIENT_SECRET,
    'grant_type': 'authorization_code',
    'code': code,
    'redirect_uri': 'http://99.246.224.136:5000/auth/callback',   // TODO: Use Host instead once this migrates to an actual server
    'scope': 'identify'
  };
  

  const formBody = Object.keys(data).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');
  fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: formBody
  }).then(data => {
    data.json().then(res => {
      if(res.error) {
        throw new Error();
      }
      callback(res.access_token);
    });
  }).catch(err => {
    console.log(err);
    throw new Error();
  });
}

function getSelf(token, callback) {
  fetch('https://discord.com/api/users/@me', {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    }
  }).then(data => {
    data.json().then(user => {
      callback(user);
    });
  });
}

function getAdmin(code, onSuccess, onReject) {
  console.log("got code: " + code);
  // AHHHHHHHHH
  // AHHHHHHHHH
  // AHHHHHHHHH
  // AHHHH CALLBACKS
  try {
    exchangeCode(code, (token) => {
      getSelf(token, (user) => {
        getGuildUser(user.id, (guildUser) => {
          getAdminGuildRoles((adminRoles) => {
            for (let role of guildUser.roles) {
              if (adminRoles.includes(role)) {
                onSuccess(user);
                return;
              }
            }
            console.log("not admin")
            onReject();
          });
        });
      });
    });
  } catch (error) {
    console.log(error);
    onReject();
  }
}

module.exports = {
  getAdmin: getAdmin
}
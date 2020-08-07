const fetch = require('node-fetch');
const process = require('process');

function getGuildRoles(roleMap, callback) {
  fetch(`https://discord.com/api/guilds/${process.env.DISCORD_SERVER_ID}/roles`, {
    method: "GET",
    headers: {
      "Authorization": `Bot ${process.env.DISCORD_TOKEN}`
    }
  }).then(data => {
    data.json().then(roles => {
      let approvedIds = {};
      for (let role of roles) {
        for (let i in roleMap) {
          if (roleMap[i].includes(role.name)) {
            if (!approvedIds[i]) {
              approvedIds[i] = []
            }
            approvedIds[i].push(role.id);
          }
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

function exchangeCode(req, code, callback) {
  let redirect = req.headers.host + "/auth/callback";
  if(req.connection.encrypted) {
    redirect = "https://" + redirect;
  }
  else {
    redirect = "http://" + redirect;
  }

  const data = {
    'client_id': process.env.DISCORD_CLIENT_ID,
    'client_secret': process.env.DISCORD_CLIENT_SECRET,
    'grant_type': 'authorization_code',
    'code': code,
    'redirect_uri': redirect,   // TODO: Use Host instead once this migrates to an actual server
    'scope': 'identify'
  };
  

  const formBody = Object.keys(data).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');
  console.log(data);
  console.log(formBody);
  console.log("making fetch request");
  fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: formBody
  }).then(data => {
    console.log("got data from fetch request");
    data.json().then(res => {
      if(res.error) {
        console.log("Error: " + res.error);
        return;
      }
      callback(res.access_token);
    }, res => {
      console.error(res);
      throw new Error();
    });
  }).catch(err => {
    console.log(err);
    throw new Error(err);
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

function getUser(request, code, onSuccess, onReject) {
  console.log("got code: " + code);
  // AHHHHHHHHH
  // AHHHHHHHHH
  // AHHHHHHHHH
  // AHHHH CALLBACKS
  let roleMap = {
    1: ["Admin", "admin"],
    2: ["Verified"]
  }
  try {
    exchangeCode(request, code, (token) => {
      getSelf(token, (user) => {
        getGuildUser(user.id, (guildUser) => {
          getGuildRoles(roleMap, (definedRoles) => {
            for (let defRoleIndex in definedRoles) {
              for (let role of guildUser.roles) {
                if (definedRoles[defRoleIndex].includes(role)) {
                  onSuccess(user, defRoleIndex);
                  return;
                }
              }
            }
            onSuccess(user, 0); // Just a regular user
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
  getUser: getUser
}
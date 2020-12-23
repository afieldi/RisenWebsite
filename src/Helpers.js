export function customRound(doubleN, precision = 2) {
    return Math.round(doubleN * Math.pow(10, precision)) / Math.pow(10, precision);
}

export function matchDict(dict1, dict2) {
    for (const key of Object.keys(dict1)) {
        if (dict1[key] != dict2[key]) {
            return false;
        }
    }
    return true;
}

export function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

export function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

export function deleteCookie( name ) {
    document.cookie = name+'=; Max-Age=-99999999;'; 
  }

// Get color code by strength level, 5 is highest, 1 is lowest
export function getTextColorByLevel(level) {
    const map = [
        "#ff2121",
        "#ff9e1d",
        "#ffffff",
        "#05aaff",
        "#3eff05"
    ]
}
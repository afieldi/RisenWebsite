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

export function getBaseUrl() {
    // return "http://99.246.224.136:5000";
    return "https://api-dot-risenwebsite.ue.r.appspot.com"
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

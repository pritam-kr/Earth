  // Function to set a cookie
  function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days *  60 * 1000);
    console.log(expires)
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  }

  // Function to get a cookie by name
  function getCookie(name) {
    const cookieArr = document.cookie.split(";");
    for (let i = 0; i < cookieArr.length; i++) {
      const cookiePair = cookieArr[i].split("=");
      const cookieName = cookiePair[0].trim();
      if (cookieName === name) {
        return decodeURIComponent(cookiePair[1]);
      }
    }
    return null;
  }

  export function checkFirstVisit() {
    const visitedCookie = getCookie("visited");
    if (!visitedCookie) {
      setCookie("visited", "true", 1); 
      // Set the "visited" cookie to expire in 30 days
      return true;
    
    } else {
      return false;
    }
  }
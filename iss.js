const request = require("request");

const fetchMyIP = function(callback) {
  let myIP = "https://api.ipify.org?format=json";
  request(myIP, (error,response, body)=> {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const ip = JSON.parse(body).ip;
    callback(null, ip);  
  });
};

const fetchCoordsByIP = function(ip, callback) {
  let geoCode = `https://freegeoip.app/json`
   request(geoCode, (error,response, body) => {
    if (error) {
      callback(error, null)
      return;
    } 
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }  
    const geoCode = {latitude: JSON.parse(body).latitude,longitude: JSON.parse(body).longitude}
    callback(null, geoCode)
  })
}

const fetchISSFlyOverTimes = function(coords, callback) {
  
  let coordinates = `http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`
   request(coordinates, (error, response, body) => {
  if (error) {
    callback(error, null)
    return;
  } 
  if (response.statusCode !== 200) {
    const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
    callback(Error(msg), null);
    return;
  } 
  const FlyOverTime = JSON.parse(body).response
  callback(null, FlyOverTime)
})
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};



module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation}

              

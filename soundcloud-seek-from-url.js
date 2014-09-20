(function () {
  seekIfNeeded();
  displayTimeURL();

  // Checks the URL for the presence of a time "t=1h32m6s" query. If it exists attempts
  // to seek to the given time in the media.
  function seekIfNeeded () {
    var q = window.location.search;

    if (q.indexOf('t=') > -1) {
      var timeString = q.split('=')[1],
        media = SC.Widget(document.getElementById('media'));

      media.bind(SC.Widget.Events.READY, function () {

        media.bind(SC.Widget.Events.PLAY, function () {
          // Multiple by 1000 because the Soundcloud player expects milliseconds,
          // unlike the HTML media element which expects seconds.
          media.seekTo(secondsFromTimeParts(partsFromTimeString(timeString)) * 1000);
        });

        media.play();
      });
    }
  }

  // Converts a string in the format "1h32m6s" to an object of key:values. Where
  // the keys represent a part of the time: one of "h", "m", "s". And the values
  // represent the amount of time for each part.
  function partsFromTimeString (str) {
    var parts = {h: 0, m: 0, s: 0};

    // Breaks the string into an array like ["1h", "32m", "6s"]
    //
    // NOTE: Wrapping in a try to avoid an error in case someone gives the 't='
    // query string with no time. It'll just default to zero without it.
    try {
      str.match(/[0-9]+[hms]+/g).forEach(function (val) {

        // Creates an array with two elements, the time and part key like ["32", "m"]
        var part = val.match(/[hms]+|[0-9]+/g);
        parts[part[1]] = parseInt(part[0], 10);
      });
    }
    catch (e) {}

    return parts;
  }

  // Converts an object of parts–{h:1,m:32,s:6}–to a string in "1h32m6s" format.
  function timeStringFromParts (parts) {
    var str = '';

    for (key in parts) {
      if (parts[key] > 0) {
        str += parts[key] + key;
      }
    }

    return str;
  }

  // Converts a float–5526.2345–of total seconds to an object of parts: {h:1,m:32,s:6}
  //
  // NOTE: Ignores the floating part which would be milliseconds.
  function timePartsFromSeconds (seconds) {
    var parts = {},
      secondsInt = Math.floor(seconds);

    parts.h = Math.floor((secondsInt / 3600) % 24);
    parts.m = Math.floor(secondsInt / 60);
    parts.s = secondsInt % 60;

    return parts;
  }

  // Converts an object of parts–{h:1,m:32,s:6}–to an int of total seconds; 5526
  function secondsFromTimeParts (parts) {
    var seconds = 0;

    seconds += parts.s;
    seconds += parts.m * 60;
    seconds += parts.h * 3600;

    return seconds;
  }

  // This isn't needed if you don't need to display the time string URL somewhere
  // on the page.
  function displayTimeURL () {
    var loc = window.location,
      timeDisplay = document.querySelector('.current-url'),
      media = SC.Widget(document.getElementById('media'));
      coolTime = '';

    media.bind(SC.Widget.Events.PLAY_PROGRESS, function (props) {
      // currentPosition is in milliseconds, we want to work with seconds, so divide.
      var newCoolTime = timeStringFromParts(timePartsFromSeconds(props.currentPosition / 1000));

      // Because this event is triggered multiple times per second and we only want
      // second-precision, doing this check cuts down on how often we're updating
      // the DOM. It's likely trivial, but hey, it's good practice.
      if (coolTime != newCoolTime) {
        coolTime = newCoolTime;
        var url = loc.origin + loc.pathname + '?t=' + coolTime;

        // If you're manually changing the time or just copying, don't cause
        // focus to be lost, that's wicked annoying.
        if (timeDisplay != document.activeElement) {
          timeDisplay.setAttribute('value', url);
        }
      }
    });
  }
}());

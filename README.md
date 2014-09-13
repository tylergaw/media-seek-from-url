# Media Seek from URL

Seek to a specified time in an HTML media element–`audio`, `video`-using a URL
query parameter. `http://example.com?t=1h32m24s`

Also a modified version of the script for embedded Soundcloud players that makes
use of the Soundcloud [Widget API](https://developers.soundcloud.com/docs/api/html5-widget)

## Demos
- [HTML](http://lab.tylergaw.com/media-seek-from-url)
- [Soundcloud](http://lab.tylergaw.com/media-seek-from-url/soundcloud.html)

#### What did I learn?
- I didn’t know about `document.activeElement`. Used it to check if the URL input
has focus https://developer.mozilla.org/en-US/docs/Web/API/document.activeElement

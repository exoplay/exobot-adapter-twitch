# exobot-adapter-twitch

## Installation

* `npm install --save @exoplay/exobot/exobot-adapter-twitch`

## A Setup Example

```javascript
import Exobot from '@exoplay/exobot';
import Twitch from '@exoplay/exobot-adapter-twitch';

const Bot = new Exobot(BOT_NAME, {
  // ...,
  adapters: [
    new Twitch({
      username: process.env.TWITCH_USERNAME,

      // should look like 'oauth:randomstring'
      oauthPassword: process.env.TWITCH_PASSWORD,

      // make sure to prefix with #
      channels: ['#exobot'].join(',')
    })
  ],
});
```

## Setup Notes

* Set up a bot by creating an account, logging in, then visiting
  http://twitchapps.com/tmi/ to set up an oauth password. This oauth password
  is what you will use to connect, NOT the actual password.

## License

LGPL licensed. Copyright 2016 Exoplay, LLC. See LICENSE file for more details.

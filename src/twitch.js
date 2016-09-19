import TMI from 'tmi.js';

import { Adapter } from '@exoplay/exobot';

export const EVENTS = {
  connecting: 'twitchConnecting',
  connected: 'twitchConnected',
  logon: 'twitchLogon',
  disconnected: 'twitchDisconnected',
  reconnect: 'twitchReconnect',
  chat: 'twitchChat',
  emoteonly: 'twitchEmoteonly',
  join: 'twitchJoin',
  part: 'twitchPart',
  mods: 'twitchMods',
  notice: 'twitchNotice',
  ping: 'twitchPing',
  pong: 'twitchPong',
  roomstate: 'twitchRoomstate',
  slowmode: 'twitchSlowmode',
  subscribers: 'twitchSubscribers',
  subscription: 'twitchSubscription',
  timeout: 'twitchTimeout',
  whisper: 'twitchWhisper',
};

export class TwitchAdapter extends Adapter {
  name = 'Twitch';

  constructor ({ username, oauthPassword, channels=[], adapterName }) {
    super(...arguments);

    this.username = username;
    this.oauthPassword = oauthPassword;
    this.channels = channels;
    this.name = adapterName || this.name;
  }

  register (bot) {
    super.register(...arguments);

    const { username, oauthPassword, channels } = this;

    if (!username || !oauthPassword) {
      bot.log.error('username and oauthPassword are required to connect to Twitch.');
      return;
    }

    if (!channels.length) {
      bot.log.critical('No channels passed to Twitch adapter to connect to.');
    }

    this.client = new TMI.client({
      channels,
      identity: {
        username,
        password: oauthPassword,
      },
      options: {
        debug: true,
      },
      secure: true,
      reconnect: true,
      logger: {
        info: bot.log.info.bind(bot.log),
        warn: bot.log.warning.bind(bot.log),
        error: bot.log.error.bind(bot.log),
      },
      connection: {
        cluster: 'aws',
      },
    });

    
    this.client.connect();

    Object.keys(EVENTS).forEach(twitchEvent => {
      const mappedFn = this[EVENTS[twitchEvent]];
      this.client.on(twitchEvent, (...args) => mappedFn.bind(this)(...args));
      this.client.on(twitchEvent, (...args) => {
        this.bot.emitter.emit(`twitch-${twitchEvent}`, ...args);
      });
    });
  }

  send (message) {
    this.bot.log.debug(`Sending ${message.text} to ${message.channel}`);

    if (message.whisper) {
      return this.client.whisper(message.user.name, message.text);
    }

    this.client.say(message.channel, message.text);
  }

  twitchConnecting = () => {
    this.status = Adapter.STATUS.CONNECTING;
  }

  twitchConnected = () => {
    this.status = Adapter.STATUS.CONNECTED;
    this.bot.emitter.emit('connected', this.id);
    this.bot.log.notice(`Connected to Twitch as ${this.username}`);
  }

  twitchLogon = () => {
    this.status = Adapter.STATUS.CONNECTED;
    this.bot.log.notice(`Successfully logged on to Twitch as ${this.username}`);
  }

  twitchDisconnected = () => {
    this.status = Adapter.STATUS.DISCONNECTED;
    this.bot.log.warning('Disconnected from Twitch.');
  }

  twitchReconnect = () => {
    this.status = Adapter.STATUS.RECONNECTING;
    this.bot.log.notice('Reconnecting to Twitch.');
  }

  async twitchChat (channel, twitchUser, text ,self) {
    if (self) { return; }

    console.log(text);
    try {
      const user = await this.getUser(twitchUser.username, twitchUser.username, twitchUser);
      this.receive({ user, text, channel });
    } catch (err) {
      console.log(err);
    }

  }

  twitchEmoteonly = () => {
  }

  async twitchJoin (channel, username) {
    if (username !== this.username) { return; }

    try {
      const user = await this.getUser(username, username);
      return this.enter({ user, channel });
    } catch (err) {
      console.log(err);
    }
  }

  async twitchPart (channel, username) {
    if (username !== this.username) { return; }

    try {
      const user = await this.getUser(username, username);
      return this.leave({ user, channel });
    } catch (err) {
      console.log(err);
    }
  }

  twitchPing = () => {
    this.ping();
  }

  async twitchWhisper (username, twitchUser, text, self) {
    if (self) { return; }

    try {
      const user = await this.getUser(twitchUser.username, twitchUser.username, twitchUser);
      this.receiveWhisper({ user, text, channel: twitchUser.username });
    } catch (err) {
      console.log(err);
    }

  }

  twitchPong = () => { }

  twitchRoomstate = () => { }

  twitchSlowmode = () => { }

  twitchSubscribers = () => { }

  twitchSubscription = () => { }

  twitchTimeout = () => { }

  twitchMods = () => { }

  twitchNotice = () => { }

  async getUserIdByUserName (name) {
    let botuser;
    try {
      botuser = await this.getUser(name, name);
    } catch (err) {
      console.log(err);
    }

    return botuser.id;
  }

  getRolesForUser (adapterUserId) {
    if (this.adapterUsers[adapterUserId]) {
      return this.adapterUsers[adapterUserId].roles.map((role) => {
        if (this.roleMapping[role]) {
          return this.roleMapping[role];
        }});
    }

    return [];
  }

  getRoles(userId, user, roles) {
    let rolesUpdated = false;
    if (user.subscriber === true) {
      roles.push('subscriber');
      rolesUpdated = true;
    }

    if (user.mod === true) {
      roles.push('mod');
      rolesUpdated = true;
    }

    if (user.turbo === true) {
      roles.push('turbo');
      rolesUpdated = true;
    }

    return rolesUpdated;
  }

}

import TMI from 'tmi.js';

import { Adapter, AdapterOperationTypes as AT} from '@exoplay/exobot';

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

export default class TwitchAdapter extends Adapter {
  static type = 'twitch';

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

    this.configureAdapterOperations();
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

    try {
      const user = await this.getUser(twitchUser.username, twitchUser.username, twitchUser);
      this.receive({ user, text, channel });
    } catch (err) {
      this.bot.log.warn(err);
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
      this.bot.log.warn(err);
    }
  }

  async twitchPart (channel, username) {
    if (username !== this.username) { return; }

    try {
      const user = await this.getUser(username, username);
      return this.leave({ user, channel });
    } catch (err) {
      this.bot.log.warn(err);
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
      this.bot.log.warn(err);
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
    let botUser;
    try {
      botUser = await this.getUser(name, name);
    } catch (err) {
      this.bot.log.warn(err);
    }

    return botUser.id;
  }

  getRolesForUser (adapterUserId) {
    if (this.roleMapping && this.adapterUsers && this.adapterUsers[adapterUserId]) {
      return this.adapterUsers[adapterUserId].roles
      .filter(role => this.roleMapping[role])
      .map(role => this.roleMapping[role]);
    }

    return [];
  }

  getRoles(userId, user) {
    const roles = [];
    if (user) {
      if (user.subscriber === true) {
        roles.push('subscriber');
      }

      if (user.mod === true) {
        roles.push('mod');
      }

      if (user.turbo === true) {
        roles.push('turbo');
      }
      return roles;
    }

    return false;
  }

  configureAdapterOperations() {
    this.bot.emitter.on(AT.DISCIPLINE_USER_WARNING, this.whisperUser, this);
    this.bot.emitter.on(AT.DISCIPLINE_USER_TEMPORARY, this.timeoutUser, this);
    this.bot.emitter.on(AT.DISCIPLINE_USER_PERMANENT, this.banUser, this);
    this.bot.emitter.on(AT.WHISPER_USER, this.whisperUser, this);
  }

  whisperUser(adapterName, options) {
    if (!adapterName || adapterName === this.name) {
      const adapterUserId = this.getAdapterUserIdById(options.userId);
      if (adapterUserId) {
        this.client.whisper(adapterUserId, options.messageText)
          .catch(reason => {this.bot.log.warning(reason);});
      }
    }
  }

  timeoutUser(adapterName, options) {
    if (!adapterName || adapterName === this.name) {
      const adapterUserId = this.getAdapterUserIdById(options.userId);
      if (adapterUserId) {
        this.client.getChannels().forEach(channel => {
          this.client.timeout(channel,adapterUserId, options.duration || 1, options.messageText)
            .catch(reason => {this.bot.log.warning(reason);});
        });
      }
    }
  }

  banUser(adapterName, options) {
    if (!adapterName || adapterName === this.name) {
      const adapterUserId = this.getAdapterUserIdById(options.userId);
      if (adapterUserId) {
        this.client.getChannels().forEach(channel => {
          this.client.ban(channel,adapterUserId, options.duration || 1, options.messageText)
            .catch(reason => {this.bot.log.warning(reason);});
        });
      }
    }
  }

}

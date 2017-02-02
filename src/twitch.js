import TMI from 'tmi.js';

import { Adapter, AdapterOperationTypes as AT, PropTypes as T } from '@exoplay/exobot';

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

const splitLine = (input, length) => {
  const output = [];
  while (input.length > length) {
    const lastSpace = input.substring(0, length).lastIndexOf(' ');
    output.push(input.substring(0, lastSpace));
    input = input.substring(lastSpace + 1);
  }
  output.push(input);
  return output;
};

export default class TwitchAdapter extends Adapter {
  static type = 'twitch';
  static propTypes = {
    username: T.string.isRequired,
    oauthPassword: T.string.isRequired,
    channels: T.array.isRequired,
  };

  constructor() {
    super(...arguments);

    const { username, oauthPassword, channels } = this.options;

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
        info: this.bot.log.info.bind(this.bot.log),
        warn: this.bot.log.warning.bind(this.bot.log),
        error: this.bot.log.error.bind(this.bot.log),
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

  send(message) {
    this.bot.log.debug(`Sending ${message.text} to ${message.channel}`);

    if (message.whisper) {
      if (message.text.length > 450) {
        const messages = splitLine(message.text, 450);
        let timeout = 350;
        messages.forEach(msg => {
          setTimeout(() => {
            this.client.whisper(message.user.name, msg);
          }, timeout);
          timeout = timeout + 350;

        });
      }

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

  async twitchChat(channel, twitchUser, text ,self) {
    if (self) { return; }

    try {
      const user = await this.getUser(twitchUser.username, twitchUser.username, twitchUser);
      this.receive({ user, text, channel });
    } catch (err) {
      this.bot.log.warning(err);
    }

  }

  twitchEmoteonly = () => {
  }

  async twitchJoin(channel, username) {
    if (username !== this.username) { return; }

    try {
      const user = await this.getUser(username, username);
      return this.enter({ user, channel });
    } catch (err) {
      this.bot.log.warning(err);
    }
  }

  async twitchPart(channel, username) {
    if (username !== this.username) { return; }

    try {
      const user = await this.getUser(username, username);
      return this.leave({ user, channel });
    } catch (err) {
      this.bot.log.warning(err);
    }
  }

  twitchPing = () => {
    this.ping();
  }

  async twitchWhisper(username, twitchUser, text, self) {
    if (self) { return; }

    try {
      const user = await this.getUser(twitchUser.username, twitchUser.username, twitchUser);
      this.receiveWhisper({ user, text, channel: twitchUser.username });
    } catch (err) {
      this.bot.log.warning(err);
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

  async getUserIdByUserName(name) {
    let botUser;
    try {
      botUser = await this.getUser(name, name);
    } catch (err) {
      this.bot.log.warning(err);
    }

    return botUser.id;
  }

  getRolesForUser(adapterUserId) {
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
          this.client.ban(channel,adapterUserId, options.messageText)
            .catch(reason => {this.bot.log.warning(reason);});
        });
      }
    }
  }

}

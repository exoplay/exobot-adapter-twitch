require("source-map-support").install();require("regenerator-runtime/runtime");
(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

module.exports = require("@exoplay/exobot");

/***/ },
/* 1 */
/***/ function(module, exports) {

module.exports = require("tmi.js");

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tmi_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tmi_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_tmi_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__exoplay_exobot__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__exoplay_exobot___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__exoplay_exobot__);
/* harmony export (binding) */ __webpack_require__.d(exports, "default", function() { return TwitchAdapter; });
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || !1; descriptor.configurable = !0; if ("value" in descriptor) descriptor.writable = !0; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === void 0) { var parent = Object.getPrototypeOf(object); if (parent === null) { return; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === void 0) { return; } return getter.call(receiver); } };

var _class, _temp;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg), value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: !1, writable: !0, configurable: !0 } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }





const EVENTS = {
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
  whisper: 'twitchWhisper'
};
/* harmony export (immutable) */ exports["EVENTS"] = EVENTS;


let TwitchAdapter = (_temp = _class = function (_Adapter) {
  _inherits(TwitchAdapter, _Adapter);

  function TwitchAdapter({ username, oauthPassword, channels = [], adapterName }) {
    _classCallCheck(this, TwitchAdapter);

    var _this = _possibleConstructorReturn(this, (TwitchAdapter.__proto__ || Object.getPrototypeOf(TwitchAdapter)).apply(this, arguments));

    _this.twitchConnecting = () => {
      _this.status = __WEBPACK_IMPORTED_MODULE_1__exoplay_exobot__["Adapter"].STATUS.CONNECTING;
    };

    _this.twitchConnected = () => {
      _this.status = __WEBPACK_IMPORTED_MODULE_1__exoplay_exobot__["Adapter"].STATUS.CONNECTED;
      _this.bot.emitter.emit('connected', _this.id);
      _this.bot.log.notice(`Connected to Twitch as ${ _this.username }`);
    };

    _this.twitchLogon = () => {
      _this.status = __WEBPACK_IMPORTED_MODULE_1__exoplay_exobot__["Adapter"].STATUS.CONNECTED;
      _this.bot.log.notice(`Successfully logged on to Twitch as ${ _this.username }`);
    };

    _this.twitchDisconnected = () => {
      _this.status = __WEBPACK_IMPORTED_MODULE_1__exoplay_exobot__["Adapter"].STATUS.DISCONNECTED;
      _this.bot.log.warning('Disconnected from Twitch.');
    };

    _this.twitchReconnect = () => {
      _this.status = __WEBPACK_IMPORTED_MODULE_1__exoplay_exobot__["Adapter"].STATUS.RECONNECTING;
      _this.bot.log.notice('Reconnecting to Twitch.');
    };

    _this.twitchEmoteonly = () => {};

    _this.twitchPing = () => {
      _this.ping();
    };

    _this.twitchPong = () => {};

    _this.twitchRoomstate = () => {};

    _this.twitchSlowmode = () => {};

    _this.twitchSubscribers = () => {};

    _this.twitchSubscription = () => {};

    _this.twitchTimeout = () => {};

    _this.twitchMods = () => {};

    _this.twitchNotice = () => {};

    _this.username = username;
    _this.oauthPassword = oauthPassword;
    _this.channels = channels;
    _this.name = adapterName || _this.name;
    return _this;
  }

  _createClass(TwitchAdapter, [{
    key: 'register',
    value: function register(bot) {
      _get(TwitchAdapter.prototype.__proto__ || Object.getPrototypeOf(TwitchAdapter.prototype), 'register', this).apply(this, arguments);

      const { username, oauthPassword, channels } = this;

      if (!username || !oauthPassword) {
        bot.log.error('username and oauthPassword are required to connect to Twitch.');
        return;
      }

      if (!channels.length) {
        bot.log.critical('No channels passed to Twitch adapter to connect to.');
      }

      this.client = new __WEBPACK_IMPORTED_MODULE_0_tmi_js___default.a.client({
        channels,
        identity: {
          username,
          password: oauthPassword
        },
        options: {
          debug: !0
        },
        secure: !0,
        reconnect: !0,
        logger: {
          info: bot.log.info.bind(bot.log),
          warn: bot.log.warning.bind(bot.log),
          error: bot.log.error.bind(bot.log)
        },
        connection: {
          cluster: 'aws'
        }
      });

      this.client.connect();

      Object.keys(EVENTS).forEach(twitchEvent => {
        const mappedFn = this[EVENTS[twitchEvent]];
        this.client.on(twitchEvent, (...args) => mappedFn.bind(this)(...args));
        this.client.on(twitchEvent, (...args) => {
          this.bot.emitter.emit(`twitch-${ twitchEvent }`, ...args);
        });
      });
    }
  }, {
    key: 'send',
    value: function send(message) {
      this.bot.log.debug(`Sending ${ message.text } to ${ message.channel }`);

      if (message.whisper) {
        return this.client.whisper(message.user.name, message.text);
      }

      this.client.say(message.channel, message.text);
    }
  }, {
    key: 'twitchChat',
    value: (() => {
      var _ref = _asyncToGenerator(function* (channel, twitchUser, text, self) {
        if (self) {
          return;
        }

        try {
          const user = yield this.getUser(twitchUser.username, twitchUser.username, twitchUser);
          this.receive({ user, text, channel });
        } catch (err) {
          this.bot.log.warn(err);
        }
      });

      function twitchChat(_x, _x2, _x3, _x4) {
        return _ref.apply(this, arguments);
      }

      return twitchChat;
    })()
  }, {
    key: 'twitchJoin',
    value: (() => {
      var _ref2 = _asyncToGenerator(function* (channel, username) {
        if (username !== this.username) {
          return;
        }

        try {
          const user = yield this.getUser(username, username);
          return this.enter({ user, channel });
        } catch (err) {
          this.bot.log.warn(err);
        }
      });

      function twitchJoin(_x5, _x6) {
        return _ref2.apply(this, arguments);
      }

      return twitchJoin;
    })()
  }, {
    key: 'twitchPart',
    value: (() => {
      var _ref3 = _asyncToGenerator(function* (channel, username) {
        if (username !== this.username) {
          return;
        }

        try {
          const user = yield this.getUser(username, username);
          return this.leave({ user, channel });
        } catch (err) {
          this.bot.log.warn(err);
        }
      });

      function twitchPart(_x7, _x8) {
        return _ref3.apply(this, arguments);
      }

      return twitchPart;
    })()
  }, {
    key: 'twitchWhisper',
    value: (() => {
      var _ref4 = _asyncToGenerator(function* (username, twitchUser, text, self) {
        if (self) {
          return;
        }

        try {
          const user = yield this.getUser(twitchUser.username, twitchUser.username, twitchUser);
          this.receiveWhisper({ user, text, channel: twitchUser.username });
        } catch (err) {
          this.bot.log.warn(err);
        }
      });

      function twitchWhisper(_x9, _x10, _x11, _x12) {
        return _ref4.apply(this, arguments);
      }

      return twitchWhisper;
    })()
  }, {
    key: 'getUserIdByUserName',
    value: (() => {
      var _ref5 = _asyncToGenerator(function* (name) {
        let botUser;
        try {
          botUser = yield this.getUser(name, name);
        } catch (err) {
          this.bot.log.warn(err);
        }

        return botUser.id;
      });

      function getUserIdByUserName(_x13) {
        return _ref5.apply(this, arguments);
      }

      return getUserIdByUserName;
    })()
  }, {
    key: 'getRolesForUser',
    value: function getRolesForUser(adapterUserId) {
      if (this.roleMapping && this.adapterUsers && this.adapterUsers[adapterUserId]) {
        return this.adapterUsers[adapterUserId].roles.filter(role => this.roleMapping[role]).map(role => this.roleMapping[role]);
      }

      return [];
    }
  }, {
    key: 'getRoles',
    value: function getRoles(userId, user) {
      const roles = [];
      if (user) {
        if (user.subscriber === !0) {
          roles.push('subscriber');
        }

        if (user.mod === !0) {
          roles.push('mod');
        }

        if (user.turbo === !0) {
          roles.push('turbo');
        }
        return roles;
      }

      return !1;
    }
  }]);

  return TwitchAdapter;
}(__WEBPACK_IMPORTED_MODULE_1__exoplay_exobot__["Adapter"]), _class.type = 'twitch', _temp);


/***/ }
/******/ ])));
//# sourceMappingURL=twitch.js.map
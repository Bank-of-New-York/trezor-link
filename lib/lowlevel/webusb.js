"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _events = _interopRequireDefault(require("events"));

var _debugDecorator = require("../debug-decorator");

var _class, _temp;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

var T1HID_VENDOR = 0x534c;
var TREZOR_DESCS = [// TREZOR v1
// won't get opened, but we can show error at least
{
  vendorId: 0x534c,
  productId: 0x0001
}, // TREZOR webusb Bootloader
{
  vendorId: 0x1209,
  productId: 0x53c0
}, // TREZOR webusb Firmware
{
  vendorId: 0x1209,
  productId: 0x53c1
}];
var CONFIGURATION_ID = 1;
var INTERFACE_ID = 0;
var ENDPOINT_ID = 1;
var DEBUG_INTERFACE_ID = 1;
var DEBUG_ENDPOINT_ID = 2;
var WebUsbPlugin = (_class = (_temp =
/*#__PURE__*/
function () {
  function WebUsbPlugin() {
    _classCallCheck(this, WebUsbPlugin);

    this.name = "WebUsbPlugin";
    this.version = "1.7.0";
    this.debug = false;
    this.allowsWriteAndEnumerate = true;
    this.configurationId = CONFIGURATION_ID;
    this.normalInterfaceId = INTERFACE_ID;
    this.normalEndpointId = ENDPOINT_ID;
    this.debugInterfaceId = DEBUG_INTERFACE_ID;
    this.debugEndpointId = DEBUG_ENDPOINT_ID;
    this.unreadableHidDevice = false;
    this.unreadableHidDeviceChange = new _events["default"]();
    this._lastDevices = [];
    this.requestNeeded = true;
  }

  _createClass(WebUsbPlugin, [{
    key: "init",
    value: function () {
      var _init = _asyncToGenerator(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(debug) {
        var usb;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.debug = !!debug; // $FlowIssue

                usb = navigator.usb;

                if (!(usb == null)) {
                  _context.next = 6;
                  break;
                }

                throw new Error("WebUSB is not available on this browser.");

              case 6:
                this.usb = usb;

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function init(_x) {
        return _init.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: "_deviceHasDebugLink",
    value: function _deviceHasDebugLink(device) {
      try {
        var iface = device.configurations[0].interfaces[DEBUG_INTERFACE_ID].alternates[0];
        return iface.interfaceClass === 255 && iface.endpoints[0].endpointNumber === DEBUG_ENDPOINT_ID;
      } catch (e) {
        return false;
      }
    }
  }, {
    key: "_deviceIsHid",
    value: function _deviceIsHid(device) {
      return device.vendorId === T1HID_VENDOR;
    }
  }, {
    key: "_listDevices",
    value: function () {
      var _listDevices2 = _asyncToGenerator(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2() {
        var _this = this;

        var bootloaderId, devices, trezorDevices, hidDevices, nonHidDevices, oldUnreadableHidDevice;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                bootloaderId = 0;
                _context2.next = 3;
                return this.usb.getDevices();

              case 3:
                devices = _context2.sent;
                trezorDevices = devices.filter(function (dev) {
                  var isTrezor = TREZOR_DESCS.some(function (desc) {
                    return dev.vendorId === desc.vendorId && dev.productId === desc.productId;
                  });
                  return isTrezor;
                });
                hidDevices = trezorDevices.filter(function (dev) {
                  return _this._deviceIsHid(dev);
                });
                nonHidDevices = trezorDevices.filter(function (dev) {
                  return !_this._deviceIsHid(dev);
                });
                this._lastDevices = nonHidDevices.map(function (device) {
                  // path is just serial number
                  // more bootloaders => number them, hope for the best
                  var serialNumber = device.serialNumber;
                  var path = serialNumber == null || serialNumber === "" ? "bootloader" : serialNumber;

                  if (path === "bootloader") {
                    bootloaderId++;
                    path = path + bootloaderId;
                  }

                  var debug = _this._deviceHasDebugLink(device);

                  return {
                    path: path,
                    device: device,
                    debug: debug
                  };
                });
                oldUnreadableHidDevice = this.unreadableHidDevice;
                this.unreadableHidDevice = hidDevices.length > 0;

                if (oldUnreadableHidDevice !== this.unreadableHidDevice) {
                  this.unreadableHidDeviceChange.emit("change");
                }

                return _context2.abrupt("return", this._lastDevices);

              case 12:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function _listDevices() {
        return _listDevices2.apply(this, arguments);
      }

      return _listDevices;
    }()
  }, {
    key: "enumerate",
    value: function () {
      var _enumerate = _asyncToGenerator(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee3() {
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this._listDevices();

              case 2:
                _context3.t0 = function (info) {
                  return {
                    path: info.path,
                    debug: info.debug
                  };
                };

                return _context3.abrupt("return", _context3.sent.map(_context3.t0));

              case 4:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function enumerate() {
        return _enumerate.apply(this, arguments);
      }

      return enumerate;
    }()
  }, {
    key: "_findDevice",
    value: function () {
      var _findDevice2 = _asyncToGenerator(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee4(path) {
        var deviceO;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                deviceO = this._lastDevices.find(function (d) {
                  return d.path === path;
                });

                if (!(deviceO == null)) {
                  _context4.next = 3;
                  break;
                }

                throw new Error("Action was interrupted.");

              case 3:
                return _context4.abrupt("return", deviceO.device);

              case 4:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function _findDevice(_x2) {
        return _findDevice2.apply(this, arguments);
      }

      return _findDevice;
    }()
  }, {
    key: "send",
    value: function () {
      var _send = _asyncToGenerator(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee5(path, data, debug) {
        var device, newArray, endpoint;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this._findDevice(path);

              case 2:
                device = _context5.sent;
                newArray = new Uint8Array(64);
                newArray[0] = 63;
                newArray.set(new Uint8Array(data), 1);

                if (device.opened) {
                  _context5.next = 9;
                  break;
                }

                _context5.next = 9;
                return this.connect(path, debug, false);

              case 9:
                endpoint = debug ? this.debugEndpointId : this.normalEndpointId;
                return _context5.abrupt("return", device.transferOut(endpoint, newArray).then(function () {}));

              case 11:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function send(_x3, _x4, _x5) {
        return _send.apply(this, arguments);
      }

      return send;
    }()
  }, {
    key: "receive",
    value: function () {
      var _receive = _asyncToGenerator(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee6(path, debug) {
        var device, endpoint, res;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return this._findDevice(path);

              case 2:
                device = _context6.sent;
                endpoint = debug ? this.debugEndpointId : this.normalEndpointId;
                _context6.prev = 4;

                if (device.opened) {
                  _context6.next = 8;
                  break;
                }

                _context6.next = 8;
                return this.connect(path, debug, false);

              case 8:
                _context6.next = 10;
                return device.transferIn(endpoint, 64);

              case 10:
                res = _context6.sent;

                if (!(res.data.byteLength === 0)) {
                  _context6.next = 13;
                  break;
                }

                return _context6.abrupt("return", this.receive(path, debug));

              case 13:
                return _context6.abrupt("return", res.data.buffer.slice(1));

              case 16:
                _context6.prev = 16;
                _context6.t0 = _context6["catch"](4);

                if (!(_context6.t0.message === "Device unavailable.")) {
                  _context6.next = 22;
                  break;
                }

                throw new Error("Action was interrupted.");

              case 22:
                throw _context6.t0;

              case 23:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this, [[4, 16]]);
      }));

      function receive(_x6, _x7) {
        return _receive.apply(this, arguments);
      }

      return receive;
    }()
  }, {
    key: "connect",
    value: function () {
      var _connect = _asyncToGenerator(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee7(path, debug, first) {
        var _this2 = this;

        var _loop, i, _ret;

        return _regenerator["default"].wrap(function _callee7$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _loop =
                /*#__PURE__*/
                _regenerator["default"].mark(function _loop(i) {
                  return _regenerator["default"].wrap(function _loop$(_context7) {
                    while (1) {
                      switch (_context7.prev = _context7.next) {
                        case 0:
                          if (!(i > 0)) {
                            _context7.next = 3;
                            break;
                          }

                          _context7.next = 3;
                          return new Promise(function (resolve) {
                            return setTimeout(function () {
                              return resolve();
                            }, i * 200);
                          });

                        case 3:
                          _context7.prev = 3;
                          _context7.next = 6;
                          return _this2._connectIn(path, debug, first);

                        case 6:
                          _context7.t0 = _context7.sent;
                          return _context7.abrupt("return", {
                            v: _context7.t0
                          });

                        case 10:
                          _context7.prev = 10;
                          _context7.t1 = _context7["catch"](3);

                          if (!(i === 4)) {
                            _context7.next = 14;
                            break;
                          }

                          throw _context7.t1;

                        case 14:
                        case "end":
                          return _context7.stop();
                      }
                    }
                  }, _loop, null, [[3, 10]]);
                });
                i = 0;

              case 2:
                if (!(i < 5)) {
                  _context8.next = 10;
                  break;
                }

                return _context8.delegateYield(_loop(i), "t0", 4);

              case 4:
                _ret = _context8.t0;

                if (!(_typeof(_ret) === "object")) {
                  _context8.next = 7;
                  break;
                }

                return _context8.abrupt("return", _ret.v);

              case 7:
                i++;
                _context8.next = 2;
                break;

              case 10:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee7);
      }));

      function connect(_x8, _x9, _x10) {
        return _connect.apply(this, arguments);
      }

      return connect;
    }()
  }, {
    key: "_connectIn",
    value: function () {
      var _connectIn2 = _asyncToGenerator(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee8(path, debug, first) {
        var device, chromeOS, interfaceId;
        return _regenerator["default"].wrap(function _callee8$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.next = 2;
                return this._findDevice(path);

              case 2:
                device = _context9.sent;
                _context9.next = 5;
                return device.open();

              case 5:
                if (!first) {
                  _context9.next = 13;
                  break;
                }

                _context9.next = 8;
                return device.selectConfiguration(this.configurationId);

              case 8:
                if (!(typeof navigator !== "undefined")) {
                  _context9.next = 13;
                  break;
                }

                chromeOS = /\bCrOS\b/.test(navigator.userAgent);

                if (chromeOS) {
                  _context9.next = 13;
                  break;
                }

                _context9.next = 13;
                return device.reset();

              case 13:
                interfaceId = debug ? this.debugInterfaceId : this.normalInterfaceId;
                _context9.next = 16;
                return device.claimInterface(interfaceId);

              case 16:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee8, this);
      }));

      function _connectIn(_x11, _x12, _x13) {
        return _connectIn2.apply(this, arguments);
      }

      return _connectIn;
    }()
  }, {
    key: "disconnect",
    value: function () {
      var _disconnect = _asyncToGenerator(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee9(path, debug, last) {
        var device, interfaceId;
        return _regenerator["default"].wrap(function _callee9$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.next = 2;
                return this._findDevice(path);

              case 2:
                device = _context10.sent;
                interfaceId = debug ? this.debugInterfaceId : this.normalInterfaceId;
                _context10.next = 6;
                return device.releaseInterface(interfaceId);

              case 6:
                if (!last) {
                  _context10.next = 9;
                  break;
                }

                _context10.next = 9;
                return device.close();

              case 9:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee9, this);
      }));

      function disconnect(_x14, _x15, _x16) {
        return _disconnect.apply(this, arguments);
      }

      return disconnect;
    }()
  }, {
    key: "requestDevice",
    value: function () {
      var _requestDevice = _asyncToGenerator(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee10() {
        return _regenerator["default"].wrap(function _callee10$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.next = 2;
                return this.usb.requestDevice({
                  filters: TREZOR_DESCS
                });

              case 2:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee10, this);
      }));

      function requestDevice() {
        return _requestDevice.apply(this, arguments);
      }

      return requestDevice;
    }()
  }]);

  return WebUsbPlugin;
}(), _temp), (_applyDecoratedDescriptor(_class.prototype, "init", [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, "init"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "connect", [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, "connect"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "disconnect", [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, "disconnect"), _class.prototype)), _class);
exports["default"] = WebUsbPlugin;
module.exports = exports.default;
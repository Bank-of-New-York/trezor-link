"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _v = _interopRequireDefault(require("./bridge/v2"));

var _withSharedConnections = _interopRequireDefault(require("./lowlevel/withSharedConnections"));

var _fallback = _interopRequireDefault(require("./fallback"));

var _webusb = _interopRequireDefault(require("./lowlevel/webusb"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// export is empty, you can import by "trezor-link/parallel", "trezor-link/lowlevel", "trezor-link/bridge"
// node throw error with version 3.0.0
// https://github.com/github/fetch/issues/657
try {
  require("whatwg-fetch");
} catch (e) {// empty
}

if (typeof window === "undefined") {
  // eslint-disable-next-line quotes
  var _fetch = require('node-fetch')["default"];

  _v["default"].setFetch(_fetch, true);
} else {
  _v["default"].setFetch(fetch, false);
}

var _default = {
  BridgeV2: _v["default"],
  Fallback: _fallback["default"],
  Lowlevel: _withSharedConnections["default"],
  WebUsb: _webusb["default"]
};
exports["default"] = _default;
module.exports = exports.default;
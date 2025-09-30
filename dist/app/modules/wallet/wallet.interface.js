"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountType = exports.WalletStatus = void 0;
var WalletStatus;
(function (WalletStatus) {
    WalletStatus["ACTIVE"] = "active";
    WalletStatus["BLOCKED"] = "blocked";
})(WalletStatus || (exports.WalletStatus = WalletStatus = {}));
var AccountType;
(function (AccountType) {
    AccountType["PERSONAL"] = "personal";
    AccountType["BUSINESS"] = "business";
})(AccountType || (exports.AccountType = AccountType = {}));

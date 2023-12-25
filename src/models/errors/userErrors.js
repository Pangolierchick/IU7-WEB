"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserIsNotAdminError = exports.UserAlreadyExistError = exports.JWTExpired = exports.InvalidJWT = exports.UserNotFound = exports.WrongPasswordOrLoginError = void 0;
var WrongPasswordOrLoginError = /** @class */ (function (_super) {
    __extends(WrongPasswordOrLoginError, _super);
    function WrongPasswordOrLoginError() {
        var _this = _super.call(this, "Wrong password or login.") || this;
        _this.name = "WrongPasswordOrLoginError";
        return _this;
    }
    return WrongPasswordOrLoginError;
}(Error));
exports.WrongPasswordOrLoginError = WrongPasswordOrLoginError;
var UserNotFound = /** @class */ (function (_super) {
    __extends(UserNotFound, _super);
    function UserNotFound(userId) {
        var _this = _super.call(this, "User ".concat(userId !== null && userId !== void 0 ? userId : "", " not found")) || this;
        _this.name = "UserNotFound";
        return _this;
    }
    return UserNotFound;
}(Error));
exports.UserNotFound = UserNotFound;
var InvalidJWT = /** @class */ (function (_super) {
    __extends(InvalidJWT, _super);
    function InvalidJWT(msg) {
        var _this = _super.call(this, msg !== null && msg !== void 0 ? msg : "Invalid JWT") || this;
        _this.name = "InvalidJWT";
        return _this;
    }
    return InvalidJWT;
}(Error));
exports.InvalidJWT = InvalidJWT;
var JWTExpired = /** @class */ (function (_super) {
    __extends(JWTExpired, _super);
    function JWTExpired() {
        var _this = _super.call(this, "JWT expired") || this;
        _this.name = "JWTExpired";
        return _this;
    }
    return JWTExpired;
}(Error));
exports.JWTExpired = JWTExpired;
var UserAlreadyExistError = /** @class */ (function (_super) {
    __extends(UserAlreadyExistError, _super);
    function UserAlreadyExistError() {
        var _this = _super.call(this, "User already exist") || this;
        _this.name = "UserAlreadyExistError";
        return _this;
    }
    return UserAlreadyExistError;
}(Error));
exports.UserAlreadyExistError = UserAlreadyExistError;
var UserIsNotAdminError = /** @class */ (function (_super) {
    __extends(UserIsNotAdminError, _super);
    function UserIsNotAdminError(userId) {
        var _this = _super.call(this, "User ".concat(userId !== null && userId !== void 0 ? userId : "", " is not an admin")) || this;
        _this.name = "UserIsNotAdminError";
        return _this;
    }
    return UserIsNotAdminError;
}(Error));
exports.UserIsNotAdminError = UserIsNotAdminError;

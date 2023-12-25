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
exports.AdvertisementRightsError = exports.UpdateAdvertisementRightsError = exports.DeleteAdvertisementRightsError = exports.AdvertisementAlreadyBooked = exports.AdvertisementNotApprovedError = exports.OwnerRentError = exports.RentDateError = exports.AdvertisementNotFound = void 0;
var AdvertisementNotFound = /** @class */ (function (_super) {
    __extends(AdvertisementNotFound, _super);
    function AdvertisementNotFound(adId) {
        var _this = _super.call(this, "Ad ".concat(adId !== null && adId !== void 0 ? adId : "", " not found")) || this;
        _this.name = "AdvertisementNotFound";
        return _this;
    }
    return AdvertisementNotFound;
}(Error));
exports.AdvertisementNotFound = AdvertisementNotFound;
var RentDateError = /** @class */ (function (_super) {
    __extends(RentDateError, _super);
    function RentDateError() {
        var _this = _super.call(this, "Date can't be less than todays date") || this;
        _this.name = "RentDateError";
        return _this;
    }
    return RentDateError;
}(Error));
exports.RentDateError = RentDateError;
var OwnerRentError = /** @class */ (function (_super) {
    __extends(OwnerRentError, _super);
    function OwnerRentError() {
        var _this = _super.call(this, "Owner cant rent own advertisement") || this;
        _this.name = "OwnerRentError";
        return _this;
    }
    return OwnerRentError;
}(Error));
exports.OwnerRentError = OwnerRentError;
var AdvertisementNotApprovedError = /** @class */ (function (_super) {
    __extends(AdvertisementNotApprovedError, _super);
    function AdvertisementNotApprovedError(adId) {
        var _this = _super.call(this, "Ad ".concat(adId !== null && adId !== void 0 ? adId : "", " is not approved")) || this;
        _this.name = "AdvertisementNotApprovedError";
        return _this;
    }
    return AdvertisementNotApprovedError;
}(Error));
exports.AdvertisementNotApprovedError = AdvertisementNotApprovedError;
var AdvertisementAlreadyBooked = /** @class */ (function (_super) {
    __extends(AdvertisementAlreadyBooked, _super);
    function AdvertisementAlreadyBooked() {
        var _this = _super.call(this, "Advertisement has already been booked for these dates") || this;
        _this.name = "RentAlreadyBooked";
        return _this;
    }
    return AdvertisementAlreadyBooked;
}(Error));
exports.AdvertisementAlreadyBooked = AdvertisementAlreadyBooked;
var DeleteAdvertisementRightsError = /** @class */ (function (_super) {
    __extends(DeleteAdvertisementRightsError, _super);
    function DeleteAdvertisementRightsError(userId) {
        var _this = _super.call(this, "User ".concat(userId !== null && userId !== void 0 ? userId : "", " neither admin nor owner to delete advertisement")) || this;
        _this.name = "DeleteAdvertisementRightsError";
        return _this;
    }
    return DeleteAdvertisementRightsError;
}(Error));
exports.DeleteAdvertisementRightsError = DeleteAdvertisementRightsError;
var UpdateAdvertisementRightsError = /** @class */ (function (_super) {
    __extends(UpdateAdvertisementRightsError, _super);
    function UpdateAdvertisementRightsError(userId) {
        var _this = _super.call(this, "User ".concat(userId !== null && userId !== void 0 ? userId : "", " neither admin nor owner to Update advertisement")) || this;
        _this.name = "UpdateAdvertisementRightsError";
        return _this;
    }
    return UpdateAdvertisementRightsError;
}(Error));
exports.UpdateAdvertisementRightsError = UpdateAdvertisementRightsError;
var AdvertisementRightsError = /** @class */ (function (_super) {
    __extends(AdvertisementRightsError, _super);
    function AdvertisementRightsError(userId) {
        var _this = _super.call(this, "User ".concat(userId !== null && userId !== void 0 ? userId : "", " must be admin or owner to do that operation.")) || this;
        _this.name = "AdvertisementRightError";
        return _this;
    }
    return AdvertisementRightsError;
}(Error));
exports.AdvertisementRightsError = AdvertisementRightsError;

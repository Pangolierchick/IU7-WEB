"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvertisementRepository = void 0;
var library_1 = require("@prisma/client/runtime/library");
var generalErrors_1 = require("../models/errors/generalErrors");
var AdvertisementRepository = /** @class */ (function () {
    function AdvertisementRepository(_prisma) {
        this.prisma = _prisma;
    }
    AdvertisementRepository.prototype.get = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.advertisement.findFirst({ where: { id: id } })];
            });
        });
    };
    AdvertisementRepository.prototype.getAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.advertisement.findMany({ orderBy: { address: "asc" } })];
            });
        });
    };
    AdvertisementRepository.prototype.update = function (newAdv) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!newAdv.id) {
                            throw new Error("Field id is required");
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.prisma.advertisement.update({
                                data: newAdv,
                                where: { id: newAdv.id },
                            })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        if (e_1 instanceof library_1.PrismaClientUnknownRequestError) {
                            throw new generalErrors_1.ReadOnlyError();
                        }
                        throw new Error("Failed to update advertisement with id=".concat(newAdv.id, ". ").concat(e_1.message));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AdvertisementRepository.prototype.create = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var d, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        d = __assign(__assign({}, data), { scoreCount: 1 });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.prisma.advertisement.create({ data: d })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _a.sent();
                        if (e_2 instanceof library_1.PrismaClientUnknownRequestError) {
                            throw new generalErrors_1.ReadOnlyError();
                        }
                        throw new Error("Failed to create advertisement. ".concat(e_2.message));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AdvertisementRepository.prototype.delete = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.prisma.advertisement.delete({ where: { id: id } })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_3 = _a.sent();
                        if (e_3 instanceof library_1.PrismaClientUnknownRequestError) {
                            throw new generalErrors_1.ReadOnlyError();
                        }
                        throw new Error("Failed to delete advertisement");
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AdvertisementRepository.prototype.getWithFilter = function (filter) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.advertisement.findMany({ where: __assign({}, filter) })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return AdvertisementRepository;
}());
exports.AdvertisementRepository = AdvertisementRepository;

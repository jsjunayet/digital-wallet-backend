"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = void 0;
const constants_1 = require("../constants");
class QueryBuilder {
    constructor(modelQuery, query = {}) {
        this.modelQuery = modelQuery;
        this.query = query;
    }
    filter() {
        const filters = Object.assign({}, this.query);
        // Remove reserved keys
        for (const field of constants_1.excludeField) {
            delete filters[field];
        }
        this.modelQuery = this.modelQuery.find(filters);
        return this;
    }
    search(searchableFields) {
        var _a, _b;
        const searchTerm = (_b = (_a = this.query) === null || _a === void 0 ? void 0 : _a.searchTerm) === null || _b === void 0 ? void 0 : _b.trim();
        if (searchTerm) {
            const searchConditions = searchableFields
                .filter((field) => field !== "_id" && field !== "ownerId")
                .map((field) => ({
                [field]: { $regex: searchTerm, $options: "i" },
            }));
            this.modelQuery = this.modelQuery.find({ $or: searchConditions });
        }
        return this;
    }
    sort() {
        const sortBy = this.query.sort || "-createdAt";
        this.modelQuery = this.modelQuery.sort(sortBy);
        return this;
    }
    fields() {
        var _a;
        const fields = (_a = this.query.fields) === null || _a === void 0 ? void 0 : _a.split(",").join(" ");
        if (fields) {
            this.modelQuery = this.modelQuery.select(fields);
        }
        return this;
    }
    paginate() {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;
        const skip = (page - 1) * limit;
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }
    build() {
        return this.modelQuery;
    }
    getMeta() {
        return __awaiter(this, void 0, void 0, function* () {
            const page = Number(this.query.page) || 1;
            const limit = Number(this.query.limit) || 10;
            const total = yield this.modelQuery.model.countDocuments();
            const totalPage = Math.ceil(total / limit);
            return { page, limit, total, totalPage };
        });
    }
}
exports.QueryBuilder = QueryBuilder;

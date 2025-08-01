/* eslint-disable @typescript-eslint/no-dynamic-delete */
import { Query } from "mongoose";
import { excludeField } from "../constants";

type QueryParams = Record<string, string | undefined>;

export class QueryBuilder<T> {
  private modelQuery: Query<T[], T>;
  private readonly query: QueryParams;

  constructor(modelQuery: Query<T[], T>, query: QueryParams = {}) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  filter(): this {
    const filters = { ...this.query };

    // Remove reserved keys
    for (const field of excludeField) {
      delete filters[field];
    }

    this.modelQuery = this.modelQuery.find(filters as Record<string, unknown>);

    return this;
  }

  search(searchableFields: string[]): this {
    const searchTerm = this.query?.searchTerm?.trim();

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

  sort(): this {
    const sortBy = this.query.sort || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sortBy);
    return this;
  }

  fields(): this {
    const fields = this.query.fields?.split(",").join(" ");
    if (fields) {
      this.modelQuery = this.modelQuery.select(fields);
    }
    return this;
  }

  paginate(): this {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  build() {
    return this.modelQuery;
  }

  async getMeta() {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const total = await this.modelQuery.model.countDocuments();
    const totalPage = Math.ceil(total / limit);

    return { page, limit, total, totalPage };
  }
}

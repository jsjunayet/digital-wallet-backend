"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentStatus = exports.Status = exports.Role = void 0;
var Role;
(function (Role) {
    Role["SUPER_ADMIN"] = "SUPER_ADMIN";
    Role["ADMIN"] = "ADMIN";
    Role["USER"] = "USER";
    Role["AGENT"] = "AGENT";
})(Role || (exports.Role = Role = {}));
var Status;
(function (Status) {
    Status["ACTIVE"] = "ACTIVE";
    Status["BLOCKED"] = "BLOCKED";
})(Status || (exports.Status = Status = {}));
var agentStatus;
(function (agentStatus) {
    agentStatus["PENDING"] = "pending";
    agentStatus["APPROVED"] = "approved";
    agentStatus["SUSPENDED"] = "suspended";
})(agentStatus || (exports.agentStatus = agentStatus = {}));

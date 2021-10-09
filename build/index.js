"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("dns/promises"));
const emojis_list_1 = __importDefault(require("emojis-list"));
const config_1 = __importDefault(require("./config"));
(async function () {
    for (let i = config_1.default.start; i < emojis_list_1.default.length; i++) {
        const resolutions = await Promise.all(config_1.default.tlds.map((ext) => resolve(`${emojis_list_1.default[i]}.${ext}`)));
        // Check resolutions
        const available = resolutions.map((res, tldIndex) => {
            // Check no records exist
            if ("code" in res && res.code === "ENODATA") {
                const tld = config_1.default.tlds[tldIndex];
                return `${emojis_list_1.default[i]}.${tld}`;
            }
            else
                return "";
        });
        // Available domains
        console.log(`[${i}:${emojis_list_1.default[i]}] ${available.join("\t")}`);
    }
})();
async function resolve(host) {
    try {
        return await promises_1.default.resolve(host);
    }
    catch (error) {
        return error;
    }
}
//# sourceMappingURL=index.js.map
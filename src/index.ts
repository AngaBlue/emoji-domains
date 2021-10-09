import dns from "dns/promises";
import emojis from "emojis-list";
import config from "./config";
import delay from "./delay";
import { createArrayCsvWriter as csv } from "csv-writer";
import punycode from "punycode/";

(async function () {
    // Log
    const log: string[][] = [];
    for (let i = config.start; i < emojis.length; i++) {
        const resolutions = await Promise.all(config.tlds.map((ext) => resolve(`${emojis[i]}.${ext}`)));
        // Check resolutions
        let ratelimit = false;
        const available = resolutions.map((res, tldIndex) => {
            // Check no records exist
            if ("code" in res) {
                if (["ENODATA", "ENOTFOUND"].includes(res.code)) {
                    const tld = config.tlds[tldIndex];
                    return `${emojis[i]}.${tld}`;
                } else {
                    if (res.code === "EREFUSED") {
                        ratelimit = true;
                    }
                }
            }
            return "";
        })
        // Available domains
        console.log(`[${i}:${emojis[i]}]\t${available.join("\t")}`);
        log.push([emojis[i], punycode.toASCII(emojis[i]),...available])
        if (ratelimit) await delay(1000);
    }
    // Write CSV
    const file = csv({
        path: "domains.csv",
        header: ["Emoji", "Punycode", ...config.tlds],
        encoding: "utf-8"
    })
    file.writeRecords(log);
})()

async function resolve(host: string): Promise<string[] | ResolutionError> {
    try {
        return await dns.resolve(host);
    } catch (error) {
        return error;
    }
}

interface ResolutionError extends Error {
    code: "ENODATA" | "ENOTFOUND" | "EREFUSED" | "ERR_INVALID_ARG_VALUE",
    syscall: "queryA",
    hostname: string
}
import dns from "dns/promises";
import emojis from "emojis-list";
import config from "./config";

(async function () {
    for (let i = config.start; i < emojis.length; i++) {
        const resolutions = await Promise.all(config.tlds.map((ext) => resolve(`${emojis[i]}.${ext}`)));
        // Check resolutions
        const available = resolutions.map((res, tldIndex) => {
            // Check no records exist
            if ("code" in res && res.code === "ENODATA") {
                const tld = config.tlds[tldIndex];
                return `${emojis[i]}.${tld}`;
            } else return "";
        })
        // Available domains
        console.log(`[${i}:${emojis[i]}] ${available.join("\t")}`)
    }
})()

async function resolve(host: string): Promise<string[] |  ResolutionError> {
    try {
        return await dns.resolve(host);
    } catch (error) {
        return error;
    }
}

interface ResolutionError extends Error {
    code: "ENODATA",
    syscall: "queryA",
    hostname: string
}
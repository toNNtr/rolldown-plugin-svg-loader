import path from "node:path";
import fs from "node:fs";

import type { Plugin } from "rolldown";

export default function svg(): Plugin {
    return {
        name: "@tonntr/rolldown-plugin-svg-loader",
        resolveId: {
            filter: { id: /\.svg(?:\?raw)?$/ },
            handler(source, importer = "") {
                return path.resolve(path.dirname(importer), source);
            },
        },
        load: {
            filter: { id: /\.svg(?:\?raw)?$/ },
            handler(id) {
                const cleanId = id.replace(/\?raw$/, "");
                const fileOptions = {
                    type: "asset",
                    name: path.basename(cleanId),
                    source: fs.readFileSync(cleanId),
                } as const;

                if (/\.svg$/.test(id)) {
                    const referenceId = this.emitFile(fileOptions);

                    return `export default import.meta.ROLLUP_FILE_URL_${referenceId};`;
                } else {
                    return `export default \`${fileOptions.source.toString()}\``;
                }
            },
        },
    };
}

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const yargs = require("yargs");
const common_1 = require("./lib/common");
const util_1 = require("./lib/util");
const search_index_generator_1 = require("./lib/search-index-generator");
if (!module.parent) {
    if (!common_1.existsTypesDataFileSync()) {
        console.log("Run parse-definitions first!");
    }
    else {
        const skipDownloads = yargs.argv.skipDownloads;
        const full = yargs.argv.full;
        util_1.done(main(skipDownloads, full));
    }
}
function main(skipDownloads, full) {
    return __awaiter(this, void 0, void 0, function* () {
        let packages = yield common_1.readAllPackages();
        console.log(`Loaded ${packages.length} entries`);
        const records = yield util_1.nAtATime(10, packages, pkg => search_index_generator_1.createSearchRecord(pkg, skipDownloads));
        // Most downloads first
        records.sort((a, b) => b.d - a.d);
        console.log(`Done generating search index`);
        console.log(`Writing out data files`);
        yield common_1.writeDataFile("search-index-min.json", records, false);
        if (full) {
            yield common_1.writeDataFile("search-index-full.json", records.map(verboseRecord), true);
        }
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = main;
function verboseRecord(r) {
    return renameProperties(r, {
        t: "typePackageName",
        g: "globals",
        m: "declaredExternalModules",
        p: "projectName",
        l: "libraryName",
        d: "downloads",
        r: "redirect"
    });
}
function renameProperties(obj, replacers) {
    const out = {};
    for (const key of Object.getOwnPropertyNames(obj)) {
        out[replacers[key]] = obj[key];
    }
    return out;
}
//# sourceMappingURL=create-search-index.js.map
import {
    alternativePackage
} from "./alternativePackage";

interface PackageInfo {
    id: string;
    requestedVersion?: string;
    resolvedVersion: string;
    deprecationReasons: string[];
    alternativePackage: alternativePackage;
}

export {
    PackageInfo
};

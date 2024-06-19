import {
    DependencyType
} from "./dependencyType";
import {
    alternativePackage
} from "./alternativePackage";

interface dependencyDetails {
    id: string;
    requestedVersion?: string;
    resolvedVersion: string;
    type: DependencyType;
    deprecationReasons: string[];
    alternativePackage: alternativePackage;
}

export {
    dependencyDetails
};
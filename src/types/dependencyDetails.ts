import {
    DependencyType
} from "./dependencyType";

interface dependencyDetails {
    id: string;
    requestedVersion?: string;
    resolvedVersion: string;
    type: DependencyType;
}

export {
    dependencyDetails
};
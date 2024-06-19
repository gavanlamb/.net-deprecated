import {
    Problem
} from "./problem";
import {
    Project
} from "./project";

interface Configuration {
    version: number;
    parameters: string;
    problems?: Problem[],
    sources: string[];
    projects: Project[];
}

export {
    Configuration
};

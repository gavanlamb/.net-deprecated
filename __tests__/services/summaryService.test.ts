import {
    Configuration
} from "../../src/types/configuration";

describe("getDetailedBody", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
    });

    it("should return a detailed markdown view for a given configuration", async () => {
        const configuration: Configuration = {
            parameters: "--deprecated",
            version: 1,
            sources: [],
            projects: [
                {
                    path: "/path/to/project.csproj",
                    frameworks: [
                        {
                            framework: "net5.0",
                            topLevelPackages: [
                                {
                                    id: "PackageA",
                                    requestedVersion: "1.0.0",
                                    resolvedVersion: "1.0.0",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageA",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageB",
                                    requestedVersion: "1.0.0-foo",
                                    resolvedVersion: "1.0.0-foo",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageB",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageC",
                                    requestedVersion: "1.0.0",
                                    resolvedVersion: "1.0.0",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageC",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageD",
                                    requestedVersion: "1.0.0-foo",
                                    resolvedVersion: "1.0.0-foo",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageD",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageE",
                                    requestedVersion: "1.0.0",
                                    resolvedVersion: "1.0.0",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageE",
                                        versionRange: ">= 0.0.0"
                                    }
                                }
                            ],
                            transitivePackages: [
                                {
                                    id: "PackageF",
                                    resolvedVersion: "1.0.0-foo",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageF",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageG",
                                    resolvedVersion: "1.0.0-foo",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageG",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageH",
                                    resolvedVersion: "1.0.0",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageH",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageI",
                                    resolvedVersion: "1.0.1",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageI",
                                        versionRange: ">= 0.0.0"
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        };

        const debugMock = jest.fn();
        const infoMock = jest.fn();
        jest.doMock("@actions/core", () => ({ debug: debugMock, info: infoMock }));

        const getFileNameMock = jest.fn().mockReturnValue("project.csproj");
        jest.doMock("../../src/helpers/pathHelper", () => ({getFileName: getFileNameMock}));

        const { getDetailedBody } = await import("../../src/services/summaryService");
        const result = getDetailedBody(configuration);

        expect(infoMock).toHaveBeenCalledWith("Generating detailed view...");
        expect(getFileNameMock).toHaveBeenCalledWith("/path/to/project.csproj");
        expect(debugMock).toHaveBeenCalledWith("Generated detailed view " +
            "## project.csproj\n" +
            "\n" +
            "### net5.0\n" +
            "\n" +
            "| Package name | Type | Request version | Resolved version | Deprecation reasons | Alternative package name | Alternative package version range |\n" +
            "|---|---|---:|---:|---|---|---:|\n" +
            "| PackageA | Top Level | 1.0.0 | 1.0.0 | Legacy | Z.PackageA | >= 0.0.0 |\n" +
            "| PackageB | Top Level | 1.0.0-foo | 1.0.0-foo | Legacy | Z.PackageB | >= 0.0.0 |\n" +
            "| PackageC | Top Level | 1.0.0 | 1.0.0 | Legacy | Z.PackageC | >= 0.0.0 |\n" +
            "| PackageD | Top Level | 1.0.0-foo | 1.0.0-foo | Legacy | Z.PackageD | >= 0.0.0 |\n" +
            "| PackageE | Top Level | 1.0.0 | 1.0.0 | Legacy | Z.PackageE | >= 0.0.0 |\n" +
            "| PackageF | Transitive |  | 1.0.0-foo | Legacy | Z.PackageF | >= 0.0.0 |\n" +
            "| PackageG | Transitive |  | 1.0.0-foo | Legacy | Z.PackageG | >= 0.0.0 |\n" +
            "| PackageH | Transitive |  | 1.0.0 | Legacy | Z.PackageH | >= 0.0.0 |\n" +
            "| PackageI | Transitive |  | 1.0.1 | Legacy | Z.PackageI | >= 0.0.0 |\n\n");
        expect(result).toContain("## project.csproj");
        expect(result).toContain("### net5.0");
        expect(result).toContain("| Package name | Type | Request version | Resolved version | Deprecation reasons | Alternative package name | Alternative package version range |");
        expect(result).toContain("|---|---|---:|---:|---|---|---:|");
        expect(result).toContain("| PackageA | Top Level | 1.0.0 | 1.0.0 | Legacy | Z.PackageA | >= 0.0.0 |");
        expect(result).toContain("| PackageB | Top Level | 1.0.0-foo | 1.0.0-foo | Legacy | Z.PackageB | >= 0.0.0 |");
        expect(result).toContain("| PackageC | Top Level | 1.0.0 | 1.0.0 | Legacy | Z.PackageC | >= 0.0.0 |");
        expect(result).toContain("| PackageD | Top Level | 1.0.0-foo | 1.0.0-foo | Legacy | Z.PackageD | >= 0.0.0 |");
        expect(result).toContain("| PackageE | Top Level | 1.0.0 | 1.0.0 | Legacy | Z.PackageE | >= 0.0.0 |");
        expect(result).toContain("| PackageF | Transitive |  | 1.0.0-foo | Legacy | Z.PackageF | >= 0.0.0 |");
        expect(result).toContain("| PackageG | Transitive |  | 1.0.0-foo | Legacy | Z.PackageG | >= 0.0.0 |");
        expect(result).toContain("| PackageH | Transitive |  | 1.0.0 | Legacy | Z.PackageH | >= 0.0.0 |");
        expect(result).toContain("| PackageI | Transitive |  | 1.0.1 | Legacy | Z.PackageI | >= 0.0.0 |");
    });

    it("should return a detailed markdown view for a given configuration when topLevelPackages is undefined", async () => {
        const configuration: Configuration = {
            parameters: "--deprecated",
            version: 1,
            sources: [],
            projects: [
                {
                    path: "/path/to/project.csproj",
                    frameworks: [
                        {
                            framework: "net5.0",
                            transitivePackages: [
                                {
                                    id: "PackageF",
                                    resolvedVersion: "1.0.0-foo",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageF",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageG",
                                    resolvedVersion: "1.0.0-foo",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageG",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageH",
                                    resolvedVersion: "1.0.0",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageH",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageI",
                                    resolvedVersion: "1.0.1",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageI",
                                        versionRange: ">= 0.0.0"
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        };

        const debugMock = jest.fn();
        const infoMock = jest.fn();
        jest.doMock("@actions/core", () => ({ debug: debugMock, info: infoMock }));

        const getFileNameMock = jest.fn().mockReturnValue("project.csproj");
        jest.doMock("../../src/helpers/pathHelper", () => ({getFileName: getFileNameMock}));

        const { getDetailedBody } = await import("../../src/services/summaryService");
        const result = getDetailedBody(configuration);

        expect(infoMock).toHaveBeenCalledWith("Generating detailed view...");
        expect(getFileNameMock).toHaveBeenCalledWith("/path/to/project.csproj");
        expect(debugMock).toHaveBeenCalledWith("Generated detailed view " +
            "## project.csproj\n" +
            "\n" +
            "### net5.0\n" +
            "\n" +
            "| Package name | Type | Request version | Resolved version | Deprecation reasons | Alternative package name | Alternative package version range |\n" +
            "|---|---|---:|---:|---|---|---:|\n" +
            "| PackageF | Transitive |  | 1.0.0-foo | Legacy | Z.PackageF | >= 0.0.0 |\n" +
            "| PackageG | Transitive |  | 1.0.0-foo | Legacy | Z.PackageG | >= 0.0.0 |\n" +
            "| PackageH | Transitive |  | 1.0.0 | Legacy | Z.PackageH | >= 0.0.0 |\n" +
            "| PackageI | Transitive |  | 1.0.1 | Legacy | Z.PackageI | >= 0.0.0 |\n\n");
        expect(result).toContain("## project.csproj");
        expect(result).toContain("### net5.0");
        expect(result).toContain("| Package name | Type | Request version | Resolved version | Deprecation reasons | Alternative package name | Alternative package version range |");
        expect(result).toContain("|---|---|---:|---:|---|---|---:|");
        expect(result).toContain("| PackageF | Transitive |  | 1.0.0-foo | Legacy | Z.PackageF | >= 0.0.0 |");
        expect(result).toContain("| PackageG | Transitive |  | 1.0.0-foo | Legacy | Z.PackageG | >= 0.0.0 |");
        expect(result).toContain("| PackageH | Transitive |  | 1.0.0 | Legacy | Z.PackageH | >= 0.0.0 |");
        expect(result).toContain("| PackageI | Transitive |  | 1.0.1 | Legacy | Z.PackageI | >= 0.0.0 |");
    });

    it("should return a detailed markdown view for a given configuration when topLevelPackages is empty", async () => {
        const configuration: Configuration = {
            parameters: "--deprecated",
            version: 1,
            sources: [],
            projects: [
                {
                    path: "/path/to/project.csproj",
                    frameworks: [
                        {
                            framework: "net5.0",
                            topLevelPackages: [],
                            transitivePackages: [
                                {
                                    id: "PackageF",
                                    resolvedVersion: "1.0.0-foo",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageF",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageG",
                                    resolvedVersion: "1.0.0-foo",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageG",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageH",
                                    resolvedVersion: "1.0.0",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageH",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageI",
                                    resolvedVersion: "1.0.1",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageI",
                                        versionRange: ">= 0.0.0"
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        };

        const debugMock = jest.fn();
        const infoMock = jest.fn();
        jest.doMock("@actions/core", () => ({ debug: debugMock, info: infoMock }));

        const getFileNameMock = jest.fn().mockReturnValue("project.csproj");
        jest.doMock("../../src/helpers/pathHelper", () => ({getFileName: getFileNameMock}));

        const { getDetailedBody } = await import("../../src/services/summaryService");
        const result = getDetailedBody(configuration);

        expect(infoMock).toHaveBeenCalledWith("Generating detailed view...");
        expect(getFileNameMock).toHaveBeenCalledWith("/path/to/project.csproj");
        expect(debugMock).toHaveBeenCalledWith("Generated detailed view " +
            "## project.csproj\n" +
            "\n" +
            "### net5.0\n" +
            "\n" +
            "| Package name | Type | Request version | Resolved version | Deprecation reasons | Alternative package name | Alternative package version range |\n" +
            "|---|---|---:|---:|---|---|---:|\n" +
            "| PackageF | Transitive |  | 1.0.0-foo | Legacy | Z.PackageF | >= 0.0.0 |\n" +
            "| PackageG | Transitive |  | 1.0.0-foo | Legacy | Z.PackageG | >= 0.0.0 |\n" +
            "| PackageH | Transitive |  | 1.0.0 | Legacy | Z.PackageH | >= 0.0.0 |\n" +
            "| PackageI | Transitive |  | 1.0.1 | Legacy | Z.PackageI | >= 0.0.0 |\n\n");
        expect(result).toContain("## project.csproj");
        expect(result).toContain("### net5.0");
        expect(result).toContain("| Package name | Type | Request version | Resolved version | Deprecation reasons | Alternative package name | Alternative package version range |");
        expect(result).toContain("|---|---|---:|---:|---|---|---:|");
        expect(result).toContain("| PackageF | Transitive |  | 1.0.0-foo | Legacy | Z.PackageF | >= 0.0.0 |");
        expect(result).toContain("| PackageG | Transitive |  | 1.0.0-foo | Legacy | Z.PackageG | >= 0.0.0 |");
        expect(result).toContain("| PackageH | Transitive |  | 1.0.0 | Legacy | Z.PackageH | >= 0.0.0 |");
        expect(result).toContain("| PackageI | Transitive |  | 1.0.1 | Legacy | Z.PackageI | >= 0.0.0 |");
    });

    it("should return a detailed markdown view for a given configuration when transitivePackages is undefined", async () => {
        const configuration: Configuration = {
            parameters: "--deprecated",
            version: 1,
            sources: [],
            projects: [
                {
                    path: "/path/to/project.csproj",
                    frameworks: [
                        {
                            framework: "net5.0",
                            topLevelPackages: [
                                {
                                    id: "PackageA",
                                    requestedVersion: "1.0.0",
                                    resolvedVersion: "1.0.0",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageA",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageB",
                                    requestedVersion: "1.0.0-foo",
                                    resolvedVersion: "1.0.0-foo",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageB",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageC",
                                    requestedVersion: "1.0.0",
                                    resolvedVersion: "1.0.0",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageC",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageD",
                                    requestedVersion: "1.0.0-foo",
                                    resolvedVersion: "1.0.0-foo",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageD",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageE",
                                    requestedVersion: "1.0.0",
                                    resolvedVersion: "1.0.0",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageE",
                                        versionRange: ">= 0.0.0"
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        };

        const debugMock = jest.fn();
        const infoMock = jest.fn();
        jest.doMock("@actions/core", () => ({ debug: debugMock, info: infoMock }));

        const getFileNameMock = jest.fn().mockReturnValue("project.csproj");
        jest.doMock("../../src/helpers/pathHelper", () => ({getFileName: getFileNameMock}));

        const { getDetailedBody } = await import("../../src/services/summaryService");
        const result = getDetailedBody(configuration);

        expect(infoMock).toHaveBeenCalledWith("Generating detailed view...");
        expect(getFileNameMock).toHaveBeenCalledWith("/path/to/project.csproj");
        expect(debugMock).toHaveBeenCalledWith("Generated detailed view " +
            "## project.csproj\n" +
            "\n" +
            "### net5.0\n" +
            "\n" +
            "| Package name | Type | Request version | Resolved version | Deprecation reasons | Alternative package name | Alternative package version range |\n" +
            "|---|---|---:|---:|---|---|---:|\n" +
            "| PackageA | Top Level | 1.0.0 | 1.0.0 | Legacy | Z.PackageA | >= 0.0.0 |\n" +
            "| PackageB | Top Level | 1.0.0-foo | 1.0.0-foo | Legacy | Z.PackageB | >= 0.0.0 |\n" +
            "| PackageC | Top Level | 1.0.0 | 1.0.0 | Legacy | Z.PackageC | >= 0.0.0 |\n" +
            "| PackageD | Top Level | 1.0.0-foo | 1.0.0-foo | Legacy | Z.PackageD | >= 0.0.0 |\n" +
            "| PackageE | Top Level | 1.0.0 | 1.0.0 | Legacy | Z.PackageE | >= 0.0.0 |\n\n");
        expect(result).toContain("## project.csproj");
        expect(result).toContain("### net5.0");
        expect(result).toContain("| Package name | Type | Request version | Resolved version | Deprecation reasons | Alternative package name | Alternative package version range |");
        expect(result).toContain("|---|---|---:|---:|---|---|---:|");
        expect(result).toContain("| PackageA | Top Level | 1.0.0 | 1.0.0 | Legacy | Z.PackageA | >= 0.0.0 |");
        expect(result).toContain("| PackageB | Top Level | 1.0.0-foo | 1.0.0-foo | Legacy | Z.PackageB | >= 0.0.0 |");
        expect(result).toContain("| PackageC | Top Level | 1.0.0 | 1.0.0 | Legacy | Z.PackageC | >= 0.0.0 |");
        expect(result).toContain("| PackageD | Top Level | 1.0.0-foo | 1.0.0-foo | Legacy | Z.PackageD | >= 0.0.0 |");
        expect(result).toContain("| PackageE | Top Level | 1.0.0 | 1.0.0 | Legacy | Z.PackageE | >= 0.0.0 |");
    });

    it("should return a detailed markdown view for a given configuration when transitivePackages is empty", async () => {
        const configuration: Configuration = {
            parameters: "--deprecated",
            version: 1,
            sources: [],
            projects: [
                {
                    path: "/path/to/project.csproj",
                    frameworks: [
                        {
                            framework: "net5.0",
                            topLevelPackages: [
                                {
                                    id: "PackageA",
                                    requestedVersion: "1.0.0",
                                    resolvedVersion: "1.0.0",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageA",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageB",
                                    requestedVersion: "1.0.0-foo",
                                    resolvedVersion: "1.0.0-foo",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageB",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageC",
                                    requestedVersion: "1.0.0",
                                    resolvedVersion: "1.0.0",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageC",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageD",
                                    requestedVersion: "1.0.0-foo",
                                    resolvedVersion: "1.0.0-foo",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageD",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageE",
                                    requestedVersion: "1.0.0",
                                    resolvedVersion: "1.0.0",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageE",
                                        versionRange: ">= 0.0.0"
                                    }
                                }
                            ],
                            transitivePackages: []
                        }
                    ]
                }
            ]
        };

        const debugMock = jest.fn();
        const infoMock = jest.fn();
        jest.doMock("@actions/core", () => ({ debug: debugMock, info: infoMock }));

        const getFileNameMock = jest.fn().mockReturnValue("project.csproj");
        jest.doMock("../../src/helpers/pathHelper", () => ({getFileName: getFileNameMock}));

        const { getDetailedBody } = await import("../../src/services/summaryService");
        const result = getDetailedBody(configuration);

        expect(infoMock).toHaveBeenCalledWith("Generating detailed view...");
        expect(getFileNameMock).toHaveBeenCalledWith("/path/to/project.csproj");
        expect(debugMock).toHaveBeenCalledWith("Generated detailed view " +
            "## project.csproj\n" +
            "\n" +
            "### net5.0\n" +
            "\n" +
            "| Package name | Type | Request version | Resolved version | Deprecation reasons | Alternative package name | Alternative package version range |\n" +
            "|---|---|---:|---:|---|---|---:|\n" +
            "| PackageA | Top Level | 1.0.0 | 1.0.0 | Legacy | Z.PackageA | >= 0.0.0 |\n" +
            "| PackageB | Top Level | 1.0.0-foo | 1.0.0-foo | Legacy | Z.PackageB | >= 0.0.0 |\n" +
            "| PackageC | Top Level | 1.0.0 | 1.0.0 | Legacy | Z.PackageC | >= 0.0.0 |\n" +
            "| PackageD | Top Level | 1.0.0-foo | 1.0.0-foo | Legacy | Z.PackageD | >= 0.0.0 |\n" +
            "| PackageE | Top Level | 1.0.0 | 1.0.0 | Legacy | Z.PackageE | >= 0.0.0 |\n\n");
        expect(result).toContain("## project.csproj");
        expect(result).toContain("### net5.0");
        expect(result).toContain("| Package name | Type | Request version | Resolved version | Deprecation reasons | Alternative package name | Alternative package version range |");
        expect(result).toContain("|---|---|---:|---:|---|---|---:|");
        expect(result).toContain("| PackageA | Top Level | 1.0.0 | 1.0.0 | Legacy | Z.PackageA | >= 0.0.0 |");
        expect(result).toContain("| PackageB | Top Level | 1.0.0-foo | 1.0.0-foo | Legacy | Z.PackageB | >= 0.0.0 |");
        expect(result).toContain("| PackageC | Top Level | 1.0.0 | 1.0.0 | Legacy | Z.PackageC | >= 0.0.0 |");
        expect(result).toContain("| PackageD | Top Level | 1.0.0-foo | 1.0.0-foo | Legacy | Z.PackageD | >= 0.0.0 |");
        expect(result).toContain("| PackageE | Top Level | 1.0.0 | 1.0.0 | Legacy | Z.PackageE | >= 0.0.0 |");
    });

    it("should return a message indicating all frameworks contains no items", async () => {
        const configuration: Configuration = {
            parameters: "--deprecated",
            version: 1,
            sources: [],
            projects: [
                {
                    path: "/path/to/project.csproj",
                    frameworks: undefined
                }
            ]
        };

        const debugMock = jest.fn();
        const infoMock = jest.fn();
        jest.doMock("@actions/core", () => ({ debug: debugMock, info: infoMock }));

        const getFileNameMock = jest.fn().mockReturnValue("project.csproj");
        jest.doMock("../../src/helpers/pathHelper", () => ({ getFileName: getFileNameMock }));

        const { getDetailedBody } = await import("../../src/services/summaryService");
        const result = getDetailedBody(configuration);

        expect(infoMock).toHaveBeenCalledWith("Generating detailed view...");
        expect(debugMock).toHaveBeenCalledWith("Generated detailed view No deprecated packages found");
        expect(result).toContain("No deprecated packages found");
    });

    it("should return a message indicating all packages are up-to-date when there are no updates", async () => {
        const configuration: Configuration = {
            parameters: "--deprecated",
            version: 1,
            sources: [],
            projects: [
                {
                    path: "/path/to/project.csproj",
                    frameworks: []
                }
            ]
        };

        const debugMock = jest.fn();
        const infoMock = jest.fn();
        jest.doMock("@actions/core", () => ({ debug: debugMock, info: infoMock }));

        const getFileNameMock = jest.fn().mockReturnValue("project.csproj");
        jest.doMock("../../src/helpers/pathHelper", () => ({ getFileName: getFileNameMock }));

        const { getDetailedBody } = await import("../../src/services/summaryService");
        const result = getDetailedBody(configuration);

        expect(infoMock).toHaveBeenCalledWith("Generating detailed view...");
        expect(debugMock).toHaveBeenCalledWith("Generated detailed view No deprecated packages found");
        expect(result).toContain("No deprecated packages found");
    });

    it("should return an empty detailed view when there are no projects", async () => {
        const configuration: Configuration = {
            parameters: "--deprecated",
            version: 1,
            sources: [],
            projects: []
        };

        const debugMock = jest.fn();
        const infoMock = jest.fn();
        jest.doMock("@actions/core", () => ({ debug: debugMock, info: infoMock }));

        const { getDetailedBody } = await import("../../src/services/summaryService");
        const result = getDetailedBody(configuration);

        expect(infoMock).toHaveBeenCalledWith("Generating detailed view...");
        expect(debugMock).toHaveBeenCalledWith("Generated detailed view No deprecated packages found");
        expect(result).toContain("No deprecated packages found");
    });
});

describe("getSummaryBody", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
    });

    it("should return a summary markdown view", async () => {
        const configuration: Configuration = {
            parameters: "--deprecated",
            version: 1,
            sources: [],
            projects: [
                {
                    path: "/path/to/project.csproj",
                    frameworks: [
                        {
                            framework: "net5.0",
                            topLevelPackages: [
                                {
                                    id: "PackageA",
                                    requestedVersion: "1.0.0",
                                    resolvedVersion: "1.0.0",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageA",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageB",
                                    requestedVersion: "1.0.0-foo",
                                    resolvedVersion: "1.0.0-foo",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageB",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageC",
                                    requestedVersion: "1.0.0",
                                    resolvedVersion: "1.0.0",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageC",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageD",
                                    requestedVersion: "1.0.0-foo",
                                    resolvedVersion: "1.0.0-foo",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageD",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageE",
                                    requestedVersion: "1.0.0",
                                    resolvedVersion: "1.0.0",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageE",
                                        versionRange: ">= 0.0.0"
                                    }
                                }
                            ],
                            transitivePackages: [
                                {
                                    id: "PackageF",
                                    resolvedVersion: "1.0.0-foo",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageF",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageG",
                                    resolvedVersion: "1.0.0-foo",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageG",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageH",
                                    resolvedVersion: "1.0.0",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageH",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageI",
                                    resolvedVersion: "1.0.1",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageI",
                                        versionRange: ">= 0.0.0"
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        };

        const debugMock = jest.fn();
        const infoMock = jest.fn();
        jest.doMock("@actions/core", () => ({ debug: debugMock, info: infoMock }));

        const getFileNameMock = jest.fn().mockReturnValue("project.csproj");
        jest.doMock("../../src/helpers/pathHelper", () => ({getFileName: getFileNameMock}));

        const { getSummaryBody } = await import("../../src/services/summaryService");
        const result = getSummaryBody(configuration);

        expect(infoMock).toHaveBeenCalledWith("Generating summary view...");
        expect(getFileNameMock).toHaveBeenCalledWith("/path/to/project.csproj");
        expect(debugMock).toHaveBeenCalledWith("Generated summary view " +
            "| Project Name | Type | Count |\n" +
            "|----|----|---:|\n" +
            "| project.csproj | Top Level | 5 |\n" +
            "| project.csproj | Transitive | 4 |\n");
        expect(result).toContain("| Project Name | Type | Count |");
        expect(result).toContain("|----|----|---:|");
        expect(result).toContain("| project.csproj | Top Level | 5 |");
        expect(result).toContain("| project.csproj | Transitive | 4 |");
    });

    it("should return a summary markdown with the distinct count when multiple frameworks have the same deprecated packages", async () => {
        const configuration: Configuration = {
            parameters: "--deprecated",
            version: 1,
            sources: [],
            projects: [
                {
                    path: "/path/to/project.csproj",
                    frameworks: [
                        {
                            framework: "net5.0",
                            topLevelPackages: [
                                {
                                    id: "PackageA",
                                    requestedVersion: "1.0.0",
                                    resolvedVersion: "1.0.0",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageA",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageB",
                                    requestedVersion: "1.0.0-foo",
                                    resolvedVersion: "1.0.0-foo",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageB",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageC",
                                    requestedVersion: "1.0.0",
                                    resolvedVersion: "1.0.0",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageC",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageD",
                                    requestedVersion: "1.0.0-foo",
                                    resolvedVersion: "1.0.0-foo",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageD",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageE",
                                    requestedVersion: "1.0.0",
                                    resolvedVersion: "1.0.0",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageE",
                                        versionRange: ">= 0.0.0"
                                    }
                                }
                            ],
                            transitivePackages: [
                                {
                                    id: "PackageF",
                                    resolvedVersion: "1.0.0-foo",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageF",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageG",
                                    resolvedVersion: "1.0.0-foo",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageG",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageH",
                                    resolvedVersion: "1.0.0",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageH",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageI",
                                    resolvedVersion: "1.0.1",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageI",
                                        versionRange: ">= 0.0.0"
                                    }
                                }
                            ]
                        },
                        {
                            framework: "net6.0",
                            topLevelPackages: [
                                {
                                    id: "PackageA",
                                    requestedVersion: "1.0.0",
                                    resolvedVersion: "1.0.0",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageA",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageB",
                                    requestedVersion: "1.0.0-foo",
                                    resolvedVersion: "1.0.0-foo",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageB",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageC",
                                    requestedVersion: "1.0.0",
                                    resolvedVersion: "1.0.0",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageC",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageD",
                                    requestedVersion: "1.0.0-foo",
                                    resolvedVersion: "1.0.0-foo",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageD",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageE",
                                    requestedVersion: "1.0.0",
                                    resolvedVersion: "1.0.0",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageE",
                                        versionRange: ">= 0.0.0"
                                    }
                                }
                            ],
                            transitivePackages: [
                                {
                                    id: "PackageF",
                                    resolvedVersion: "1.0.0-foo",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageF",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageG",
                                    resolvedVersion: "1.0.0-foo",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageG",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageH",
                                    resolvedVersion: "1.0.0",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageH",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageI",
                                    resolvedVersion: "1.0.1",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageI",
                                        versionRange: ">= 0.0.0"
                                    }
                                }
                            ]
                        },
                        {
                            framework: "net7.0",
                            topLevelPackages: [
                                {
                                    id: "PackageA",
                                    requestedVersion: "1.0.0",
                                    resolvedVersion: "1.0.0",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageA",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageB",
                                    requestedVersion: "1.0.0-foo",
                                    resolvedVersion: "1.0.0-foo",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageB",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageC",
                                    requestedVersion: "1.0.0",
                                    resolvedVersion: "1.0.0",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageC",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageD",
                                    requestedVersion: "1.0.0-foo",
                                    resolvedVersion: "1.0.0-foo",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageD",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageE",
                                    requestedVersion: "1.0.0",
                                    resolvedVersion: "1.0.0",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageE",
                                        versionRange: ">= 0.0.0"
                                    }
                                }
                            ],
                            transitivePackages: [
                                {
                                    id: "PackageF",
                                    resolvedVersion: "1.0.0-foo",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageF",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageG",
                                    resolvedVersion: "1.0.0-foo",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageG",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageH",
                                    resolvedVersion: "1.0.0",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageH",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageI",
                                    resolvedVersion: "1.0.1",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageI",
                                        versionRange: ">= 0.0.0"
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        };

        const debugMock = jest.fn();
        const infoMock = jest.fn();
        jest.doMock("@actions/core", () => ({ debug: debugMock, info: infoMock }));

        const getFileNameMock = jest.fn().mockReturnValue("project.csproj");
        jest.doMock("../../src/helpers/pathHelper", () => ({getFileName: getFileNameMock}));

        const { getSummaryBody } = await import("../../src/services/summaryService");
        const result = getSummaryBody(configuration);

        expect(infoMock).toHaveBeenCalledWith("Generating summary view...");
        expect(getFileNameMock).toHaveBeenCalledWith("/path/to/project.csproj");
        expect(debugMock).toHaveBeenCalledWith("Generated summary view " +
            "| Project Name | Type | Count |\n" +
            "|----|----|---:|\n" +
            "| project.csproj | Top Level | 5 |\n" +
            "| project.csproj | Transitive | 4 |\n");
        expect(result).toContain("| Project Name | Type | Count |");
        expect(result).toContain("|----|----|---:|");
        expect(result).toContain("| project.csproj | Top Level | 5 |");
        expect(result).toContain("| project.csproj | Transitive | 4 |");
    });

    it("should return a summary markdown view excluding transitive dependencies", async () => {
        const configuration: Configuration = {
            parameters: "--deprecated",
            version: 1,
            sources: [],
            projects: [
                {
                    path: "/path/to/project.csproj",
                    frameworks: [
                        {
                            framework: "net5.0",
                            topLevelPackages: [
                                {
                                    id: "PackageA",
                                    requestedVersion: "1.0.0",
                                    resolvedVersion: "1.0.0",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageA",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageB",
                                    requestedVersion: "1.0.0-foo",
                                    resolvedVersion: "1.0.0-foo",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageB",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageC",
                                    requestedVersion: "1.0.0",
                                    resolvedVersion: "1.0.0",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageC",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageD",
                                    requestedVersion: "1.0.0-foo",
                                    resolvedVersion: "1.0.0-foo",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageD",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageE",
                                    requestedVersion: "1.0.0",
                                    resolvedVersion: "1.0.0",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageE",
                                        versionRange: ">= 0.0.0"
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        };

        const debugMock = jest.fn();
        const infoMock = jest.fn();
        jest.doMock("@actions/core", () => ({ debug: debugMock, info: infoMock }));

        const getFileNameMock = jest.fn().mockReturnValue("project.csproj");
        jest.doMock("../../src/helpers/pathHelper", () => ({getFileName: getFileNameMock}));

        const { getSummaryBody } = await import("../../src/services/summaryService");
        const result = getSummaryBody(configuration);

        expect(infoMock).toHaveBeenCalledWith("Generating summary view...");
        expect(getFileNameMock).toHaveBeenCalledWith("/path/to/project.csproj");
        expect(debugMock).toHaveBeenCalledWith("Generated summary view " +
          "| Project Name | Type | Count |\n" +
          "|----|----|---:|\n" +
          "| project.csproj | Top Level | 5 |\n");
        expect(result).toContain("| Project Name | Type | Count |");
        expect(result).toContain("|----|----|---:|");
        expect(result).toContain("| project.csproj | Top Level | 5 |");
    });

    it("should return a summary markdown view excluding top level dependencies", async () => {
        const configuration: Configuration = {
            parameters: "--deprecated",
            version: 1,
            sources: [],
            projects: [
                {
                    path: "/path/to/project.csproj",
                    frameworks: [
                        {
                            framework: "net5.0",
                            transitivePackages: [
                                {
                                    id: "PackageF",
                                    resolvedVersion: "1.0.0-foo",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageF",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageG",
                                    resolvedVersion: "1.0.0-foo",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageG",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageH",
                                    resolvedVersion: "1.0.0",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageH",
                                        versionRange: ">= 0.0.0"
                                    }
                                },
                                {
                                    id: "PackageI",
                                    resolvedVersion: "1.0.1",
                                    deprecationReasons: [
                                        "Legacy"
                                    ],
                                    alternativePackage: {
                                        id: "Z.PackageI",
                                        versionRange: ">= 0.0.0"
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        };

        const debugMock = jest.fn();
        const infoMock = jest.fn();
        jest.doMock("@actions/core", () => ({ debug: debugMock, info: infoMock }));

        const getFileNameMock = jest.fn().mockReturnValue("project.csproj");
        jest.doMock("../../src/helpers/pathHelper", () => ({getFileName: getFileNameMock}));

        const { getSummaryBody } = await import("../../src/services/summaryService");
        const result = getSummaryBody(configuration);

        expect(infoMock).toHaveBeenCalledWith("Generating summary view...");
        expect(getFileNameMock).toHaveBeenCalledWith("/path/to/project.csproj");
        expect(debugMock).toHaveBeenCalledWith("Generated summary view " +
          "| Project Name | Type | Count |\n" +
          "|----|----|---:|\n" +
          "| project.csproj | Transitive | 4 |\n");
        expect(result).toContain("| Project Name | Type | Count |");
        expect(result).toContain("|----|----|---:|");
        expect(result).toContain("| project.csproj | Transitive | 4 |");
    });

    it("should return a string indicating frameworks all packages are up-to-date", async () => {
        const configuration: Configuration = {
            parameters: "--deprecated",
            version: 1,
            sources: [],
            projects: [
                {
                    path: "/path/to/project.csproj"
                }
            ]
        };

        const debugMock = jest.fn();
        const infoMock = jest.fn();
        jest.doMock("@actions/core", () => ({ debug: debugMock, info: infoMock }));

        const getFileNameMock = jest.fn().mockReturnValue("project.csproj");
        jest.doMock("../../src/helpers/pathHelper", () => ({getFileName: getFileNameMock}));

        const { getSummaryBody } = await import("../../src/services/summaryService");
        const result = getSummaryBody(configuration);

        expect(infoMock).toHaveBeenCalledWith("Generating summary view...");
        expect(debugMock).toHaveBeenCalledWith("Generated summary view No deprecated packages found");
        expect(result).toContain("No deprecated packages found");
    });
});

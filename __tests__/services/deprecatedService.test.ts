import {
    Configuration
} from "../../src/types/configuration";

describe("run", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
    });

    it("should create message and call methods to create check and comment", async () => {
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
        const listDeprecatedPackagesMock = jest.fn();
        listDeprecatedPackagesMock.mockReturnValue(Promise.resolve(configuration));
        jest.doMock("../../src/services/dotnetService", () => ({ listDeprecatedPackages: listDeprecatedPackagesMock }));

        const detailedBody = "# .Net Deprecated";
        const getDetailedBodyMock = jest.fn();
        getDetailedBodyMock.mockReturnValue(detailedBody);
        const summaryBody = "# .Net Deprecated";
        const getSummaryBodyMock = jest.fn();
        getSummaryBodyMock.mockReturnValue(summaryBody);
        jest.doMock("../../src/services/summaryService", () => ({ getDetailedBody: getDetailedBodyMock, getSummaryBody: getSummaryBodyMock }));

        const addCommentMock = jest.fn();
        addCommentMock.mockReturnValue(Promise.resolve);
        const createCheckRunMock = jest.fn();
        createCheckRunMock.mockReturnValue(Promise.resolve);
        jest.doMock("../../src/services/githubService", () => ({ addComment: addCommentMock, createCheckRun: createCheckRunMock }));

        const { run } = await import("../../src/services/deprecatedService");
        await run();

        expect(getDetailedBodyMock).toHaveBeenCalledWith(configuration);
        expect(getSummaryBodyMock).toHaveBeenCalledWith(configuration);
        expect(createCheckRunMock).toHaveBeenCalledWith(summaryBody, detailedBody, true);
        expect(addCommentMock).toHaveBeenCalledWith(detailedBody);
    });

    it("should catch exceptions and fail execution", async () => {
        const setFailedMock = jest.fn();
        jest.doMock("@actions/core", () => ({ setFailed: setFailedMock }));

        const errorMessage = "Error message";

        const listDeprecatedPackagesMock = jest.fn();
        listDeprecatedPackagesMock.mockImplementation(() => { throw new Error(errorMessage); });
        jest.doMock("../../src/services/dotnetService", () => ({ listDeprecatedPackages: listDeprecatedPackagesMock }));

        jest.doMock("../../src/services/summaryService", () => {});

        jest.doMock("../../src/services/githubService", () => {});

        const { run } = await import("../../src/services/deprecatedService");
        await run();

        expect(setFailedMock).toHaveBeenCalledTimes(1);
        expect(setFailedMock).toHaveBeenCalledWith(errorMessage);
    });
});

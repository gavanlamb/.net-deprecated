import {
    when
} from "jest-when";
import {
    Configuration
} from "../../src/types/configuration";

describe("listDeprecatedPackages", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
    });

    it("should be called with all arguments when specified", async () => {
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
        const dotnetFrameworks = ['net5.0', 'net6.0'];
        const exitCode = 0;
        const includeTransitiveDependencies = true;
        const nugetSources = ['source1', 'source2'];
        const nugetConfigFile = 'nuget.config';
        const stdout = JSON.stringify(configuration);
        const target = "target";

        const debugMock = jest.fn();
        const infoMock = jest.fn();
        jest.doMock("@actions/core", () => ({ debug: debugMock, info: infoMock }));

        const getStringInputMock = jest.fn();
        when(getStringInputMock).calledWith('target').mockImplementationOnce(() => target);
        when(getStringInputMock).calledWith('nuget-config-file-path').mockImplementationOnce(() => nugetConfigFile);
        const getBooleanInputMock = jest.fn();
        when(getBooleanInputMock).calledWith('include-transitive-dependencies', false).mockReturnValueOnce(includeTransitiveDependencies);
        const getStringArrayInputMock = jest.fn();
        when(getStringArrayInputMock).calledWith('nuget-sources').mockReturnValueOnce(nugetSources);
        when(getStringArrayInputMock).calledWith('frameworks').mockReturnValueOnce(dotnetFrameworks);
        jest.doMock("../../src/helpers/inputHelper", () => ({ getBooleanInput: getBooleanInputMock, getStringArrayInput: getStringArrayInputMock, getStringInput: getStringInputMock }));

        const getExecOutputMock = jest.fn();
        getExecOutputMock.mockReturnValue({ exitCode, stdout });
        jest.doMock("@actions/exec", () => ({ getExecOutput: getExecOutputMock }));

        const expectedArgs = [
            'list',
            target,
            'package',
            '--deprecated',
            '--include-transitive',
            '--source',
            'source1',
            '--source',
            'source2',
            '--config',
            'nuget.config',
            '--framework',
            'net5.0',
            '--framework',
            'net6.0',
            '--format',
            'json',
            '--verbosity',
            'q'
        ];

        const { listDeprecatedPackages } = await import("../../src/services/dotnetService");
        const result = await listDeprecatedPackages();

        expect(getStringInputMock).toHaveBeenCalledWith('target');
        expect(getStringInputMock).toHaveBeenCalledWith('nuget-config-file-path');
        expect(getBooleanInputMock).toHaveBeenCalledWith('include-transitive-dependencies', false);
        expect(getStringArrayInputMock).toHaveBeenCalledWith('nuget-sources');
        expect(getStringArrayInputMock).toHaveBeenCalledWith('frameworks');
        expect(infoMock).toHaveBeenCalledWith("Determining deprecated packages...");
        expect(debugMock).toHaveBeenCalledWith(`Going to execute "dotnet ${expectedArgs.join(" ")}"`);
        expect(getExecOutputMock).toHaveBeenCalledWith('dotnet', expectedArgs, { silent: true });
        expect(debugMock).toHaveBeenCalledWith(`Executed "dotnet ${expectedArgs.join(" ")}" and the status code is ${exitCode}`);
        expect(debugMock).toHaveBeenCalledWith(`Executed "dotnet ${expectedArgs.join(" ")}" and the output is ${stdout}`);
        expect(result).toStrictEqual(configuration);
    });

    it("should be called with basic arguments when specified", async () => {
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
        const dotnetFrameworks: string[] = [];
        const exitCode = 0;
        const includeTransitiveDependencies = false;
        const nugetSources: string[] = [];
        const nugetConfigFile = null;
        const stdout = JSON.stringify(configuration);
        const target = null;

        const debugMock = jest.fn();
        const infoMock = jest.fn();
        jest.doMock("@actions/core", () => ({ debug: debugMock, info: infoMock }));

        const getStringInputMock = jest.fn();
        when(getStringInputMock).calledWith('target').mockImplementationOnce(() => target);
        when(getStringInputMock).calledWith('nuget-config-file-path').mockImplementationOnce(() => nugetConfigFile);
        const getBooleanInputMock = jest.fn();
        when(getBooleanInputMock).calledWith('include-transitive-dependencies', false).mockReturnValueOnce(includeTransitiveDependencies);
        const getStringArrayInputMock = jest.fn();
        when(getStringArrayInputMock).calledWith('nuget-sources').mockReturnValueOnce(nugetSources);
        when(getStringArrayInputMock).calledWith('frameworks').mockReturnValueOnce(dotnetFrameworks);
        jest.doMock("../../src/helpers/inputHelper", () => ({ getBooleanInput: getBooleanInputMock, getStringArrayInput: getStringArrayInputMock, getStringInput: getStringInputMock }));

        const getExecOutputMock = jest.fn();
        getExecOutputMock.mockReturnValue({ exitCode, stdout });
        jest.doMock("@actions/exec", () => ({ getExecOutput: getExecOutputMock }));

        const expectedArgs = [
            'list',
            'package',
            '--deprecated',
            '--format',
            'json',
            '--verbosity',
            'q'
        ];

        const { listDeprecatedPackages } = await import("../../src/services/dotnetService");
        const result = await listDeprecatedPackages();

        expect(getStringInputMock).toHaveBeenCalledWith('target');
        expect(getStringInputMock).toHaveBeenCalledWith('nuget-config-file-path');
        expect(getBooleanInputMock).toHaveBeenCalledWith('include-transitive-dependencies', false);
        expect(getStringArrayInputMock).toHaveBeenCalledWith('nuget-sources');
        expect(getStringArrayInputMock).toHaveBeenCalledWith('frameworks');
        expect(debugMock).toHaveBeenCalledWith(`Going to execute "dotnet ${expectedArgs.join(" ")}"`);
        expect(getExecOutputMock).toHaveBeenCalledWith('dotnet', expectedArgs, { silent: true });
        expect(infoMock).toHaveBeenCalledWith("Determining deprecated packages...");
        expect(debugMock).toHaveBeenCalledWith(`Executed "dotnet ${expectedArgs.join(" ")}" and the status code is ${exitCode}`);
        expect(debugMock).toHaveBeenCalledWith(`Executed "dotnet ${expectedArgs.join(" ")}" and the output is ${stdout}`);
        expect(result).toStrictEqual(configuration);
    });

    it("should throw an error when exit code is not 0", async () => {
        const dotnetFrameworks: string[] = [];
        const exitCode = 1;
        const includeTransitiveDependencies = false;
        const nugetSources: string[] = [];
        const nugetConfigFile = null;
        const stderr = "Error encountered";
        const target = null;

        const debugMock = jest.fn();
        const infoMock = jest.fn();
        jest.doMock("@actions/core", () => ({ debug: debugMock, info: infoMock }));

        const getStringInputMock = jest.fn();
        when(getStringInputMock).calledWith('target').mockImplementationOnce(() => target);
        when(getStringInputMock).calledWith('nuget-config-file-path').mockImplementationOnce(() => nugetConfigFile);
        const getBooleanInputMock = jest.fn();
        when(getBooleanInputMock).calledWith('include-transitive-dependencies', false).mockReturnValueOnce(includeTransitiveDependencies);
        const getStringArrayInputMock = jest.fn();
        when(getStringArrayInputMock).calledWith('nuget-sources').mockReturnValueOnce(nugetSources);
        when(getStringArrayInputMock).calledWith('frameworks').mockReturnValueOnce(dotnetFrameworks);
        jest.doMock("../../src/helpers/inputHelper", () => ({ getBooleanInput: getBooleanInputMock, getStringArrayInput: getStringArrayInputMock, getStringInput: getStringInputMock }));

        const getExecOutputMock = jest.fn();
        getExecOutputMock.mockReturnValue({ exitCode, stderr });
        jest.doMock("@actions/exec", () => ({ getExecOutput: getExecOutputMock }));

        const expectedArgs = [
            'list',
            'package',
            '--deprecated',
            '--format',
            'json',
            '--verbosity',
            'q'
        ];

        const { listDeprecatedPackages } = await import("../../src/services/dotnetService");
        const result = listDeprecatedPackages();

        await expect(result).rejects.toThrow(stderr);
        expect(getStringInputMock).toHaveBeenCalledWith('target');
        expect(getStringInputMock).toHaveBeenCalledWith('nuget-config-file-path');
        expect(getBooleanInputMock).toHaveBeenCalledWith('include-transitive-dependencies', false);
        expect(getStringArrayInputMock).toHaveBeenCalledWith('nuget-sources');
        expect(getStringArrayInputMock).toHaveBeenCalledWith('frameworks');
        expect(infoMock).toHaveBeenCalledWith("Determining deprecated packages...");
        expect(debugMock).toHaveBeenCalledWith(`Going to execute "dotnet ${expectedArgs.join(" ")}"`);
        expect(getExecOutputMock).toHaveBeenCalledWith('dotnet', expectedArgs, { silent: true });
        expect(debugMock).toHaveBeenCalledWith(`Executed "dotnet ${expectedArgs.join(" ")}" and the status code is ${exitCode}`);
        expect(debugMock).toHaveBeenCalledWith(`Executed "dotnet ${expectedArgs.join(" ")}" and the output is ${stderr}`);
    });

    it("should throw an DotnetCommandProblemError when there are problems", async () => {
        const configuration: Configuration = {
            parameters: "--deprecated",
            version: 1,
            sources: [],
            problems: [
                {
                    project: "/home/runner/work/serilog/serilog/tests/Project.A/Project.A.csproj",
                    level: "error",
                    text: "No assets file was found for `/home/runner/work/serilog/serilog/tests/Project.A/Project.A.csproj`. Please run restore before running this command."
                }
            ],
            projects: [
                {
                    path: "/path/to/project.csproj"
                }
            ]
        };
        const dotnetFrameworks = ['net5.0', 'net6.0'];
        const exitCode = 1;
        const includeTransitiveDependencies = true;
        const nugetSources = ['source1', 'source2'];
        const nugetConfigFile = 'nuget.config';
        const stderr = JSON.stringify(configuration);
        const target = "target";

        const debugMock = jest.fn();
        const infoMock = jest.fn();
        jest.doMock("@actions/core", () => ({ debug: debugMock, info: infoMock }));

        const getStringInputMock = jest.fn();
        when(getStringInputMock).calledWith('target').mockImplementationOnce(() => target);
        when(getStringInputMock).calledWith('nuget-config-file-path').mockImplementationOnce(() => nugetConfigFile);
        const getBooleanInputMock = jest.fn();
        when(getBooleanInputMock).calledWith('include-transitive-dependencies', false).mockReturnValueOnce(includeTransitiveDependencies);
        const getStringArrayInputMock = jest.fn();
        when(getStringArrayInputMock).calledWith('nuget-sources').mockReturnValueOnce(nugetSources);
        when(getStringArrayInputMock).calledWith('frameworks').mockReturnValueOnce(dotnetFrameworks);
        jest.doMock("../../src/helpers/inputHelper", () => ({ getBooleanInput: getBooleanInputMock, getStringArrayInput: getStringArrayInputMock, getStringInput: getStringInputMock }));

        const getExecOutputMock = jest.fn();
        getExecOutputMock.mockReturnValue({ exitCode, stderr });
        jest.doMock("@actions/exec", () => ({ getExecOutput: getExecOutputMock }));

        const expectedArgs = [
            'list',
            target,
            'package',
            '--deprecated',
            '--include-transitive',
            '--source',
            'source1',
            '--source',
            'source2',
            '--config',
            'nuget.config',
            '--framework',
            'net5.0',
            '--framework',
            'net6.0',
            '--format',
            'json',
            '--verbosity',
            'q'
        ];

        const { listDeprecatedPackages } = await import("../../src/services/dotnetService");
        const result = listDeprecatedPackages();

        await expect(result).rejects.toThrow("No assets file was found for `Project.A`. Please run restore before running this command.");
        expect(getStringInputMock).toHaveBeenCalledWith('target');
        expect(getStringInputMock).toHaveBeenCalledWith('nuget-config-file-path');
        expect(getBooleanInputMock).toHaveBeenCalledWith('include-transitive-dependencies', false);
        expect(getStringArrayInputMock).toHaveBeenCalledWith('nuget-sources');
        expect(getStringArrayInputMock).toHaveBeenCalledWith('frameworks');
        expect(infoMock).toHaveBeenCalledWith("Determining deprecated packages...");
        expect(debugMock).toHaveBeenCalledWith(`Going to execute "dotnet ${expectedArgs.join(" ")}"`);
        expect(getExecOutputMock).toHaveBeenCalledWith('dotnet', expectedArgs, { silent: true });
        expect(debugMock).toHaveBeenCalledWith(`Executed "dotnet ${expectedArgs.join(" ")}" and the status code is ${exitCode}`);
        expect(debugMock).toHaveBeenCalledWith(`Executed "dotnet ${expectedArgs.join(" ")}" and the output is ${stderr}`);
    });
});

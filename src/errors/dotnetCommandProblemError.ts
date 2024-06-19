/**
 * Error indicating a dotnet deprecated command problem
 */
class DotnetCommandProblemError extends Error {
    projectName: string;

    constructor(projectName: string, message: string) {
        super(message);
        this.name = 'DotnetCommandProblemError';
        this.projectName = projectName;
    }
}

export {
    DotnetCommandProblemError
};
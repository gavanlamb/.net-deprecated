import {
    setFailed
} from "@actions/core";
import {
    createCheckRun,
    addComment
} from "./githubService";
import {
    listDeprecatedPackages
} from "./dotnetService";
import {
    getDetailedBody,
    getSummaryBody
} from "./summaryService";

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run(): Promise<void>
{
    try
    {
        const deprecatedResponse = await listDeprecatedPackages();

        const summaryBody = getSummaryBody(
            deprecatedResponse);

        const detailedBody = getDetailedBody(
            deprecatedResponse);

        const anyDeprecatedPackages = deprecatedResponse
            .projects
            .filter(project => !!project.frameworks)
            .flatMap(project => project.frameworks)
            .filter(framework => !!framework)
            .flatMap(framework => framework!.topLevelPackages)
            .filter(topLevelPackages => !!topLevelPackages)
            .length > 0;

        await createCheckRun(
            summaryBody,
            detailedBody,
            anyDeprecatedPackages);


        await addComment(
            detailedBody);

    } catch (error) {
        if (error instanceof Error)
            setFailed(error.message);
    }
}

export {
    run
};

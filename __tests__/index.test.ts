describe("default", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
    });

    it("should call run when loaded", async () => {
        const runMock = jest.fn();
        jest.doMock("../src/services/deprecatedService", () => ({ run: runMock }));

        await import("../src/index");

        expect(runMock).toHaveBeenCalledTimes(1);
    });
});

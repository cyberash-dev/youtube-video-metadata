module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	collectCoverage: true,
	coverageDirectory: "coverage",
	testMatch: ["**/tests/**/*.test.(ts|js)", "**/*.test.(ts|js)"],
	moduleFileExtensions: ["ts", "js", "json"],
	transform: {
		"^.+\\.ts$": "ts-jest",
	},
	setupFilesAfterEnv: [],
};

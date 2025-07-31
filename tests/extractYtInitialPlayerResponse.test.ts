import { readFileSync } from "fs";
import { join } from "path";
import { extractYtInitialPlayerResponse } from "../src/extractYtInitialPlayerResponse";

describe("extractYtInitialPlayerResponse", () => {
	let exampleHtml: string;

	beforeAll(() => {
		const examplePath = join(__dirname, "./example.html");
		exampleHtml = readFileSync(examplePath, "utf-8");
	});

	test("should successfully extract ytInitialPlayerResponse from example.html", () => {
		const result = extractYtInitialPlayerResponse(exampleHtml);

		expect(result).toBeTruthy();
		expect(typeof result).toBe("object");
	});

	test("should contain main YouTube response properties", () => {
		const result = extractYtInitialPlayerResponse(exampleHtml);

		expect(result).toHaveProperty("responseContext");
		expect(result).toHaveProperty("playabilityStatus");
		expect(result).toHaveProperty("streamingData");
		expect(result).toHaveProperty("videoDetails");
	});

	test("should extract correct videoDetails", () => {
		const result = extractYtInitialPlayerResponse(exampleHtml);

		expect(result).toBeTruthy();
		expect(result?.videoDetails).toBeTruthy();

		if (result?.videoDetails) {
			expect(result.videoDetails.videoId).toBe("dQw4w9WgXcQ");
			expect(result.videoDetails.title).toBe("Rick Astley - Never Gonna Give You Up (Official Video) (4K Remaster)");
			expect(result.videoDetails.author).toBe("Rick Astley");
			expect(result.videoDetails.lengthSeconds).toBe("213");
		}
	});

	test("should extract streaming information", () => {
		const result = extractYtInitialPlayerResponse(exampleHtml);

		expect(result).toBeTruthy();
		expect(result?.streamingData).toBeTruthy();

		if (result?.streamingData) {
			expect(result.streamingData.formats).toBeDefined();
			expect(Array.isArray(result.streamingData.formats)).toBe(true);
			expect(result.streamingData.adaptiveFormats).toBeDefined();
			expect(Array.isArray(result.streamingData.adaptiveFormats)).toBe(true);
		}
	});

	test("should correctly handle playabilityStatus", () => {
		const result = extractYtInitialPlayerResponse(exampleHtml);

		expect(result).toBeTruthy();
		expect(result?.playabilityStatus).toBeTruthy();

		if (result?.playabilityStatus) {
			expect(result.playabilityStatus.status).toBe("OK");
			expect(result.playabilityStatus.playableInEmbed).toBe(true);
		}
	});

	test("should return null for empty string", () => {
		const result = extractYtInitialPlayerResponse("");
		expect(result).toBeNull();
	});

	test("should return null for HTML without ytInitialPlayerResponse", () => {
		const htmlWithoutVar = "<html><head><title>Test</title></head><body>No variable here</body></html>";
		const result = extractYtInitialPlayerResponse(htmlWithoutVar);
		expect(result).toBeNull();
	});

	test("should handle different variable declaration forms", () => {
		const htmlWithWindowAssignment = `
      <html>
        <body>
          <script>
            window.ytInitialPlayerResponse = {"videoDetails": {"videoId": "test123", "title": "Test Video"}};
          </script>
        </body>
      </html>
    `;

		const result = extractYtInitialPlayerResponse(htmlWithWindowAssignment);
		expect(result).toBeTruthy();
		expect(result?.videoDetails?.videoId).toBe("test123");
		expect(result?.videoDetails?.title).toBe("Test Video");
	});

	test("should handle assignment without var/let/const", () => {
		const htmlWithDirectAssignment = `
      <html>
        <body>
          <script>
            ytInitialPlayerResponse = {"videoDetails": {"videoId": "direct123", "title": "Direct Assignment"}};
          </script>
        </body>
      </html>
    `;

		const result = extractYtInitialPlayerResponse(htmlWithDirectAssignment);
		expect(result).toBeTruthy();
		expect(result?.videoDetails?.videoId).toBe("direct123");
		expect(result?.videoDetails?.title).toBe("Direct Assignment");
	});

	test("should handle JSON string as value", () => {
		const htmlWithJsonString = `
      <html>
        <body>
          <script>
            var ytInitialPlayerResponse = '{"videoDetails": {"videoId": "json123", "title": "JSON String"}}';
          </script>
        </body>
      </html>
    `;

		const result = extractYtInitialPlayerResponse(htmlWithJsonString);
		expect(result).toBeTruthy();
		expect(result?.videoDetails?.videoId).toBe("json123");
		expect(result?.videoDetails?.title).toBe("JSON String");
	});

	test("should ignore invalid JSON strings", () => {
		const htmlWithInvalidJson = `
      <html>
        <body>
          <script>
            var ytInitialPlayerResponse = 'invalid json string';
          </script>
        </body>
      </html>
    `;

		const result = extractYtInitialPlayerResponse(htmlWithInvalidJson);
		expect(result).toBe("invalid json string");
	});

	test("should handle multiple script tags", () => {
		const htmlWithMultipleScripts = `
      <html>
        <body>
          <script>
            var someOtherVar = "not relevant";
          </script>
          <script>
            var ytInitialPlayerResponse = {"videoDetails": {"videoId": "multi123"}};
          </script>
          <script>
            var anotherVar = "also not relevant";
          </script>
        </body>
      </html>
    `;

		const result = extractYtInitialPlayerResponse(htmlWithMultipleScripts);
		expect(result).toBeTruthy();
		expect(result?.videoDetails?.videoId).toBe("multi123");
	});
});

import { getYoutubeVideoMetadata } from "../src/getYoutubeVideoMetadata";
import type { YoutubeVideoFormat } from "../src/types/YoutubeVideoFormat";
import type { YtInitialPlayerResponse } from "../src/types/YtInitialPlayerResponse";

describe("getYoutubeVideoMetadata", () => {
	test("should return null when videoDetails is missing", () => {
		const ytResponse: YtInitialPlayerResponse = {};

		const result = getYoutubeVideoMetadata(ytResponse);

		expect(result).toBeNull();
	});

	test("should return null when videoDetails is undefined", () => {
		const ytResponse: YtInitialPlayerResponse = {
			videoDetails: undefined,
		};

		const result = getYoutubeVideoMetadata(ytResponse);

		expect(result).toBeNull();
	});

	test("should successfully extract basic video metadata", () => {
		const ytResponse: YtInitialPlayerResponse = {
			videoDetails: {
				videoId: "dQw4w9WgXcQ",
				title: "Rick Astley - Never Gonna Give You Up",
				author: "Rick Astley",
				lengthSeconds: "213",
				channelId: "UCuAXFkgsw1L7xaCfnd5JJOw",
				shortDescription: "Rick Astley's official music video",
				viewCount: "1234567890",
			},
		};

		const result = getYoutubeVideoMetadata(ytResponse);

		expect(result).toBeTruthy();
		expect(result?.videoId).toBe("dQw4w9WgXcQ");
		expect(result?.title).toBe("Rick Astley - Never Gonna Give You Up");
		expect(result?.channelName).toBe("Rick Astley");
		expect(result?.lengthSeconds).toBe(213);
		expect(result?.channelId).toBe("UCuAXFkgsw1L7xaCfnd5JJOw");
		expect(result?.description).toBe("Rick Astley's official music video");
		expect(result?.viewCount).toBe(1234567890);
	});

	test("should use empty strings for missing text fields", () => {
		const ytResponse: YtInitialPlayerResponse = {
			videoDetails: {
				videoId: "test123",
				lengthSeconds: "100",
				channelId: "testChannel",
			},
		};

		const result = getYoutubeVideoMetadata(ytResponse);

		expect(result).toBeTruthy();
		expect(result?.channelName).toBe("");
		expect(result?.title).toBe("");
		expect(result?.description).toBe("");
		expect(result?.viewCount).toBeUndefined();
	});

	test("should correctly handle audio-video format", () => {
		const audioVideoFormat: YoutubeVideoFormat = {
			mimeType: 'video/mp4; codecs="avc1.640028, mp4a.40.2"',
			contentLength: "12345678",
			approxDurationMs: "213000",
			width: 1920,
			height: 1080,
			fps: 30,
			audioQuality: "AUDIO_QUALITY_MEDIUM",
			audioSampleRate: "44100",
			audioChannels: 2,
			bitrate: 2000000,
			qualityLabel: "1080p",
		};

		const ytResponse: YtInitialPlayerResponse = {
			videoDetails: {
				videoId: "test123",
				lengthSeconds: "213",
				channelId: "testChannel",
			},
			streamingData: {
				formats: [audioVideoFormat],
			},
		};

		const result = getYoutubeVideoMetadata(ytResponse);

		expect(result).toBeTruthy();
		expect(result?.streams).toHaveLength(1);

		const stream = result?.streams[0];
		expect(stream).toMatchObject({
			contentLength: "12345678",
			mimeType: 'video/mp4; codecs="avc1.640028, mp4a.40.2"',
			durationMs: 213000,
			width: 1920,
			height: 1080,
			fps: 30,
			sampleRate: 44100,
			channelsCount: 2,
		});
	});

	test("should correctly handle video-only format", () => {
		const videoOnlyFormat: YoutubeVideoFormat = {
			mimeType: 'video/mp4; codecs="avc1.640028"',
			contentLength: "8765432",
			approxDurationMs: "213000",
			width: 1280,
			height: 720,
			fps: 24,
			bitrate: 1500000,
			qualityLabel: "720p",
		};

		const ytResponse: YtInitialPlayerResponse = {
			videoDetails: {
				videoId: "test123",
				lengthSeconds: "213",
				channelId: "testChannel",
			},
			streamingData: {
				adaptiveFormats: [videoOnlyFormat],
			},
		};

		const result = getYoutubeVideoMetadata(ytResponse);

		expect(result).toBeTruthy();
		expect(result?.streams).toHaveLength(1);

		const stream = result?.streams[0];
		expect(stream).toMatchObject({
			contentLength: "8765432",
			mimeType: 'video/mp4; codecs="avc1.640028"',
			durationMs: 213000,
			width: 1280,
			height: 720,
			fps: 24,
		});
		expect(stream).not.toHaveProperty("sampleRate");
		expect(stream).not.toHaveProperty("channelsCount");
	});

	test("should correctly handle audio-only format", () => {
		const audioOnlyFormat: YoutubeVideoFormat = {
			mimeType: 'audio/mp4; codecs="mp4a.40.2"',
			contentLength: "3456789",
			approxDurationMs: "213000",
			audioQuality: "AUDIO_QUALITY_HIGH",
			audioSampleRate: "48000",
			audioChannels: 2,
			bitrate: 128000,
		};

		const ytResponse: YtInitialPlayerResponse = {
			videoDetails: {
				videoId: "test123",
				lengthSeconds: "213",
				channelId: "testChannel",
			},
			streamingData: {
				adaptiveFormats: [audioOnlyFormat],
			},
		};

		const result = getYoutubeVideoMetadata(ytResponse);

		expect(result).toBeTruthy();
		expect(result?.streams).toHaveLength(1);

		const stream = result?.streams[0];
		expect(stream).toMatchObject({
			contentLength: "3456789",
			mimeType: 'audio/mp4; codecs="mp4a.40.2"',
			durationMs: 213000,
			sampleRate: 48000,
			channelsCount: 2,
		});
		expect(stream).not.toHaveProperty("width");
		expect(stream).not.toHaveProperty("height");
		expect(stream).not.toHaveProperty("fps");
	});

	test("should handle mixed formats from formats and adaptiveFormats", () => {
		const audioVideoFormat: YoutubeVideoFormat = {
			mimeType: "video/mp4",
			contentLength: "12345678",
			width: 1920,
			height: 1080,
			fps: 30,
			audioQuality: "AUDIO_QUALITY_MEDIUM",
			audioSampleRate: "44100",
			audioChannels: 2,
			bitrate: 2000000,
			qualityLabel: "1080p",
		};

		const audioOnlyFormat: YoutubeVideoFormat = {
			mimeType: "audio/webm",
			contentLength: "2345678",
			audioQuality: "AUDIO_QUALITY_HIGH",
			audioSampleRate: "48000",
			audioChannels: 2,
			bitrate: 160000,
		};

		const ytResponse: YtInitialPlayerResponse = {
			videoDetails: {
				videoId: "test123",
				lengthSeconds: "213",
				channelId: "testChannel",
			},
			streamingData: {
				formats: [audioVideoFormat],
				adaptiveFormats: [audioOnlyFormat],
			},
		};

		const result = getYoutubeVideoMetadata(ytResponse);

		expect(result).toBeTruthy();
		expect(result?.streams).toHaveLength(2);
	});

	test("should use default values for missing audio parameters", () => {
		const audioOnlyFormat: YoutubeVideoFormat = {
			mimeType: "audio/mp4",
			contentLength: "1234567",
			audioQuality: "AUDIO_QUALITY_MEDIUM",
			bitrate: 128000,
		};

		const ytResponse: YtInitialPlayerResponse = {
			videoDetails: {
				videoId: "test123",
				lengthSeconds: "213",
				channelId: "testChannel",
			},
			streamingData: {
				adaptiveFormats: [audioOnlyFormat],
			},
		};

		const result = getYoutubeVideoMetadata(ytResponse);

		expect(result).toBeTruthy();
		expect(result?.streams).toHaveLength(1);

		const stream = result?.streams[0];
		expect(stream).toMatchObject({
			sampleRate: 44100,
			channelsCount: 2,
			durationMs: 0,
		});
	});

	test("should skip formats that don't match any type", () => {
		const invalidFormat = {
			mimeType: "application/unknown",
			contentLength: "1234567",
			bitrate: 128000,
		} as YoutubeVideoFormat;

		const validFormat: YoutubeVideoFormat = {
			mimeType: "audio/mp4",
			contentLength: "2345678",
			audioQuality: "AUDIO_QUALITY_MEDIUM",
			bitrate: 128000,
		};

		const ytResponse: YtInitialPlayerResponse = {
			videoDetails: {
				videoId: "test123",
				lengthSeconds: "213",
				channelId: "testChannel",
			},
			streamingData: {
				adaptiveFormats: [invalidFormat, validFormat],
			},
		};

		const result = getYoutubeVideoMetadata(ytResponse);

		expect(result).toBeTruthy();
		expect(result?.streams).toHaveLength(1);
		expect(result?.streams[0].mimeType).toBe("audio/mp4");
	});

	test("should return empty streams array when streamingData is missing", () => {
		const ytResponse: YtInitialPlayerResponse = {
			videoDetails: {
				videoId: "test123",
				lengthSeconds: "213",
				channelId: "testChannel",
			},
		};

		const result = getYoutubeVideoMetadata(ytResponse);

		expect(result).toBeTruthy();
		expect(result?.streams).toEqual([]);
	});

	test("should return empty streams array when formats and adaptiveFormats are missing", () => {
		const ytResponse: YtInitialPlayerResponse = {
			videoDetails: {
				videoId: "test123",
				lengthSeconds: "213",
				channelId: "testChannel",
			},
			streamingData: {},
		};

		const result = getYoutubeVideoMetadata(ytResponse);

		expect(result).toBeTruthy();
		expect(result?.streams).toEqual([]);
	});

	test("should correctly parse numeric values", () => {
		const ytResponse: YtInitialPlayerResponse = {
			videoDetails: {
				videoId: "test123",
				lengthSeconds: "600",
				channelId: "testChannel",
				viewCount: "9876543210",
			},
		};

		const result = getYoutubeVideoMetadata(ytResponse);

		expect(result).toBeTruthy();
		expect(result?.lengthSeconds).toBe(600);
		expect(result?.viewCount).toBe(9876543210);
	});

	test("should correctly parse approxDurationMs to durationMs", () => {
		const audioFormat: YoutubeVideoFormat = {
			mimeType: "audio/mp4",
			contentLength: "1234567",
			approxDurationMs: "180500",
			audioQuality: "AUDIO_QUALITY_MEDIUM",
			bitrate: 128000,
		};

		const ytResponse: YtInitialPlayerResponse = {
			videoDetails: {
				videoId: "test123",
				lengthSeconds: "180",
				channelId: "testChannel",
			},
			streamingData: {
				adaptiveFormats: [audioFormat],
			},
		};

		const result = getYoutubeVideoMetadata(ytResponse);

		expect(result).toBeTruthy();
		expect(result?.streams[0].durationMs).toBe(180500);
	});
});

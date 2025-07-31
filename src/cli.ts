#!/usr/bin/env node

import { Command } from "commander";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import utc from "dayjs/plugin/utc";
import { filesize } from "filesize";
import { URL } from "url";
import { loadYoutubeVideoMetadata } from "./loadYoutubeVideoMetadata";
import type { Stream, YoutubeVideoMetadata } from "./types/YoutubeVideoMetadata";
import { isAudioStream, isAudioVideoStream, isVideoStream } from "./types/YoutubeVideoMetadata";

dayjs.extend(duration);
dayjs.extend(utc);

const program = new Command();

const YOUTUBE_DOMAINS = [
	"youtube.com",
	"www.youtube.com",
	"m.youtube.com",
	"music.youtube.com",
	"youtu.be",
	"www.youtu.be",
];

function extractVideoId(input: string): string {
	try {
		const url = new URL(input);

		if (!YOUTUBE_DOMAINS.includes(url.hostname)) {
			throw new Error(`Unsupported domain: ${url.hostname}`);
		}

		let videoId: string | null = null;

		if (url.hostname === "youtu.be" || url.hostname === "www.youtu.be") {
			videoId = url.pathname.slice(1);
		} else if (url.pathname === "/watch") {
			videoId = url.searchParams.get("v");
		} else if (url.pathname.startsWith("/embed/")) {
			videoId = url.pathname.slice(7);
		} else if (url.pathname.startsWith("/v/")) {
			videoId = url.pathname.slice(3);
		} else if (url.pathname.startsWith("/shorts/")) {
			videoId = url.pathname.slice(8);
		} else if (url.pathname.startsWith("/live/")) {
			videoId = url.pathname.slice(6);
		}

		if (!videoId) {
			throw new Error(`Invalid or missing video ID: ${videoId}`);
		}

		return videoId;
	} catch {
		return input;
	}
}

function formatDuration(seconds: number): string {
	const duration = dayjs.duration(seconds, "seconds");
	const hours = duration.hours();

	if (hours > 0) {
		return duration.format("H:mm:ss");
	} else {
		return duration.format("m:ss");
	}
}

function formatFileSize(bytes: string): string {
	const num = parseInt(bytes);

	if (Number.isNaN(num)) {
		return bytes;
	}

	return filesize(num, {
		standard: "jedec",
		round: 1,
		locale: false,
	});
}

type DisplayVideoInfoOptions = {
	description?: boolean;
	streams?: boolean;
	urls?: boolean;
	json?: boolean;
	full?: boolean;
};

function displayVideoInfo(metadata: YoutubeVideoMetadata, options: DisplayVideoInfoOptions) {
	console.log("\n📹 Video Information:");
	console.log("─".repeat(50));
	console.log(`🆔 Video ID: ${metadata.videoId}`);
	console.log(`📝 Title: ${metadata.title}`);
	console.log(`👤 Channel: ${metadata.channelName} (${metadata.channelId})`);
	console.log(`⏱️  Duration: ${formatDuration(metadata.lengthSeconds)}`);

	if (metadata.viewCount) {
		console.log(`👀 Views: ${metadata.viewCount.toLocaleString()}`);
	}

	if (options.description && metadata.description) {
		console.log(`\n📄 Description:`);
		const desc =
			metadata.description.length > 200 && !options.full
				? `${metadata.description.substring(0, 200)}...`
				: metadata.description;
		console.log(desc);
	}

	if (options.streams && metadata.streams.length > 0) {
		console.log("\n🎬 Available Streams:");
		console.log("─".repeat(50));

		metadata.streams.forEach((stream: Stream, index: number) => {
			if (isAudioVideoStream(stream)) {
				console.log(`${index + 1}. 🎥 Video+Audio (${stream.width}x${stream.height})`);
				console.log(`   📹 FPS: ${stream.fps}`);
				console.log(`   🎵 Audio: ${stream.sampleRate}Hz, ${stream.channelsCount} channels`);
			} else if (isVideoStream(stream)) {
				console.log(`${index + 1}. 📹 Video Only (${stream.width}x${stream.height})`);
				console.log(`   📹 FPS: ${stream.fps}`);
			} else if (isAudioStream(stream)) {
				console.log(`${index + 1}. 🎵 Audio Only`);
				console.log(`   🎵 Quality: ${stream.sampleRate}Hz, ${stream.channelsCount} channels`);
			} else {
				console.log(`${index + 1}. 📁 Unknown stream type`);
			}

			console.log(`   📦 Size: ${formatFileSize(stream.contentLength)}`);
			console.log(`   🔗 Type: ${stream.mimeType}`);
			console.log(`   ⏱️  Duration: ${formatDuration(stream.durationMs / 1000)}`);
			console.log("");
		});
	}

	if (options.json) {
		console.log("\n📋 JSON Data:");
		console.log(JSON.stringify(metadata, null, 2));
	}
}

program.name("youtube-video-metadata").description("CLI for getting YouTube video metadata").version("0.0.1");

program
	.command("get")
	.description("Get YouTube video metadata")
	.argument("<video>", "YouTube video ID or URL")
	.option("-d, --description", "show video description")
	.option("-s, --streams", "show available streams")
	.option("-u, --urls", "show stream URLs (works with --streams)")
	.option("-j, --json", "output all data in JSON format")
	.option("-f, --full", "show full description (without truncation)")
	.action(async (video: string, options: DisplayVideoInfoOptions) => {
		try {
			console.log("🔍 Fetching metadata...");

			const videoId = extractVideoId(video);
			console.log(`📹 Video ID: ${videoId}`);

			const metadata = await loadYoutubeVideoMetadata(videoId);

			if (!metadata) {
				console.error("❌ Failed to get video metadata");
				console.error("🔧 Possible reasons:");
				console.error("   • Video is unavailable or deleted");
				console.error("   • Video is private");
				console.error("   • Network connection issues");
				console.error("   • YouTube changed page structure");
				process.exit(1);
			}

			displayVideoInfo(metadata, options);
		} catch (error: unknown) {
			console.error("❌ Error:", error instanceof Error ? error.message : String(error));
			process.exit(1);
		}
	});

program.parse();

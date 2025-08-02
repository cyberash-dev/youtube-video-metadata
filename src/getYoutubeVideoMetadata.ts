import { isAudioOnlyFormat, isAudioVideoFormat, isVideoOnlyFormat } from "./types/YoutubeVideoFormat";
import type { Stream, YoutubeVideoMetadata } from "./types/YoutubeVideoMetadata";
import type { YtInitialPlayerResponse } from "./types/YtInitialPlayerResponse";

export function getYoutubeVideoMetadata(ytInitialPlayerResponse: YtInitialPlayerResponse): YoutubeVideoMetadata | null {
	const { videoDetails, streamingData } = ytInitialPlayerResponse;

	if (!videoDetails) {
		return null;
	}

	const allFormats = [...(streamingData?.formats || []), ...(streamingData?.adaptiveFormats || [])];

	const baseStreamUrl = allFormats.find((format) => format.url !== undefined)?.url;

	const streams: Stream[] = allFormats
		.map((format) => {
			const baseStream = {
				contentLength: format.contentLength,
				mimeType: format.mimeType,
				durationMs: format.approxDurationMs ? parseInt(format.approxDurationMs, 10) : 0,
				itag: format.itag,
			};

			if (isAudioVideoFormat(format)) {
				return {
					...baseStream,
					width: format.width,
					height: format.height,
					fps: format.fps,
					sampleRate: format.audioSampleRate ? parseInt(format.audioSampleRate, 10) : 44100,
					channelsCount: format.audioChannels || 2,
				};
			}

			if (isVideoOnlyFormat(format)) {
				return {
					...baseStream,
					width: format.width,
					height: format.height,
					fps: format.fps,
				};
			}

			if (isAudioOnlyFormat(format)) {
				return {
					...baseStream,
					sampleRate: format.audioSampleRate ? parseInt(format.audioSampleRate, 10) : 44100,
					channelsCount: format.audioChannels || 2,
				};
			}
		})
		.filter((stream): stream is Stream => Boolean(stream));

	return {
		videoId: videoDetails.videoId,
		channelName: videoDetails.author || "",
		title: videoDetails.title || "",
		description: videoDetails.shortDescription || "",
		lengthSeconds: parseInt(videoDetails.lengthSeconds, 10),
		channelId: videoDetails.channelId,
		streams,
		viewCount: videoDetails.viewCount ? parseInt(videoDetails.viewCount, 10) : undefined,
		baseStreamUrl,
		serverAbrStreamingUrl: streamingData?.serverAbrStreamingUrl,
		videoPlaybackConfigBase64:
			ytInitialPlayerResponse.playerConfig?.mediaCommonConfig?.mediaUstreamerRequestConfig
				?.videoPlaybackUstreamerConfig,
	};
}

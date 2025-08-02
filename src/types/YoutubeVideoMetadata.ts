export type CommonStream = {
	contentLength: string;
	mimeType: string;
	durationMs: number;
	itag: number;
};

export type AudioStream = CommonStream & {
	sampleRate: number;
	channelsCount: number;
};

export type VideoStream = CommonStream & {
	width: number;
	height: number;
	fps: number;
};

export type AudioVideoStream = AudioStream & VideoStream;

export type Stream = AudioVideoStream | AudioStream | VideoStream;

export type YoutubeVideoMetadata = {
	videoId: string;
	channelName: string;
	title: string;
	description: string;
	lengthSeconds: number;
	channelId: string;
	streams: Stream[];
	viewCount?: number;
	baseStreamUrl?: string;
	videoPlaybackConfigBase64?: string;
};

export function isAudioStream(stream: Stream): stream is AudioStream {
	return "sampleRate" in stream && "channelsCount" in stream;
}

export function isVideoStream(stream: Stream): stream is VideoStream {
	return "width" in stream && "height" in stream && "fps" in stream;
}

export function isAudioVideoStream(stream: Stream): stream is AudioVideoStream {
	return isAudioStream(stream) && isVideoStream(stream);
}

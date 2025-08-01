export type BaseYoutubeVideoFormat = {
	itag: number;
	url?: string;
	mimeType: string;
	bitrate: number;
	lastModified?: string;
	contentLength: string;
	quality?: string;
	projectionType?: string;
	averageBitrate?: number;
	approxDurationMs?: string;
	signatureCipher?: string;
	cipher?: string;
	highReplication?: boolean;
	initRange?: {
		start: string;
		end: string;
	};
	indexRange?: {
		start: string;
		end: string;
	};
	xtags?: string;
	qualityOrdinal?: string;
};

export type YoutubeAudioOnlyFormat = BaseYoutubeVideoFormat & {
	audioQuality: string;
	audioSampleRate?: string;
	audioChannels?: number;
	isDrc?: boolean;
	loudnessDb?: number;
};

export type YoutubeVideoOnlyFormat = BaseYoutubeVideoFormat & {
	width: number;
	height: number;
	fps: number;
	qualityLabel: string;
	colorInfo?: {
		primaries?: string;
		transferCharacteristics?: string;
		matrixCoefficients?: string;
	};
};

export type YoutubeAudioVideoFormat = BaseYoutubeVideoFormat & {
	width: number;
	height: number;
	fps: number;
	qualityLabel: string;
	audioQuality: string;
	audioSampleRate?: string;
	audioChannels?: number;
	colorInfo?: {
		primaries?: string;
		transferCharacteristics?: string;
		matrixCoefficients?: string;
	};
};

export type YoutubeVideoFormat = YoutubeAudioOnlyFormat | YoutubeVideoOnlyFormat | YoutubeAudioVideoFormat;

export function isAudioOnlyFormat(format: YoutubeVideoFormat): format is YoutubeAudioOnlyFormat {
	return "audioQuality" in format && !("width" in format);
}

export function isVideoOnlyFormat(format: YoutubeVideoFormat): format is YoutubeVideoOnlyFormat {
	return "width" in format && !("audioQuality" in format);
}

export function isAudioVideoFormat(format: YoutubeVideoFormat): format is YoutubeAudioVideoFormat {
	return "width" in format && "audioQuality" in format;
}

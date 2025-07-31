import type { YoutubeVideoFormat } from "./YoutubeVideoFormat";

export type YtInitialPlayerResponse = {
	responseContext?: ResponseContext;
	videoDetails?: VideoDetails;
	streamingData?: StreamingData;
	playabilityStatus?: PlayabilityStatus;
	endscreen?: Endscreen;
	adPlacements?: AdPlacement[];
	adBreakHeartbeatParams?: string;
	frameworkUpdates?: FrameworkUpdates;
};

export type ResponseContext = {
	serviceTrackingParams?: ServiceTrackingParam[];
	webResponseContextExtensionData?: {
		hasDecorated?: boolean;
	};
};

export type ServiceTrackingParam = {
	service?: string;
	params?: { key: string; value: string }[];
};

export type VideoDetails = {
	videoId: string;
	title?: string;
	lengthSeconds: string;
	keywords?: string[];
	channelId: string;
	isLiveContent?: boolean;
	shortDescription?: string;
	thumbnail?: ThumbnailSet;
	allowRatings?: boolean;
	viewCount?: string;
	author?: string;
	isPrivate?: boolean;
	isUnpluggedCorpus?: boolean;
	isLiveDvrEnabled?: boolean;
	isLowLatencyLiveStream?: boolean;
	latencyClass?: string;
	musicVideoType?: string;
};

export type ThumbnailSet = {
	thumbnails?: Thumbnail[];
};

export type Thumbnail = {
	url?: string;
	width?: number;
	height?: number;
};

export type StreamingData = {
	expiresInSeconds?: string;
	formats?: YoutubeVideoFormat[];
	adaptiveFormats?: YoutubeVideoFormat[];
	hlsManifestUrl?: string;
	dashManifestUrl?: string;
	licenseInfos?: LicenseInfo[];
};

export type LicenseInfo = {
	drmKeySystem?: string;
};

export type PlayabilityStatus = {
	status?: string;
	playableInEmbed?: boolean;
	miniplayer?: {
		miniplayerRenderer?: {
			playbackMode?: string;
		};
	};
	contextParams?: string;
};

export type Endscreen = {
	endscreenRenderer?: {
		elements?: EndscreenElement[];
		startMs?: string;
		trackingParams?: string;
	};
};

export type EndscreenElement = {
	endscreenElementRenderer?: {
		style?: string;
		image?: ThumbnailSet;
		left?: number;
		width?: number;
		top?: number;
		aspectRatio?: number;
		startMs?: string;
		endMs?: string;
		title?: {
			accessibility?: { accessibilityData?: { label?: string } };
			simpleText?: string;
		};
		metadata?: {
			simpleText?: string;
		};
		endpoint?: NavigationEndpoint;
		trackingParams?: string;
		id?: string;
		thumbnailOverlays?: ThumbnailOverlay[];
	};
};

export type NavigationEndpoint = {
	clickTrackingParams?: string;
	commandMetadata?: CommandMetadata;
	watchEndpoint?: WatchEndpoint;
	urlEndpoint?: { url?: string };
	browseEndpoint?: { browseId?: string };
};

export type CommandMetadata = {
	webCommandMetadata?: {
		url?: string;
		webPageType?: string;
		rootVe?: number;
		sendPost?: boolean;
		apiUrl?: string;
	};
};

export type WatchEndpoint = {
	videoId?: string;
	playlistId?: string;
	index?: number;
	startTimeSeconds?: number;
};

export type ThumbnailOverlay = {
	thumbnailOverlayTimeStatusRenderer?: {
		text?: {
			accessibility?: { accessibilityData?: { label?: string } };
			simpleText?: string;
		};
		style?: string;
	};
};

export type AdPlacement = {
	adPlacementRenderer?: {
		config?: {
			adPlacementConfig?: {
				kind?: string;
				adTimeOffset?: {
					offsetStartMilliseconds?: string;
					offsetEndMilliseconds?: string;
				};
				hideCueRangeMarker?: boolean;
			};
		};
		renderer?: {
			adBreakServiceRenderer?: {
				prefetchMilliseconds?: string;
				getAdBreakUrl?: string;
			};
		};
		adSlotLoggingData?: {
			serializedSlotAdServingDataEntry?: string;
		};
	};
};

export type FrameworkUpdates = {
	entityBatchUpdate?: EntityBatchUpdate;
};

export type EntityBatchUpdate = {
	mutations?: EntityMutation[];
	timestamp?: {
		seconds?: string;
		nanos?: number;
	};
};

export type EntityMutation = {
	entityKey?: string;
	type?: string;
	payload?: {
		offlineabilityEntity?: {
			key?: string;
			addToOfflineButtonState?: string;
		};
	};
};

export type SubscriptionButton = {
	subscribeButtonRenderer?: {
		buttonText?: { runs?: Run[] };
		subscribed?: boolean;
		enabled?: boolean;
		type?: string;
		channelId?: string;
		showPreferences?: boolean;
		subscribedButtonText?: { runs?: Run[] };
		unsubscribedButtonText?: { runs?: Run[] };
		trackingParams?: string;
		unsubscribeButtonText?: { runs?: Run[] };
		serviceEndpoints?: ServiceEndpoint[];
		subscribeAccessibility?: { accessibilityData?: { label?: string } };
		unsubscribeAccessibility?: { accessibilityData?: { label?: string } };
		signInEndpoint?: NavigationEndpoint;
	};
};

export type Run = {
	text?: string;
};

export type ServiceEndpoint = {
	clickTrackingParams?: string;
	commandMetadata?: CommandMetadata;
	subscribeEndpoint?: {
		channelIds?: string[];
		params?: string;
	};
	unsubscribeEndpoint?: {
		channelIds?: string[];
		params?: string;
	};
};

export type Annotations = {
	playerAnnotationsExpandedRenderer?: {
		featuredChannel?: {
			startTimeMs?: number;
			endTimeMs?: number;
			watermark?: ThumbnailSet;
			trackingParams?: string;
			channelName?: string;
			subscribeButton?: SubscriptionButton;
		};
		allowSwipeDismiss?: boolean;
		annotationId?: string;
	};
};

export type Cards = {
	cardCollectionRenderer?: {
		cards?: Card[];
		headerText?: { simpleText?: string };
		icon?: { infoCardIconRenderer?: { trackingParams?: string } };
		closeButton?: { infoCardIconRenderer?: { trackingParams?: string } };
		trackingParams?: string;
		allowTeaserDismiss?: boolean;
		logIconVisibilityUpdates?: boolean;
	};
};

export type Card = {
	cardRenderer?: {
		teaser?: {
			simpleCardTeaserRenderer?: {
				message?: { simpleText?: string };
				trackingParams?: string;
				prominent?: boolean;
				logVisibilityUpdates?: boolean;
				onTapCommand?: NavigationEndpoint;
			};
		};
		cueRanges?: Array<{
			startCardActiveMs?: string;
			endCardActiveMs?: string;
			teaserDurationMs?: string;
			iconAfterTeaserMs?: string;
		}>;
		trackingParams?: string;
	};
};

export type Captions = {
	playerCaptionsTracklistRenderer?: {
		captionTracks?: CaptionTrack[];
		audioTracks?: AudioTrack[];
		translationLanguages?: TranslationLanguage[];
		defaultAudioTrackIndex?: number;
	};
};

export type CaptionTrack = {
	baseUrl?: string;
	name?: { simpleText?: string };
	vssId?: string;
	languageCode?: string;
	kind?: string;
	isTranslatable?: boolean;
	trackName?: string;
};

export type AudioTrack = {
	captionTrackIndices?: number[];
	defaultCaptionTrackIndex?: number;
	visibility?: string;
	hasDefaultTrack?: boolean;
	captionsInitialState?: string;
	audioTrackId?: string;
};

export type TranslationLanguage = {
	languageCode?: string;
	languageName?: { simpleText?: string };
};

# YouTube Video Metadata Extractor

A TypeScript library for extracting YouTube video metadata from HTML pages by parsing the `ytInitialPlayerResponse` variable.

## Installation

```bash
npm install youtube-video-metadata
```

## Usage

```typescript
import { loadYoutubeVideoMetadata } from 'youtube-video-metadata';
import type { YoutubeVideoMetadata, isAudioStream, isVideoStream, isAudioVideoStream } from 'youtube-video-metadata';

async function getVideoInfo() {
    const metadata = await loadYoutubeVideoMetadata('dQw4w9WgXcQ');
    if (metadata) {
        console.log('Title:', metadata.title);
        console.log('Channel:', metadata.channelName);
        console.log('Duration:', metadata.lengthSeconds, 'seconds');
        console.log('Views:', metadata.viewCount);

        // Available streams
        metadata.streams.forEach(stream => {
            if (isAudioVideoStream(stream)) {
                console.log(`Video + Audio: ${stream.width}x${stream.height} @ ${stream.fps}fps, ${stream.sampleRate}Hz`);
            } else if (isVideoStream(stream)) {
                console.log(`Video only: ${stream.width}x${stream.height} @ ${stream.fps}fps`);
            } else if (isAudioStream(stream)) {
                console.log(`Audio only: ${stream.sampleRate}Hz, ${stream.channelsCount} channels`);
            }
        });
    }
}
```

## API Reference

### loadYoutubeVideoMetadata(videoId: string)

Loads YouTube video metadata by video ID.

**Parameters:**
- `videoId` - YouTube video ID (e.g., "dQw4w9WgXcQ")

**Returns:**
- `Promise<YoutubeVideoMetadata | null>` - Video metadata or null if not found

### YoutubeVideoMetadata

Main interface containing YouTube video metadata:

```typescript
type YoutubeVideoMetadata = {
	videoId: string;
	channelName: string;
	title: string;
	description: string;
	lengthSeconds: number;
	channelId: string;
	streams: Stream[];
	viewCount?: number;
};
```

### Stream Types

```typescript
type AudioStream = CommonStream & {
	sampleRate: number;
	channelsCount: number;
};

type VideoStream = CommonStream & {
	width: number;
	height: number;
	fps: number;
};

type AudioVideoStream = AudioStream & VideoStream;

type Stream = AudioVideoStream | AudioStream | VideoStream;

type CommonStream = {
	contentLength: string;
	mimeType: string;
	durationMs: number;
};
```

### Type Guards

Helper functions to identify stream types:

```typescript
function isAudioStream(stream: Stream): stream is AudioStream
function isVideoStream(stream: Stream): stream is VideoStream
function isAudioVideoStream(stream: Stream): stream is AudioVideoStream
```

## Features

- ✅ Full TypeScript support with complete type definitions
- ✅ Comprehensive stream information (audio, video, combined)
- ✅ Structured metadata extraction from YouTube


## CLI Usage

For command-line usage, install globally:

```bash
npm install -g youtube-video-metadata
```

Basic usage:

```bash
# Get video metadata by ID
youtube-video-metadata get dQw4w9WgXcQ

# Show description and streams
youtube-video-metadata get dQw4w9WgXcQ --description --streams

# Output as JSON
youtube-video-metadata get dQw4w9WgXcQ --json

# Get help
youtube-video-metadata --help
```

## License

ISC

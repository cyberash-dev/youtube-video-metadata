import { extractYtInitialPlayerResponse } from "./extractYtInitialPlayerResponse";
import { getYoutubeVideoMetadata } from "./getYoutubeVideoMetadata";
import type { YoutubeVideoMetadata } from "./types/YoutubeVideoMetadata";

export async function loadYoutubeVideoMetadata(videoId: string): Promise<YoutubeVideoMetadata | null> {
	const html = await fetch(`https://www.youtube.com/watch?v=${videoId}`).then((res) => res.text());
	const ytInitialPlayerResponse = extractYtInitialPlayerResponse(html);

	if (!ytInitialPlayerResponse) {
		return null;
	}

	return getYoutubeVideoMetadata(ytInitialPlayerResponse);
}

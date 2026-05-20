import React, { useEffect, useState, useRef } from "react";
import GMIApi from "../../src/api/GMIApi";

function getYoutubeId(url) {
	if (!url) return null;
	const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
	const match = url.match(regExp);
	return (match && match[2].length === 11) ? match[2] : null;
}

const VideoIcon = ({ size = 24, className }) => (
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
		<path d="m22 8-6 4 6 4V8Z" />
		<rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
	</svg>
);

const PlayIcon = ({ size = 16, className }) => (
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
		<polygon points="5 3 19 12 5 21 5 3" />
	</svg>
);

export default function ContestVideosSection({ contestId }) {
	const [videos, setVideos] = useState([]);
	const [activeVideo, setActiveVideo] = useState(null);
	const [loading, setLoading] = useState(true);
	const playerRef = useRef(null);
	const videoWrapperRef = useRef(null);
	const [videoHeight, setVideoHeight] = useState(360);
	const [isDesktop, setIsDesktop] = useState(false);

	useEffect(() => {
		if (typeof window === "undefined" || !videoWrapperRef.current) return;

		const updateLayout = () => {
			if (videoWrapperRef.current) {
				setVideoHeight(videoWrapperRef.current.clientHeight);
			}
			setIsDesktop(window.innerWidth >= 1024);
		};

		updateLayout();

		const observer = new ResizeObserver(updateLayout);
		observer.observe(videoWrapperRef.current);

		window.addEventListener("resize", updateLayout);

		return () => {
			observer.disconnect();
			window.removeEventListener("resize", updateLayout);
		};
	}, [activeVideo, loading]);

	useEffect(() => {
		if (!contestId) return;

		setLoading(true);
		GMIApi.getInstance().getVideos(contestId, (data) => {
			if (data.success && data.videos && data.videos.length > 0) {
				setVideos(data.videos);
				// Set initial active video to the first highlighted video, or just the first video
				const highlighted = data.videos.find(v => v.is_highlighted);
				setActiveVideo(highlighted || data.videos[0]);
			} else {
				setVideos([]);
				setActiveVideo(null);
			}
			setLoading(false);
		});
	}, [contestId]);

	const handleVideoSelect = (video) => {
		setActiveVideo(video);
		if (playerRef.current) {
			playerRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
		}
	};

	if (loading) return null;
	if (videos.length === 0) return null;

	const hasPlaylist = videos.length > 1;

	return (
		<section className="ds-card-section">
			<h2 className="text-2xl font-bold text-content flex items-center gap-3 mb-4">
				Video 
				<span className="text-content-muted text-lg">({videos.length})</span>
			</h2>

			<div ref={playerRef} className={`grid grid-cols-1 ${hasPlaylist ? "lg:grid-cols-12" : ""} gap-6`}>
				{/* Spotlight Player */}
				<div className={`${hasPlaylist ? "lg:col-span-8" : "max-w-4xl mx-auto w-full"} flex flex-col`}>
					{activeVideo && (
						<>
							<div ref={videoWrapperRef} className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-default shadow-lg relative">
								<iframe
									className="w-full h-full"
									src={`https://www.youtube.com/embed/${getYoutubeId(activeVideo.url)}?autoplay=0`}
									title={activeVideo.title}
									frameBorder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
									allowFullScreen
								/>
							</div>
							<div className="mt-4 flex flex-col gap-1">
								<div className="flex items-center gap-2">
									{activeVideo.is_highlighted && (
										<span className="inline-flex items-center gap-0.5 text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">
											★ In Evidenza
										</span>
									)}
									<span className="text-xs text-content-muted">
										{activeVideo.contest_name}
									</span>
								</div>
								<h3 className="text-lg font-bold text-content leading-snug">
									{activeVideo.title}
								</h3>
							</div>
						</>
					)}
				</div>

				{/* Playlist Sidebar */}
				{hasPlaylist && (
					<div className="lg:col-span-4 flex flex-col">
						<h3 className="text-xs font-bold text-content-muted uppercase tracking-wider mb-3 shrink-0">
							Playlist
						</h3>
						<div
							className="overflow-y-auto pr-2 ds-scrollbar-modern flex flex-col gap-2"
							style={isDesktop && videoHeight ? { maxHeight: `${Math.max(150, videoHeight - 28)}px` } : { maxHeight: "380px" }}
						>
							{videos.map((video) => {
								const videoId = getYoutubeId(video.url);
								const isActive = activeVideo && activeVideo.id === video.id;
								return (
									<div
										key={video.id}
										onClick={() => handleVideoSelect(video)}
										className={`flex gap-3 p-2 rounded-lg cursor-pointer transition-all border ${isActive
											? "bg-secondary/10 border-secondary/30 text-secondary"
											: "hover:bg-surface-elevated border-transparent text-content"
											}`}
									>
										{/* Thumbnail */}
										<div className="group relative w-28 aspect-video rounded overflow-hidden bg-black/10 shrink-0 border border-default">
											{videoId ? (
												<img
													src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
													alt={video.title}
													className="w-full h-full object-cover"
													loading="lazy"
												/>
											) : (
												<div className="w-full h-full bg-surface-muted flex items-center justify-center">
													<PlayIcon size={16} className="text-content-muted" />
												</div>
											)}
											{/* Play Icon Overlay */}
											<div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-200 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
												<div className="w-8 h-8 rounded-full bg-secondary/80 flex items-center justify-center text-white shadow-md transform scale-90 group-hover:scale-100 transition-transform">
													<PlayIcon size={12} className="fill-current" />
												</div>
											</div>
										</div>

										{/* Details */}
										<div className="flex flex-col justify-center min-w-0 flex-1">
											{video.is_highlighted && (
												<span className="text-[9px] uppercase font-bold text-accent mb-0.5">
													★ In Evidenza
												</span>
											)}
											<h4 className={`text-xs font-bold line-clamp-2 leading-tight ${isActive ? "text-secondary" : "text-content"}`}>
												{video.title}
											</h4>
											<span className="text-[10px] text-content-muted mt-1 truncate">
												{video.contest_name}
											</span>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				)}
			</div>
		</section>
	);
}

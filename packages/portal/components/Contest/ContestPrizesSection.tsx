import React, { useEffect, useState } from "react";
import GMIApi from "../../src/api/GMIApi";
import Link from "next/link";
import { useRouter } from "next/router";
import ImageModal from "../commons/ImageModal";
import { parseAuthors } from "../../src/Utils";

export default function ContestPrizesSection({ contestId }) {
  const router = useRouter();
  const [prizes, setPrizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (!contestId) return;

    // Pass undefined to get all prizes and filter by contest_id client-side
    GMIApi.getInstance().getPrizes(undefined, (data) => {
      if (data.success) {
        // Robust comparison using String() to avoid type mismatches
        const filtered = data.prizes.filter(p => String(p.contest_id) === String(contestId));
        setPrizes(filtered);
      }
      setLoading(false);
    });
  }, [contestId]);

  if (loading) return null;
  if (prizes.length === 0) return null;

  const formatPrizeImage = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return GMIApi.getInstance().prizesURL + url;
  };

  // parseAuthors imported from Utils

  const handleCardClick = (targetContestId) => {
    router.push(`/competizioni/contest?contest=${targetContestId}`);
  };

  return (
    <section className="ds-card-section">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-content uppercase tracking-tight">Premi</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {prizes.map((prize) => {
          const authors = parseAuthors(prize.authors);
          const imageUrl = formatPrizeImage(prize.image_url);
          return (
            <div
              key={prize.id}
              className="flex flex-col bg-surface border border-default overflow-hidden hover:border-content/30 transition-colors"
            >
              {/* Pure Prize Image - Clicks to open Large View */}
              <div
                className="aspect-square bg-black/5 flex items-center justify-center cursor-zoom-in"
                onClick={() => setSelectedImage({ src: imageUrl, alt: prize.description || prize.game_name })}
              >
                <img
                  src={imageUrl}
                  alt={prize.description || prize.game_name}
                  className="w-full h-full object-cover pointer-events-none"
                />
              </div>

              {/* Prize Info Below - Clicks to navigate to Contest */}
              <div
                className="p-4 flex flex-col gap-2 cursor-pointer"
                onClick={() => handleCardClick(prize.contest_id)}
              >
                <h3 className="text-sm font-bold text-content line-clamp-2">
                  {prize.description || prize.game_name || "Premio"}
                </h3>

                {prize.description && (
                  <p className="text-[11px] text-content-muted italic leading-tight">{prize.description}</p>
                )}

                {authors.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-2 border-t border-default mt-1">
                    <span className="text-[10px] text-content-muted uppercase font-bold mr-1">di</span>
                    {authors.map((author, idx) => (
                      <Link key={idx} href={`/competizioni/user?user=${author.id}`} onClick={(e) => e.stopPropagation()}
                          className="text-[11px] font-semibold text-secondary hover:underline">
                        
                          {author.name}{idx < authors.length - 1 ? "," : ""}
                        </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedImage && (
        <ImageModal
          src={selectedImage.src}
          alt={selectedImage.alt}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </section>
  );
}

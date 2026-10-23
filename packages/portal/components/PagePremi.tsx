import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { PageLayout } from "./WebsiteLayout/PageLayout";
import GMIApi from "../src/api/GMIApi";
import Link from "next/link";
import ImageModal from "./commons/ImageModal";
import { parseAuthors } from "../src/Utils";

export default function PagePremi() {
  const router = useRouter();
  const [prizes, setPrizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    GMIApi.getInstance().getPrizes(undefined, (data) => {
      if (data.success) {
        setPrizes(data.prizes);
      }
      setLoading(false);
    });
  }, []);

  const handleCardClick = (contestId) => {
    router.push(`/competizioni/contest?contest=${contestId}`);
  };

  const formatPrizeImage = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return GMIApi.getInstance().prizesURL + url;
  };

  return (
    <PageLayout>
      <div className="w-full">
        <div className="flex flex-col gap-8">
          
          {/* Header */}
          <div className="border-b border-default pb-6">
            <h1 className="text-3xl font-normal text-content">Galleria Premi</h1>
            <p className="text-content-muted mt-2">
              I premi assegnati ai vincitori delle competizioni (quando si ricordano di mandarci una foto)
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-72 bg-surface animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {prizes.map((prize) => {
                const authors = parseAuthors(prize.authors);
                const imageUrl = formatPrizeImage(prize.image_url);
                return (
                  <div
                    key={prize.id}
                    className="flex flex-col bg-surface border border-default overflow-hidden hover:border-content/30 transition-colors"
                  >
                    {/* Image Section - Clicks to open Large View */}
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

                    {/* Info Section Below - Clicks to navigate to Contest */}
                    <div 
                      className="p-4 flex flex-col gap-2 flex-1 cursor-pointer"
                      onClick={() => handleCardClick(prize.contest_id)}
                    >
                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-content line-clamp-2">
                          {prize.description || prize.game_name || "Premio"}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-content-muted">
                           <span className="font-medium">{prize.contest_name}</span>
                        </div>
                      </div>

                      {authors.length > 0 && (
                        <div className="pt-2 border-t border-default flex flex-wrap items-center gap-1">
                          <span className="text-[10px] text-content-muted uppercase font-bold mr-1">di</span>
                          {authors.map((author, idx) => (
                            <Link key={idx} href={`/competizioni/user?user=${author.id}`} onClick={(e) => e.stopPropagation()}
                                className="text-xs font-semibold text-secondary hover:underline">
                              
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
          )}
        </div>
      </div>

      {selectedImage && (
        <ImageModal 
          src={selectedImage.src} 
          alt={selectedImage.alt} 
          onClose={() => setSelectedImage(null)} 
        />
      )}
    </PageLayout>
  );
}

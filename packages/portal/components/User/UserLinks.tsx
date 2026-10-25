import React from "react";
import { parseUserLinks, USER_LINK_LABELS, USER_LINK_PLATFORMS } from "../../src/userLinks";
import { UserLinkIcon } from "../commons/UserLinkIcons";

type UserLinksProps = {
  links?: unknown;
  userName?: string;
  className?: string;
};

/** Mostra solo i link effettivamente presenti nel profilo, nell'ordine consigliato. */
export default function UserLinks({ links, userName, className = "" }: UserLinksProps) {
  const normalized = parseUserLinks(links);
  const platforms = USER_LINK_PLATFORMS.filter((platform) => !!normalized[platform]);

  if (platforms.length === 0)
    return null;

  return (
    <ul
      className={`mt-4 inline-grid grid-cols-[repeat(5,2rem)] items-center gap-1 ${className}`}
      aria-label="Link del profilo"
    >
      {platforms.map((platform) => {
        const label = USER_LINK_LABELS[platform];
        const url = normalized[platform] as string;

        return (
          <li key={platform}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer me"
              aria-label={`${label}${userName ? ` di ${userName}` : ""} (si apre in una nuova scheda)`}
              title={url}
              className="inline-flex h-8 w-8 items-center justify-center text-gray-300 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
            >
              <UserLinkIcon platform={platform} size={16} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}

import React from "react";

type IconProps = {
  size?: number;
  className?: string;
};

const XIcon = ({ size = 16, className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zM17.083 19.77h1.833L7.084 4.126H5.117z" />
  </svg>
);

const BlueskyIcon = ({ size = 16, className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z" />
  </svg>
);

const ItchioIcon = ({ size = 16, className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M17.8 3.5c-4.23 0-10 .06-11.17.17-1.3.78-3.9 3.77-3.94 4.55v1.3c0 1.64 1.55 3.08 2.94 3.08A3.1 3.1 0 0 0 8.7 9.57a3.06 3.06 0 0 0 3.01 3.03 3 3 0 0 0 3-3.03 3.13 3.13 0 0 0 3.09 3.03h.01a3.1 3.1 0 0 0 3.1-3.03 3 3 0 0 0 3.01 3.03 3.06 3.06 0 0 0 2.99-3.03 3.1 3.1 0 0 0 3.07 3.03c1.39 0 2.94-1.44 2.94-3.08v-1.3c-.03-.78-2.63-3.77-3.94-4.55-4.1-.14-6.94-.17-11.17-.17m-3.19 8.76a3.57 3.57 0 0 1-6.14.02c-.82 1.43-2.68 1.97-3.48 1.7-.22 2.47-.38 15.14 1.3 17.26 4.94 1.16 18.22 1.13 23.01 0 1.95-1.97 1.51-14.97 1.3-17.26-.79.26-2.65-.28-3.45-1.7a3.56 3.56 0 0 1-6.16-.02 3.5 3.5 0 0 1-3.19 1.78 3.5 3.5 0 0 1-3.19-1.78m-2.76 2.94c1.04 0 1.99 0 3.13 1.27q2.82-.3 5.64 0c1.16-1.26 2.1-1.26 3.13-1.26 3.36 0 4.16 4.96 5.37 9.22 1.1 3.97-.36 4.07-2.17 4.07-2.69-.1-4.18-2.05-4.18-4.02a33 33 0 0 1-9.94 0c0 1.97-1.5 3.91-4.18 4.02-1.8 0-3.27-.1-2.17-4.07 1.2-4.29 2.01-9.22 5.37-9.22Zm5.95 3.74s-2.21 2.03-2.6 2.73l1.43-.05v1.26c0 .08 1.08 0 1.17 0a5 5 0 0 0 1.17 0v-1.26l1.43.05c-.39-.7-2.6-2.73-2.6-2.73"/>
  </svg>
);

const GameJoltIcon = ({ size = 16, className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M6 0v3H5v3H4v2H2v3H1v3h8v3H8v3H6v3h2v-2h1v-1h2v-2h1v-1h1v-1h2v-2h1v-1h2v-2h1v-1h1V8h2V7h-4V6h1V4h1V3h2V1h1V0zm0 23H5v1h1zM8 3h10v1h-2v2h-1v1h-2v1h-1v2h1v1h-1v-1h-1v1H9v-1H8v1H6v-1H5V8h1V6h2zM6 8v2h2V8zm3 2h2V8H9zm6 0h1v1h-1z" />
  </svg>
);

const IndiexpoIcon = ({ size = 16, className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 148 176"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="m74 103-5-5-7-8-12 14-24 28-8 10V33l6 7 26 32 19 22 2 3 3 3 2 2 5 6 8 10 36 42 8 10 3 2c9 2 16-8 10-14l-12-15-49-58-4-5-8-9-48-58-8-9-8-4C6 0 0 3 0 8v157l1 6c3 6 11 6 15 2l3-4 4-5 7-8 23-28 15-18Zm15-18 55-65q4-4 3-11-3-7-10-6l-4 2-55 65v3l7 9z" />
  </svg>
);

const YouTubeIcon = ({ size = 16, className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4L15.8 12Z" />
  </svg>
);

const TwitchIcon = ({ size = 16, className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M4.3 0 1.5 3.8v16.1h5.4V23h3l3-3h4.6l5-5V0Zm15.2 13.9-3.1 3.1h-4.8l-2.9 2.9v-2.9H4.4V2h15.1ZM17.6 6.1h-2v5.4h2Zm-5.3 0h-2v5.4h2Z" />
  </svg>
);

const GitHubIcon = ({ size = 16, className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.4-4-1.4-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.9 1.2 1.9 1.2 1.1 1.9 2.8 1.4 3.5 1 .1-.8.4-1.4.8-1.7-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.6 18.3 5 18.3 5c.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3Z" />
  </svg>
);

const SteamIcon = ({ size = 16, className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 0a12 12 0 0 0-12 11.5l6.4 2.6a3.4 3.4 0 0 1 2-.6l2.8-4v-.1a4.5 4.5 0 1 1 4.5 4.5h-.1l-4 2.8a3.4 3.4 0 0 1-6.4 1.5L0 17.3A12 12 0 1 0 12 0ZM7.6 18.2l-1.4-.6a2.5 2.5 0 0 0 4.5-1 2.5 2.5 0 0 0-2.5-2.5h-.5l1.5.6a1.9 1.9 0 0 1-1.5 3.4Zm9.1-6.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0-.7a2.3 2.3 0 1 1 0-4.6 2.3 2.3 0 0 1 0 4.6Z" />
  </svg>
);

const GlobeIcon = ({ size = 16, className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 0 20 15.3 15.3 0 0 1 0-20Z" />
  </svg>
);

export function UserLinkIcon({
  platform,
  size = 16,
  className,
}: IconProps & { platform: UserLinkPlatform }) {
  switch (platform) {
    case "x":
      return <XIcon size={size} className={className} />;
    case "bluesky":
      return <BlueskyIcon size={size} className={className} />;
    case "itchio":
      return <ItchioIcon size={size} className={className} />;
    case "gamejolt":
      return <GameJoltIcon size={size} className={className} />;
    case "indiexpo":
      return <IndiexpoIcon size={size} className={className} />;
    case "youtube":
      return <YouTubeIcon size={size} className={className} />;
    case "twitch":
      return <TwitchIcon size={size} className={className} />;
    case "steam":
      return <SteamIcon size={size} className={className} />;
    case "github":
      return <GitHubIcon size={size} className={className} />;
    case "website":
    default:
      return <GlobeIcon size={size} className={className} />;
  }
}

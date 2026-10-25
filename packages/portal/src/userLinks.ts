export const USER_LINK_PLATFORMS = [
  "x",
  "bluesky",
  "itchio",
  "gamejolt",
  "indiexpo",
  "youtube",
  "twitch",
  "steam",
  "github",
  "website",
] as const satisfies readonly UserLinkPlatform[]

export const USER_LINK_LABELS: Record<UserLinkPlatform, string> = {
  x: "X",
  bluesky: "Bluesky",
  itchio: "itch.io",
  gamejolt: "Game Jolt",
  indiexpo: "Indiexpo",
  youtube: "YouTube",
  twitch: "Twitch",
  steam: "Steam",
  github: "GitHub",
  website: "Sito web",
}

export const USER_LINK_PLACEHOLDERS: Record<UserLinkPlatform, string> = {
  x: "https://x.com/username",
  bluesky: "https://bsky.app/profile/username.bsky.social",
  itchio: "https://username.itch.io",
  gamejolt: "https://gamejolt.com/@username",
  indiexpo: "https://www.indiexpo.net/users/username",
  youtube: "https://www.youtube.com/@username",
  twitch: "https://www.twitch.tv/username",
  steam: "https://steamcommunity.com/id/username",
  github: "https://github.com/username",
  website: "https://example.com",
}

export const USER_LINK_MAX_LENGTH = 255

function isPlatform(value: string): value is UserLinkPlatform {
  return (USER_LINK_PLATFORMS as readonly string[]).includes(value)
}

function cleanUrl(value: unknown): string | undefined {
  if (typeof value !== "string")
    return undefined

  const trimmed = value.trim()
  return trimmed === "" ? undefined : trimmed
}

/** Normalizza la mappa `links` restituita dall'API, accettando anche una stringa JSON. */
export function parseUserLinks(value: unknown): UserLinks {
  if (!value)
    return {}

  let source = value
  if (typeof value === "string") {
    try {
      source = JSON.parse(value)
    } catch {
      return {}
    }
  }

  if (typeof source !== "object" || source === null || Array.isArray(source))
    return {}

  const result: UserLinks = {}
  for (const [key, rawValue] of Object.entries(source)) {
    if (!isPlatform(key))
      continue

    const url = cleanUrl(rawValue)
    if (url)
      result[key] = url
  }

  return result
}

/** Valida un singolo link. Ritorna null se valido, altrimenti il messaggio d'errore. */
export function validateUserLink(rawValue: string): string | null {
  const value = rawValue.trim()
  if (value === "")
    return null

  if (value.length > USER_LINK_MAX_LENGTH)
    return `Il link non può superare ${USER_LINK_MAX_LENGTH} caratteri.`

  let parsed: URL
  try {
    parsed = new URL(value)
  } catch {
    return "Inserisci un URL completo che inizi con http:// o https://."
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:")
    return "Il link deve iniziare con http:// o https://."

  return null
}

/**
 * Converte i campi del form in una mappa `links` pronta per l'API.
 * Vengono inviate solo le piattaforme modificate; una stringa vuota rimuove il link.
 */
export function buildUserLinksPayload(
  values: Record<UserLinkPlatform, string>,
  initialLinks: UserLinks
): UserLinks {
  const payload: UserLinks = {}

  for (const platform of USER_LINK_PLATFORMS) {
    const nextValue = values[platform].trim()
    const previousValue = initialLinks[platform] ?? ""

    if (nextValue !== previousValue)
      payload[platform] = nextValue
  }

  return payload
}

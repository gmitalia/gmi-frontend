import DiscordIcon from "./DiscordIcon"
import TwitterIcon from "./TwitterIcon"

type SocialProps = {
  social: "twitter" | "discord"
}

const SocialIcon = ({social}: SocialProps) => {
  const icon = social === "twitter" ? <TwitterIcon /> : <DiscordIcon />
  return (
    <div>{icon}</div>
  )
}

export default SocialIcon
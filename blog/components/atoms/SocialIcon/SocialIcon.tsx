import DiscordIcon from "./DiscordIcon"
import TwitterIcon from "./TwitterIcon"
import YoutubeIcon from "./YoutubeIcon";

type SocialProps = "Twitter" | "Discord" | "YouTube";

type SocialIconProps = {
  social: SocialProps;
}

const SocialIcon = ({social}: SocialIconProps) => {
  const link = (social: SocialProps) => {
    switch(social) {
      case "Twitter":
        return "https://twitter.com/GameMakerIta"

      case "Discord":
        return "https://discord.gg/0wKBBPIbX2r3S32a"

      case "YouTube":
        return "https://www.youtube.com/channel/UCee7hFC_VtQ_gnX5J2tMTHg"
    }
  }

  const icon = (social: SocialProps) => {
    switch(social) {
      case "Twitter":
        return <TwitterIcon />

      case "Discord":
        return <DiscordIcon />

      case "YouTube":
        return <YoutubeIcon />
    }
  }
  return (
    <a href={link(social)} title={social}>{icon(social)}</a>
  )
}

export default SocialIcon
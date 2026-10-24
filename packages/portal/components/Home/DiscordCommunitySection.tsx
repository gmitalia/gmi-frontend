import DiscordIcon from "../atoms/SocialIcon/DiscordIcon";
import { Button } from "../commons/Button";

/** Invito alla community Discord, mostrato in fondo alla home. */
export function DiscordCommunitySection({
  className = "",
}: {
  className?: string;
}) {
  return (
    <section
      className={`border border-gray-200 bg-white p-6 md:p-8 ${className}`}
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-[#5865F2] text-white sm:h-16 sm:w-16">
            <DiscordIcon />
          </div>
          <div>
            <h2 className="text-2xl font-normal text-gray-900">
              Entra su Discord
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              C’è bella gente, progetti interessanti e sempre qualcuno con cui fare due chiacchiere.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 md:justify-start">
          <Button
            variant="primary"
            href="https://discord.gg/0wKBBPIbX2r3S32a"
            target="_blank"
            rel="noopener noreferrer"
          >
            Link d'invito
          </Button>
        </div>
      </div>
    </section>
  );
}

export default DiscordCommunitySection;

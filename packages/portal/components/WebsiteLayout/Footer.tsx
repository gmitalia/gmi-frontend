import type { ReactNode } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { authAsyncThunk } from "../../src/slices/authAsyncThunk";
import { competitionsPath } from "../../src/paths";
import type { AppDispatch, RootState } from "../../src/store";
import { GMILogoIcon } from "../commons/Icons";
import DiscordIcon from "../atoms/SocialIcon/DiscordIcon";
import TwitchIcon from "../atoms/SocialIcon/TwitchIcon";
import TwitterIcon from "../atoms/SocialIcon/TwitterIcon";
import YoutubeIcon from "../atoms/SocialIcon/YoutubeIcon";

const linkClasses =
  "inline-block text-sm leading-5 text-gray-500 transition-colors hover:text-primary hover:underline underline-offset-4";

const socialLinkClasses =
  "footer-social-link flex h-8 w-8 items-center justify-center rounded-sm border border-gray-200 text-gray-500 transition-colors hover:border-primary hover:text-primary";

const ADMIN_URL = "https://gmitalia.altervista.org/competizioni/admin/";

type FooterColumnProps = {
  title: string;
  children: ReactNode;
};

const FooterColumn = ({ title, children }: FooterColumnProps) => (
  <div>
    <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-gray-900">
      {title}
    </h2>
    <ul className="mt-3 space-y-1.5">{children}</ul>
  </div>
);

type FooterLinkProps = {
  href: string;
  external?: boolean;
  children: ReactNode;
};

const FooterLink = ({ href, external = false, children }: FooterLinkProps) => (
  <li>
    {external ? (
      <a href={href} className={linkClasses} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ) : (
      <Link href={href} className={linkClasses}>
        {children}
      </Link>
    )}
  </li>
);

export const Footer = () => {
  const userInfo = useSelector((root: RootState) => root.auth.userInfo);
  const dispatch = useDispatch<AppDispatch>();
  const user = userInfo && userInfo.success ? userInfo.user : undefined;

  const login = () => {
    dispatch(authAsyncThunk.login());
  };

  const logout = () => {
    dispatch(authAsyncThunk.logout());
  };

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-5 py-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 lg:grid-cols-6 lg:gap-8">
          {/* Brand + social */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2" title="GameMaker Italia — Home">
              <GMILogoIcon size={32} />
              <span className="text-lg font-semibold text-gray-900">GameMaker Italia</span>
            </Link>

            <div className="mt-4 flex items-center gap-2">
              <a
                href="https://www.twitch.tv/gamemakeritalia"
                className={socialLinkClasses}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GameMaker Italia su Twitch"
              >
                <TwitchIcon />
              </a>
              <a
                href="https://www.youtube.com/channel/UCee7hFC_VtQ_gnX5J2tMTHg"
                className={socialLinkClasses}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GameMaker Italia su YouTube"
              >
                <YoutubeIcon />
              </a>
              <a
                href="https://twitter.com/GameMakerIta"
                className={socialLinkClasses}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GameMaker Italia su Twitter"
              >
                <TwitterIcon />
              </a>
              <a
                href="https://discord.com/invite/juj4yEF2Yv"
                className={socialLinkClasses}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GameMaker Italia su Discord"
              >
                <DiscordIcon />
              </a>
            </div>
          </div>

          <FooterColumn title="Sitemap">
            <FooterLink href="/">Home</FooterLink>
            <FooterLink href="/blog/">Blog</FooterLink>
            <FooterLink href="/showcase/">Showcase</FooterLink>
            <FooterLink href="/tutorial/">Tutorial</FooterLink>
            <FooterLink href="/resources/">Risorse</FooterLink>
          </FooterColumn>

          <FooterColumn title="Competizioni">
            <FooterLink href={competitionsPath("/")}>Competizioni</FooterLink>
            <FooterLink href={competitionsPath("/users/")}>Partecipanti</FooterLink>
            <FooterLink href={competitionsPath("/premi/")}>Hall of Fame</FooterLink>
            <FooterLink href={competitionsPath("/rules/")}>Regolamento</FooterLink>
          </FooterColumn>

          <FooterColumn title="Links">
            <FooterLink href="https://gmiscores.altervista.org" external>
              GMIScores
            </FooterLink>
            <FooterLink href="https://gmitalia.altervista.org/forum/viewforum.php?f=14" external>
              Forum
            </FooterLink>
          </FooterColumn>

          <FooterColumn title="Area personale">
            {user ? (
              <>
                <FooterLink href={`${competitionsPath("/user/")}?user=${user.user_id}`}>
                  Il mio profilo
                </FooterLink>
                <li>
                  <button type="button" onClick={logout} className={linkClasses}>
                    Esci
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button type="button" onClick={login} className={linkClasses}>
                  Accedi con Discord
                </button>
              </li>
            )}

            {user?.admin && (
              <FooterLink href={ADMIN_URL} external>
                Amministrazione
              </FooterLink>
            )}
          </FooterColumn>
        </div>
      </div>
    </footer>
  );
};

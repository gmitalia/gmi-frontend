import type { ReactNode } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { authAsyncThunk } from "../../src/slices/authAsyncThunk";
import { competitionsPath } from "../../src/paths";
import type { AppDispatch, RootState } from "../../src/store";
import { GMILogoIcon } from "../commons/Icons";
import DiscordIcon from "../atoms/SocialIcon/DiscordIcon";
import TwitterIcon from "../atoms/SocialIcon/TwitterIcon";
import YoutubeIcon from "../atoms/SocialIcon/YoutubeIcon";

const linkClasses =
  "inline-block text-sm leading-5 text-gray-500 transition-colors hover:text-primary hover:underline underline-offset-4";

const socialLinkClasses =
  "footer-social-link flex h-9 w-9 items-center justify-center rounded-sm border border-gray-200 text-gray-500 transition-colors hover:border-primary hover:text-primary";

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
    <ul className="mt-4 space-y-2.5">{children}</ul>
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
  const year = new Date().getFullYear();

  const login = () => {
    dispatch(authAsyncThunk.login());
  };

  const logout = () => {
    dispatch(authAsyncThunk.logout());
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-5 py-12">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 lg:grid-cols-5 lg:gap-8">
          {/* Brand + social */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2" title="GameMaker Italia — Home">
              <GMILogoIcon size={36} />
              <span className="text-lg font-semibold text-gray-900">GameMaker Italia</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-gray-500">
              La community italiana di GameMaker: articoli, giochi, risorse e competizioni.
            </p>

            <div className="mt-6">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-gray-900">
                Seguici su
              </p>
              <div className="mt-3 flex items-center gap-2">
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
          </div>

          <FooterColumn title="Sitemap">
            <FooterLink href="/">Home</FooterLink>
            <FooterLink href="/blog/">Blog</FooterLink>
            <FooterLink href="/showcase/">Showcase</FooterLink>
            <FooterLink href="/tutorial/">Tutorial</FooterLink>
            <FooterLink href="/resources/">Risorse</FooterLink>
          </FooterColumn>

          <FooterColumn title="Competizioni">
            <FooterLink href={competitionsPath("/")}>Home</FooterLink>
            <FooterLink href={competitionsPath("/search")}>
              Giochi
            </FooterLink>
            <FooterLink href={competitionsPath("/users")}>Utenti</FooterLink>
            <FooterLink href={competitionsPath("/premi")}>Premi</FooterLink>
            <FooterLink href={competitionsPath("/rules")}>Regolamento</FooterLink>
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
                <FooterLink href={`${competitionsPath("/user")}?user=${user.user_id}`}>
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

      <div className="border-t border-gray-200">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-5 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} GameMaker Italia. Tutti i diritti riservati.</p>

          <div className="flex items-center gap-4">
            <span>Sviluppatori per passione</span>
            <button
              type="button"
              onClick={scrollToTop}
              className="transition-colors hover:text-primary hover:underline underline-offset-4"
            >
              Torna su
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

import React, { useEffect, useMemo, useState } from "react";
import GMIApi from "../../src/api/GMIApi";
import {
  buildUserLinksPayload,
  parseUserLinks,
  USER_LINK_LABELS,
  USER_LINK_MAX_LENGTH,
  USER_LINK_PLACEHOLDERS,
  USER_LINK_PLATFORMS,
  validateUserLink,
} from "../../src/userLinks";
import { Button } from "../commons/Button";
import { UserLinkIcon } from "../commons/UserLinkIcons";

type LinkValues = Record<UserLinkPlatform, string>;
type LinkErrors = Partial<Record<UserLinkPlatform, string>>;

type ProfileEditorProps = {
  user: UserInfo;
  onCancel: () => void;
  onSaved: (values: { user_name: string; links: UserLinks }) => void;
};

function toValues(links: UserLinks): LinkValues {
  return USER_LINK_PLATFORMS.reduce((values, platform) => {
    values[platform] = links[platform] ?? "";
    return values;
  }, {} as LinkValues);
}

function mergeLinks(initial: UserLinks, payload: UserLinks): UserLinks {
  const merged: UserLinks = { ...initial };

  for (const [platform, rawValue] of Object.entries(payload)) {
    if (!rawValue)
      delete merged[platform as UserLinkPlatform];
    else
      merged[platform as UserLinkPlatform] = rawValue;
  }

  return merged;
}

/**
 * Contenitore unico della modifica del profilo.
 * Per aggiungere nuovi campi in futuro basta estendere questo pannello
 * e il payload inviato a set_user_values.
 */
export default function ProfileEditor({ user, onCancel, onSaved }: ProfileEditorProps) {
  const initialLinks = useMemo(() => parseUserLinks(user.links), [user.links]);
  const initialName = user.user_name;

  const [name, setName] = useState(initialName);
  const [nameError, setNameError] = useState<string | null>(null);
  const [values, setValues] = useState<LinkValues>(() => toValues(initialLinks));
  const [errors, setErrors] = useState<LinkErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(initialName);
    setNameError(null);
    setValues(toValues(initialLinks));
    setErrors({});
    setFormError(null);
  }, [initialName, initialLinks]);

  const trimmedName = name.trim();
  const nameChanged = trimmedName !== initialName;
  const payload = buildUserLinksPayload(values, initialLinks);
  const linksChanged = Object.keys(payload).length > 0;
  const hasChanges = nameChanged || linksChanged;
  const canSave = hasChanges && !saving;

  function updateValue(platform: UserLinkPlatform, value: string) {
    setValues((current) => ({ ...current, [platform]: value }));
    setErrors((current) => {
      if (!current[platform])
        return current;

      const next = { ...current };
      delete next[platform];
      return next;
    });
    setFormError(null);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving)
      return;

    setFormError(null);

    if (trimmedName === "") {
      setNameError("Inserisci un nome utente.");
      document.getElementById("profile-name")?.focus();
      return;
    }

    setNameError(null);

    const nextErrors: LinkErrors = {};
    for (const platform of USER_LINK_PLATFORMS) {
      const error = validateUserLink(values[platform]);
      if (error)
        nextErrors[platform] = error;
    }

    setErrors(nextErrors);

    const firstInvalid = USER_LINK_PLATFORMS.find((platform) => nextErrors[platform]);
    if (firstInvalid) {
      document.getElementById(`user-link-${firstInvalid}`)?.focus();
      return;
    }

    if (!hasChanges)
      return;

    const updates: { user_name?: string; links?: UserLinks } = {};
    if (nameChanged)
      updates.user_name = trimmedName;
    if (linksChanged)
      updates.links = payload;

    setSaving(true);
    GMIApi.getInstance().setUserValues(user.user_id, updates, (data) => {
      setSaving(false);

      if (!data.success) {
        const message =
          data.errors?.user_name ||
          data.errors?.links ||
          (typeof data.error === "string" ? data.error : null) ||
          "Impossibile salvare il profilo. Riprova.";
        setFormError(message);
        return;
      }

      const savedLinks = data.links
        ? parseUserLinks(data.links)
        : mergeLinks(initialLinks, payload);
      const savedName =
        typeof data.user_name === "string" && data.user_name.trim()
          ? data.user_name.trim()
          : trimmedName;

      onSaved({ user_name: savedName, links: savedLinks });
    });
  }

  return (
    <section className="ds-card-section" aria-labelledby="profile-editor-heading">
      <h2 id="profile-editor-heading" className="text-xl font-bold uppercase tracking-wider text-content">
        Modifica profilo
      </h2>
      <p className="mt-1 text-sm text-content-muted">
        Aggiorna i dati visibili sul tuo profilo pubblico.
      </p>

      <form
        id="profile-edit-form"
        onSubmit={handleSubmit}
        onKeyDown={(event) => {
          if (event.key === "Escape" && !saving)
            onCancel();
        }}
        noValidate
      >
        <div className="mt-5 border-t border-default pt-5">
          <h3 className="text-base font-bold uppercase tracking-wider text-content">
            Dati profilo
          </h3>

          <div className="mt-4 max-w-md">
            <label
              htmlFor="profile-name"
              className="text-[11px] font-semibold tracking-[0.02em] text-content-muted"
            >
              Nome utente
            </label>
            <input
              id="profile-name"
              type="text"
              autoFocus
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setNameError(null);
                setFormError(null);
              }}
              aria-invalid={nameError ? "true" : undefined}
              aria-describedby={nameError ? "profile-name-error" : undefined}
              className={`mt-1.5 w-full border bg-surface px-3 py-2 text-sm text-content outline-none transition-colors focus:border-secondary ${
                nameError ? "border-error" : "border-default"
              }`}
            />
            {nameError && (
              <p id="profile-name-error" role="alert" className="mt-1 text-xs text-error">
                {nameError}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 border-t border-default pt-5">
          <h3 className="text-base font-bold uppercase tracking-wider text-content">
            Link social
          </h3>
          <p className="mt-1 text-sm text-content-muted">
            Collega i profili che vuoi mostrare sul tuo profilo pubblico. Tutti i link sono opzionali.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {USER_LINK_PLATFORMS.map((platform) => {
              const inputId = `user-link-${platform}`;
              const errorId = `${inputId}-error`;
              const error = errors[platform];

              return (
                <div key={platform} className="min-w-0">
                  <label
                    htmlFor={inputId}
                    className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.02em] text-content-muted"
                  >
                    <UserLinkIcon platform={platform} size={13} />
                    {USER_LINK_LABELS[platform]}
                  </label>
                  <input
                    id={inputId}
                    type="url"
                    inputMode="url"
                    autoComplete="url"
                    maxLength={USER_LINK_MAX_LENGTH}
                    value={values[platform]}
                    onChange={(event) => updateValue(platform, event.target.value)}
                    placeholder={USER_LINK_PLACEHOLDERS[platform]}
                    aria-invalid={error ? "true" : undefined}
                    aria-describedby={error ? errorId : undefined}
                    className={`mt-1.5 w-full border bg-surface px-3 py-2 text-sm text-content outline-none transition-colors placeholder:text-content-muted/60 focus:border-secondary ${
                      error ? "border-error" : "border-default"
                    }`}
                  />
                  {error && (
                    <p id={errorId} role="alert" className="mt-1 text-xs text-error">
                      {error}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <p className="mt-4 text-xs leading-relaxed text-content-muted">
            Lascia vuoto un campo per rimuovere quel link. Gli URL devono essere completi e iniziare con
            http:// o https:// (massimo {USER_LINK_MAX_LENGTH} caratteri).
          </p>
        </div>

        {formError && (
          <p role="alert" className="mt-4 border-l-2 border-l-error bg-error/5 px-3 py-2 text-xs text-error">
            {formError}
          </p>
        )}

        <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-default pt-5">
          <Button type="button" variant="ghost" size="sm" disabled={saving} onClick={onCancel}>
            Annulla
          </Button>
          <Button type="submit" variant="primary" size="sm" disabled={!canSave}>
            {saving ? "Salvataggio..." : "Salva modifiche"}
          </Button>
        </div>
      </form>
    </section>
  );
}

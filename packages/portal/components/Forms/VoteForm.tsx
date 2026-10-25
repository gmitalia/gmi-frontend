import React, { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { prosList, consList } from "../../src/Constants"
import { Button } from "../commons/Button";
import { renderMarkdownPreview } from "../../src/markdown"
import { CloseIcon, InfoIcon } from "../commons/Icons";

const MIN_PROS_CONS = 2;

function uniqueSelection(values: unknown, max: number): number[] {
  if (!Array.isArray(values))
    return [];

  const result: number[] = [];
  const seen = new Set<number>();

  for (const value of values) {
    const index = Number(value);
    if (!Number.isInteger(index) || index < 0 || index >= max || seen.has(index))
      continue;

    seen.add(index);
    result.push(index);
  }

  return result;
}

function firstAvailableSelection(values: number[], max: number): number | null {
  const used = new Set(values);
  for (let index = 0; index < max; index++) {
    if (!used.has(index))
      return index;
  }

  return null;
}

type VoteFieldErrors = {
  score?: string;
  comment?: string;
  pros?: string;
  cons?: string;
};

function normalizeScore(value: unknown): number | null {
  if (value === null || value === undefined || value === "")
    return null;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

const MARKDOWN_ROWS = [
  { element: "Titolo", examples: ["# H1", "## H2", "### H3"] },
  { element: "Grassetto", examples: ["**testo grassetto**"] },
  { element: "Corsivo", examples: ["*testo corsivo*"] },
  { element: "Citazione", examples: ["> citazione"] },
  { element: "Lista numerata", examples: ["1. Primo elemento", "2. Secondo elemento", "3. Terzo elemento"] },
  { element: "Lista puntata", examples: ["- Primo elemento", "- Secondo elemento", "- Terzo elemento"] },
  { element: "Codice", examples: ["`codice`"] },
  { element: "Linea orizzontale", examples: ["---"] },
];

function MarkdownGuide({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape")
        onClose();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="markdown-guide-title"
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto border border-default bg-surface p-4 sm:p-5"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-default pb-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-content-muted">
              Commento
            </p>
            <h3 id="markdown-guide-title" className="mt-1 text-lg font-bold text-content">
              Sintassi Markdown
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Chiudi la guida Markdown"
            autoFocus
            className="shrink-0 p-1 text-content-muted transition-colors hover:bg-content/5 hover:text-content"
          >
            <CloseIcon size={16} />
          </button>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-content-muted">
          Questi elementi sono supportati nel commento e nell'anteprima.
        </p>

        <table className="mt-3 w-full border-collapse text-xs">
          <thead>
            <tr className="border-b border-default text-[10px] uppercase tracking-widest text-content-muted">
              <th className="py-2 pr-3 text-left font-semibold">Elemento</th>
              <th className="py-2 text-left font-semibold">Sintassi</th>
            </tr>
          </thead>
          <tbody>
            {MARKDOWN_ROWS.map((row) => (
              <tr key={row.element} className="border-b border-default align-top last:border-0">
                <td className="py-2 pr-3 font-medium text-content">{row.element}</td>
                <td className="py-2">
                  <div className="flex flex-col gap-1">
                    {row.examples.map((example) => (
                      <code
                        key={example}
                        className="w-fit max-w-full whitespace-pre-wrap break-words bg-surface-muted px-1.5 py-0.5 font-mono text-[11px] text-content"
                      >
                        {example}
                      </code>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="mt-3 border-t border-default pt-3 text-[11px] leading-relaxed text-content-muted">
          Lascia una riga vuota tra i paragrafi per separarli nell'anteprima.
        </p>
      </div>
    </div>,
    document.body
  );
}

export default function VoteForm(props) {
  const [score, setScore] = useState<number | null>(() => normalizeScore(props.score))
  const [pros, setPros] = useState(() => uniqueSelection(props.pros, prosList.length))
  const [cons, setCons] = useState(() => uniqueSelection(props.cons, consList.length))
  const [comment, setComment] = useState(props.comment || "")
  const [confirmed, setConfirmed] = useState(!!props.confirmed)
  const [dirty, setDirty] = useState(false)
  const [saved, setSaved] = useState(!!props.saved)
  const [savingAction, setSavingAction] = useState<"draft" | "confirm" | null>(null)
  const [fieldErrors, setFieldErrors] = useState<VoteFieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [mobileView, setMobileView] = useState<"write" | "preview">("write");
  const [showMarkdownGuide, setShowMarkdownGuide] = useState(false);

  const refTextarea = useRef<HTMLDivElement | null>(null);

  function markDirty() {
    setFormError(null)
    if (!dirty) {
      setDirty(true)
      props.onDirtyChange?.(props.index, true)
    }
  }

  function changeScore(event) {
    const raw = event.target.value
    const next = raw === "" ? null : Math.max(0, Math.min(100, Number(raw)))
    setScore(Number.isFinite(next as number) ? next : null)
    setFieldErrors(current => ({ ...current, score: undefined }))
    markDirty()
  }

  function changeComment(event) {
    setComment(event.target.value)
    setFieldErrors(current => ({ ...current, comment: undefined }))
    markDirty()
  }

  function addPros() {
    if (pros.length >= 3)
      return;

    const next = firstAvailableSelection(pros, prosList.length);
    if (next === null)
      return;

    setPros([...pros, next])
    setFieldErrors(current => ({ ...current, pros: undefined }))
    markDirty()
  }

  function deletePros(index) {
    let newPros = [...pros]
    newPros.splice(index, 1)
    setPros(newPros)
    setFieldErrors(current => ({ ...current, pros: undefined }))
    markDirty()
  }

  function changePros(event, index) {
    const value = Number(event.target.value);
    if (!Number.isInteger(value) || pros.some((item, itemIndex) => itemIndex !== index && item === value))
      return;

    let newPros = [...pros]
    newPros[index] = value
    setPros(newPros)
    setFieldErrors(current => ({ ...current, pros: undefined }))
    markDirty()
  }

  function addCons() {
    if (cons.length >= 3)
      return;

    const next = firstAvailableSelection(cons, consList.length);
    if (next === null)
      return;

    setCons([...cons, next])
    setFieldErrors(current => ({ ...current, cons: undefined }))
    markDirty()
  }

  function deleteCons(index) {
    let newCons = [...cons]
    newCons.splice(index, 1)
    setCons(newCons)
    setFieldErrors(current => ({ ...current, cons: undefined }))
    markDirty()
  }

  function changeCons(event, index) {
    const value = Number(event.target.value);
    if (!Number.isInteger(value) || cons.some((item, itemIndex) => itemIndex !== index && item === value))
      return;

    let newCons = [...cons]
    newCons[index] = value
    setCons(newCons)
    setFieldErrors(current => ({ ...current, cons: undefined }))
    markDirty()
  }

  function canSaveDraft(): boolean {
    const errors: VoteFieldErrors = {};

    if (score !== null && (!Number.isInteger(score) || score < 0 || score > 100))
      errors.score = "Inserisci un punteggio intero da 0 a 100.";
    if (pros.length > 3)
      errors.pros = "Puoi inserire al massimo 3 pro.";
    if (cons.length > 3)
      errors.cons = "Puoi inserire al massimo 3 contro.";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function canConfirm(): boolean {
    const errors: VoteFieldErrors = {};

    if (score === null || !Number.isInteger(score) || score < 0 || score > 100)
      errors.score = "Inserisci un punteggio intero da 0 a 100 prima di confermare.";
    if (!comment.trim())
      errors.comment = "Scrivi un commento prima di confermare.";
    if (pros.length + cons.length < MIN_PROS_CONS)
      errors.pros = "Inserisci almeno 2 pro/contro in totale prima di confermare.";
    if (pros.length > 3)
      errors.pros = "Puoi inserire al massimo 3 pro.";
    if (cons.length > 3)
      errors.cons = "Puoi inserire al massimo 3 contro.";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function submit(confirmedValue: boolean) {
    if (savingAction)
      return;

    if (confirmedValue ? !canConfirm() : !canSaveDraft())
      return;

    const data = {
      score: score,
      pros: pros,
      cons: cons,
      comment: comment,
      game_id: props.game_id,
      confirmed: confirmedValue,
    };

    setSavingAction(confirmedValue ? "confirm" : "draft");
    setFormError(null);

    props.onChange(data, props.index, (result) => {
      setSavingAction(null);

      if (!result?.success) {
        const errors = result?.errors || {};
        setFieldErrors({
          score: errors.score,
          comment: errors.comment,
          pros: errors.pros,
          cons: errors.cons,
        });
        setFormError(result?.error || "Impossibile salvare il voto.");
        return;
      }

      const savedConfirmed = typeof result.confirmed === "boolean"
        ? result.confirmed
        : confirmedValue;

      setConfirmed(savedConfirmed);
      setDirty(false);
      setSaved(true);
      setFieldErrors({});
      props.onDirtyChange?.(props.index, false);
    });
  }

  const onSaveDraft = () => submit(false);
  const onConfirm = () => submit(true);

  const usedPros = new Set(pros);
  const usedCons = new Set(cons);

  const getProsOptions = (current: number) =>
    prosList
      .map((label, value) => ({ label, value }))
      .filter(({ value }) => value === current || !usedPros.has(value));

  const getConsOptions = (current: number) =>
    consList
      .map((label, value) => ({ label, value }))
      .filter(({ value }) => value === current || !usedCons.has(value));

  const scoreValue = Math.max(0, Math.min(100, score ?? 0));
  const scoreId = `vote-score-${props.game_id}`;

  const saveDraftDisabled = savingAction !== null || !dirty;
  const confirmDisabled = savingAction !== null;
  const saveDraftLabel = !confirmed && saved && !dirty
    ? "Bozza salvata"
    : "Salva bozza";
  const confirmLabel = savingAction === "confirm"
    ? "Conferma..."
    : "Conferma voto";

  return (
    <div className="flex flex-col gap-5">
      {/* Score and actions */}
      <div className="border-b border-default pb-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-3">
            <label
              htmlFor={scoreId}
              className="w-full shrink-0 text-[10px] font-semibold uppercase tracking-[0.18em] text-content-muted sm:w-auto"
            >
              Punteggio
            </label>

            <div className="relative w-24 shrink-0">
              <input
                id={scoreId}
                type="number"
                min="0"
                max="100"
                inputMode="numeric"
                value={score ?? ""}
                onChange={changeScore}
                disabled={confirmed}
                placeholder="—"
                className="h-10 w-full border border-default bg-surface px-2 pr-9 text-center font-mono text-xl font-bold tabular-nums text-content outline-none transition-colors placeholder:text-content-muted/40 focus:border-secondary disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-content-muted"
              />
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 font-mono text-[10px] text-content-muted">
                /100
              </span>
            </div>

            <div className="min-w-[7rem] flex-1">
              <input
                type="range"
                min="0"
                max="100"
                value={score ?? 0}
                onChange={changeScore}
                disabled={confirmed}
                aria-label="Punteggio da 0 a 100"
                className="ds-range disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  background: `linear-gradient(to right, var(--ds-color-secondary) ${scoreValue}%, rgba(148, 163, 184, 0.25) ${scoreValue}%)`,
                }}
              />
              <div className="mt-1 flex justify-between font-mono text-[10px] text-content-muted">
                <span>0</span>
                <span>100</span>
              </div>
            </div>
          </div>
        </div>

        {fieldErrors.score && (
          <p role="alert" className="mt-3 border-l-2 border-l-error bg-error/5 px-3 py-1.5 text-xs text-error">
            {fieldErrors.score}
          </p>
        )}

        {formError && (
          <p role="alert" className="mt-3 border-l-2 border-l-error bg-error/5 px-3 py-1.5 text-xs text-error">
            {formError}
          </p>
        )}
      </div>

      {/* Comment and preview */}
      <div>
        <div className="mb-2 flex items-center justify-between gap-3 lg:hidden">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-content-muted">
            Commento
          </span>
          <div className="inline-flex border border-default">
            <button
              type="button"
              onClick={() => setMobileView("write")}
              aria-pressed={mobileView === "write"}
              className={`px-2.5 py-1 text-[11px] font-medium transition-colors ${
                mobileView === "write" ? "bg-gray-800 text-white" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Scrivi
            </button>
            <button
              type="button"
              onClick={() => setMobileView("preview")}
              aria-pressed={mobileView === "preview"}
              className={`px-2.5 py-1 text-[11px] font-medium transition-colors ${
                mobileView === "preview" ? "bg-gray-800 text-white" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Anteprima
            </button>
          </div>
        </div>

        <div className="mb-2 hidden items-baseline justify-between gap-3 lg:flex">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-content-muted">
            Commento
            <button
              type="button"
              onClick={() => setShowMarkdownGuide(true)}
              className="ml-2 inline-flex items-center gap-1 font-normal normal-case tracking-normal text-content-muted underline decoration-dotted underline-offset-2 transition-colors hover:text-content"
            >
              <InfoIcon size={12} />
              Markdown supportato
            </button>
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-content-muted">
            Anteprima
          </span>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className={mobileView === "preview" ? "hidden lg:block" : ""}>
            <textarea
              value={comment}
              onChange={changeComment}
              readOnly={confirmed}
              rows={8}
              placeholder="Scrivi la tua recensione dettagliata del gioco..."
              className={`h-44 w-full resize-none border border-default p-3 text-sm leading-relaxed text-content outline-none transition-colors placeholder:text-content-muted/40 focus:border-secondary ${
                confirmed ? "cursor-default bg-surface-muted text-content-muted" : "bg-surface"
              }`}
              onScroll={(e) => refTextarea.current && (refTextarea.current.scrollTop = (e.target as HTMLTextAreaElement).scrollTop)}
              onWheel={(e) => refTextarea.current && (refTextarea.current.scrollTop = (e.target as HTMLTextAreaElement).scrollTop)}
            />
          </div>

          <div className={mobileView === "write" ? "hidden lg:block" : ""}>
            <div
              ref={refTextarea}
              className="h-44 overflow-y-auto ds-scrollbar-modern border border-default bg-surface-muted p-3"
            >
              {comment.trim() ? (
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdownPreview(comment)
                  }}
                />
              ) : (
                <p className="text-xs text-content-muted">
                  L'anteprima del commento apparirà qui.
                </p>
              )}
            </div>
          </div>
        </div>

        {fieldErrors.comment && (
          <p role="alert" className="mt-3 border-l-2 border-l-error bg-error/5 px-3 py-1.5 text-xs text-error">
            {fieldErrors.comment}
          </p>
        )}

        <div className="mt-2 lg:hidden">
          <button
            type="button"
            onClick={() => setShowMarkdownGuide(true)}
            className="inline-flex items-center gap-1 text-[11px] text-content-muted underline decoration-dotted underline-offset-2 transition-colors hover:text-content"
          >
            <InfoIcon size={12} />
            Markdown supportato
          </button>
        </div>
      </div>

      {/* Pros and cons */}
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <div className="flex items-center justify-between gap-3 border-b border-default pb-2">
            <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-content-muted">
              <span className="h-1.5 w-1.5 bg-success" />
              Pro
              <span className="font-mono normal-case tracking-normal">({pros.length}/3)</span>
            </span>
            {!confirmed && (
              <Button
                variant="secondary"
                size="sm"
                disabled={pros.length >= 3 || prosList.length - pros.length === 0}
                onClick={addPros}
                aria-label="Aggiungi un pro"
                className="!px-2.5 !py-1 text-xs"
              >
                Aggiungi
              </Button>
            )}
          </div>

          <div className="mt-2 space-y-2">
            {pros.map((elem, index) => (
              <div key={index} className="flex items-center gap-2">
                <select
                  value={elem}
                  onChange={(e) => changePros(e, index)}
                  disabled={confirmed}
                  aria-label={`Pro ${index + 1}`}
                  className="ds-select min-w-0 flex-1 !py-1.5 text-[13px] disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-content-muted"
                >
                  {getProsOptions(Number(elem)).map(({ label, value }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                {!confirmed && (
                  <button
                    type="button"
                    onClick={() => deletePros(index)}
                    aria-label={`Rimuovi il pro ${index + 1}`}
                    className="shrink-0 px-2 py-1 text-[11px] font-medium text-error transition-colors hover:bg-error/10"
                  >
                    Rimuovi
                  </button>
                )}
              </div>
            ))}
            {pros.length === 0 && (
              <p className="py-2 text-xs text-content-muted">
                Nessun pro aggiunto.
              </p>
            )}
          </div>

          {fieldErrors.pros && (
            <p role="alert" className="mt-3 border-l-2 border-l-error bg-error/5 px-3 py-1.5 text-xs text-error">
              {fieldErrors.pros}
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between gap-3 border-b border-default pb-2">
            <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-content-muted">
              <span className="h-1.5 w-1.5 bg-error" />
              Contro
              <span className="font-mono normal-case tracking-normal">({cons.length}/3)</span>
            </span>
            {!confirmed && (
              <Button
                variant="secondary"
                size="sm"
                disabled={cons.length >= 3 || consList.length - cons.length === 0}
                onClick={addCons}
                aria-label="Aggiungi un contro"
                className="!px-2.5 !py-1 text-xs"
              >
                Aggiungi
              </Button>
            )}
          </div>

          <div className="mt-2 space-y-2">
            {cons.map((elem, index) => (
              <div key={index} className="flex items-center gap-2">
                <select
                  value={elem}
                  onChange={(e) => changeCons(e, index)}
                  disabled={confirmed}
                  aria-label={`Contro ${index + 1}`}
                  className="ds-select min-w-0 flex-1 !py-1.5 text-[13px] disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-content-muted"
                >
                  {getConsOptions(Number(elem)).map(({ label, value }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                {!confirmed && (
                  <button
                    type="button"
                    onClick={() => deleteCons(index)}
                    aria-label={`Rimuovi il contro ${index + 1}`}
                    className="shrink-0 px-2 py-1 text-[11px] font-medium text-error transition-colors hover:bg-error/10"
                  >
                    Rimuovi
                  </button>
                )}
              </div>
            ))}
            {cons.length === 0 && (
              <p className="py-2 text-xs text-content-muted">
                Nessun contro aggiunto.
              </p>
            )}
          </div>

          {fieldErrors.cons && (
            <p role="alert" className="mt-3 border-l-2 border-l-error bg-error/5 px-3 py-1.5 text-xs text-error">
              {fieldErrors.cons}
            </p>
          )}
        </div>
      </div>

      {confirmed ? (
        <p className="text-[11px] leading-relaxed text-content-muted">
          Voto confermato: i contenuti non sono più modificabili. Puoi riportarlo in bozza per riprendere la modifica.
        </p>
      ) : (
        <p className="text-[11px] leading-relaxed text-content-muted">
          Per confermare servono un punteggio da 0 a 100, un commento e almeno 2 pro/contro in totale (massimo 3 per categoria).
        </p>
      )}

      <div className="w-full p-3">
        {confirmed ? (
          <div className="mt-3 flex justify-center">
            <Button
              variant="primary"
              size="md"
              disabled={savingAction !== null}
              onClick={onSaveDraft}
            >
              {savingAction === "draft" ? "Riporto in bozza..." : "Riporta in bozza"}
            </Button>
          </div>
        ) : (
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <Button
              variant="secondary"
              size="md"
              disabled={saveDraftDisabled}
              onClick={onSaveDraft}
              className="w-full sm:flex-1"
            >
              {savingAction === "draft" ? "Salvataggio..." : saveDraftLabel}
            </Button>
            <Button
              variant="primary"
              size="md"
              disabled={confirmDisabled}
              onClick={onConfirm}
              className="w-full sm:flex-1"
            >
              {confirmLabel}
            </Button>
          </div>
        )}
      </div>

      {showMarkdownGuide && (
        <MarkdownGuide onClose={() => setShowMarkdownGuide(false)} />
      )}
    </div>
  );
}

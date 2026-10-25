import React, { useEffect, useState } from "react";
import { Config, ParticipantType } from "../../src/Constants";
import GMIApi from "../../src/api/GMIApi";
import { Button } from "../commons/Button";
import { ImageIcon } from "../commons/Icons";
import { Toast, ToastVariant } from "../commons/Toast";

const InputClasses =
  "w-full border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-400";
const LabelClasses =
  "block text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500";
const MetaClasses = "text-[11px] font-mono text-gray-400";
const RequiredMark = () => <span className="text-error">*</span>;

export default function GameForm(props) {
  const partecipation = props.participation || {};
  const isJoined = Boolean(props.participation);
  const isJudge = partecipation.kind == String(ParticipantType.judge);

  let [gameName, setGameName] = useState(partecipation.game_name || "");
  let [gameUrl, setGameUrl] = useState(partecipation.game_url || "");
  let [gameShortDesc, setGameShortDesc] = useState(partecipation.game_short_desc || "");
  let [gameDesc, setGameDesc] = useState(partecipation.game_desc || "");

  const initial_img_url = partecipation.game_thumbnail ? GMIApi.getInstance().imageURL + partecipation.game_thumbnail : "";
  let [gameThumbnail, setGameThumbnail] = useState(initial_img_url);
  let [imgError, setImgError] = useState(false);

  let [saved, setSaved] = useState(true);
  let [error, setError] = useState<string>();
  let [file, setFile] = useState<File>();
  let [uploading, setUploading] = useState<boolean>(false);
  let [toast, setToast] = useState<{ message: string; variant: ToastVariant } | null>(null);

  const isUrlValid = gameUrl === "" || /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(gameUrl);
  const formValid = isUrlValid && gameName.trim() !== "" && gameShortDesc.trim() !== "" && gameThumbnail;

  useEffect(() => {
    if (props.participation) {
      const p = props.participation;
      setGameName(p.game_name || "");
      setGameUrl(p.game_url || "");
      setGameShortDesc(p.game_short_desc || "");
      setGameDesc(p.game_desc || "");

      if (p.game_thumbnail) {
        setGameThumbnail(GMIApi.getInstance().imageURL + p.game_thumbnail);
        setImgError(false);
      }
    }
  }, [props.participation]);

  function handleChange() {
    setUploading(true);
    setError(null);
    props.onFormSubmit(
      {
        name: gameName,
        downloadUrl: gameUrl,
        shortDescription: gameShortDesc,
        description: gameDesc,
        thumbnailFile: file,
      },
      (data) => {
        setUploading(false);

        if (!data.success) {
          const message = data.error || "Impossibile salvare le modifiche. Riprova.";
          setError(message);
          setToast({ message, variant: "error" });
          setSaved(false);
          return;
        }

        setSaved(true);
        setToast({
          message: isJoined
            ? "Modifiche al gioco salvate con successo."
            : "Partecipazione inviata: il gioco è iscritto alla competizione.",
          variant: "success",
        });
      });
  }

  function handleDeletion() {
    if (confirm("Vuoi disiscriverti e cancellare il gioco? Questa operazione è irreversibile."))
      props.onDelete();
  }

  function handleThumbnail(file) {
    if (!file) return;
    if (file.size > Config.maxThumbnailSize)
      return setError("L'immagine è troppo grande (" + Math.ceil(file.size / 1024) + "KB)");

    var reader = new FileReader();
    reader.onload = (event) => {
      setGameThumbnail(event.target.result);
      setImgError(false);
    };

    reader.readAsDataURL(file);

    setFile(file);
    setError(null);
    setSaved(false);
  }

  return (
    <div className="mx-auto w-full max-w-5xl border border-gray-200 bg-white">
      <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between md:p-8">
        <div className="min-w-0">
          <span
            className={`inline-flex items-center border border-gray-200 border-l-[3px] bg-white px-2.5 py-1.5 text-[10px] font-semibold uppercase leading-none tracking-[0.18em] text-gray-700 ${
              isJudge ? "border-l-warning" : "border-l-success"
            }`}
          >
            {isJoined
              ? `Iscritto come ${isJudge ? "Giudice" : "Partecipante"}`
              : "Nuova iscrizione"}
          </span>

          <h2 className="mt-3 text-2xl font-bold text-gray-900">
            Informazioni Gioco
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {isJoined
              ? "Aggiorna i dati del tuo gioco per la competizione."
              : "Completa i campi per iscrivere il tuo gioco alla competizione."}
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          {isJoined && (
            <Button
              variant="danger"
              size="md"
              disabled={uploading}
              onClick={handleDeletion}
              className="w-full sm:w-auto"
            >
              Disiscriviti
            </Button>
          )}
          <Button
            variant="primary"
            size="md"
            disabled={saved || uploading || !formValid}
            onClick={handleChange}
            className="w-full sm:w-auto"
          >
            {uploading ? "Salvataggio..." : "Salva Modifiche"}
          </Button>
        </div>
      </div>

      <div className="border-t border-gray-200 p-6 md:p-8">
        {error && (
          <div className="mb-8 border border-error/20 bg-error/10 p-4 text-sm font-medium text-error">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-7">
            <label className="block">
              <span className={LabelClasses}>
                Nome del Gioco <RequiredMark />
              </span>
              <input
                type="text"
                value={gameName}
                placeholder="Es. Click The Ball"
                maxLength={128}
                className={`${InputClasses} mt-2`}
                onChange={(e) => { setGameName(e.target.value); setSaved(false); }}
              />
            </label>

            <div>
              <label className="block">
                <div className="mb-2 flex items-end justify-between gap-3">
                  <span className={LabelClasses}>Link Download</span>
                  {gameUrl && (
                    isUrlValid ? (
                      <span className="border border-success/20 bg-success/5 px-2 py-1 text-[10px] font-semibold uppercase leading-none tracking-[0.16em] text-success">
                        Valido
                      </span>
                    ) : (
                      <span className="border border-error/20 bg-error/5 px-2 py-1 text-[10px] font-semibold uppercase leading-none tracking-[0.16em] text-error">
                        URL non valido
                      </span>
                    )
                  )}
                </div>
                <input
                  type="text"
                  maxLength={256}
                  value={gameUrl}
                  placeholder="https://tuosito.com/download.zip"
                  className={`${InputClasses} ${gameUrl && !isUrlValid ? "border-error/60 focus:border-error" : ""}`}
                  onChange={(e) => { setGameUrl(e.target.value); setSaved(false); }}
                />
              </label>
              <p className="mt-2 text-xs leading-5 text-gray-500">
                Puoi iscriverti ora e inserire il link del gioco in un secondo momento, ma ricordati di farlo prima della scadenza della competizione.
              </p>
            </div>

            <label className="block">
              <div className="mb-2 flex items-end justify-between gap-3">
                <span className={LabelClasses}>
                  Descrizione Breve <RequiredMark />
                </span>
                <span className={MetaClasses}>{gameShortDesc.length}/256</span>
              </div>
              <textarea
                value={gameShortDesc}
                maxLength={256}
                rows={4}
                placeholder="Una breve descrizione del gioco o frase d'effetto"
                className={`${InputClasses} resize-none`}
                onChange={(e) => { setGameShortDesc(e.target.value); setSaved(false); }}
              />
            </label>
          </div>

          <div>
            <label className="block">
              <div className="mb-2 flex items-end justify-between gap-3">
                <span className={LabelClasses}>
                  Copertina <RequiredMark />
                </span>
                <span className={MetaClasses}>
                  Max {Config.maxThumbnailSize / 1024}KB
                </span>
              </div>

              <div className="group relative flex aspect-video w-full cursor-pointer flex-col items-center justify-center overflow-hidden border border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-gray-400">
                {gameThumbnail && (!imgError || gameThumbnail.startsWith("data:")) ? (
                  <>
                    <img
                      alt="Anteprima copertina"
                      src={gameThumbnail}
                      onError={() => {
                        if (gameThumbnail && gameThumbnail.startsWith("http")) {
                          setImgError(true);
                        }
                      }}
                      className="absolute inset-0 h-full w-full object-contain transition-opacity group-hover:opacity-60"
                    />
                    <div className="pointer-events-none absolute right-3 top-3 border border-gray-200 bg-white px-2 py-1 text-[10px] font-semibold uppercase leading-none tracking-[0.16em] text-gray-600">
                      Modifica
                    </div>
                  </>
                ) : (
                  <div className="pointer-events-none flex h-full w-full flex-col items-center justify-center gap-3 px-4 text-center">
                    <ImageIcon size={32} className="text-gray-300" />
                    <span className="text-sm font-medium text-gray-600">
                      {file ? `File selezionato: ${file.name}` : "Clicca per caricare un'immagine"}
                    </span>
                  </div>
                )}

                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.gif"
                  className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleThumbnail(e.target.files[0]);
                    }
                  }}
                />
              </div>
            </label>

            <p className="mt-2 text-xs leading-5 text-gray-500">
              Formati supportati: PNG, JPG o GIF. Formato consigliato 4:3.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8">
          <label className="block">
            <div className="mb-2 flex items-end justify-between gap-3">
              <span className={LabelClasses}>Descrizione Completa</span>
              <span className={MetaClasses}>
                {gameDesc.length}/{Config.descriptionMaxLength}
              </span>
            </div>
            <textarea
              value={gameDesc}
              className={`${InputClasses} min-h-[260px]`}
              placeholder="Descrivi dettagliatamente il tuo gioco. Parla della trama, del gameplay e di ciò che lo rende unico"
              maxLength={Config.descriptionMaxLength}
              onChange={(e) => { setGameDesc(e.target.value); setSaved(false); }}
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400">
            <RequiredMark /> campi obbligatori
          </p>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          variant={toast.variant}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

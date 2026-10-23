import React, { useEffect, useState } from "react";
import { Config, ParticipantType } from "../../src/Constants";
import GMIApi from "../../src/api/GMIApi";
import { Button } from "../commons/Button";


const InputClasses = "w-full px-4 py-3 bg-surface border border-default rounded-md text-content placeholder:text-content-muted/40 focus:outline-none focus:border-content/40 transition-colors";
const LabelClasses = "block text-xs font-semibold text-content-muted uppercase tracking-wider mb-2";

export default function GameForm(props) {
  const contestId = props.contestId;
  const partecipation = props.participation || {};
  const img_url = "";

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
    props.onFormSubmit(
      {
        name: gameName,
        downloadUrl: gameUrl,
        shortDescription: gameShortDesc,
        description: gameDesc,
        thumbnailFile: file,
      },
      (data) => {
        if (!data.success)
          setError(data.error);

        setSaved(data.success);
        setUploading(false);
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
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface border border-default p-6 md:p-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-content tracking-tight">Informazioni Gioco</h2>
          <p className="text-content-muted text-sm mt-1">Completa i campi per {props.participation?.id ? "aggiornare" : "partecipare"}</p>
        </div>

        <div className="flex gap-3">
          {props.participation && (
            <Button
              variant="danger"
              size="md"
              disabled={uploading}
              onClick={handleDeletion}
              className="!px-6 !py-3"
            >
              Disiscriviti
            </Button>
          )}
          <Button
            variant="primary"
            size="md"
            disabled={saved || uploading || !formValid}
            onClick={handleChange}
            className="!px-8 !py-3"
          >
            {uploading ? 'Salvataggio...' : 'Salva Modifiche'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-error/10 border border-error/30 text-error p-4 text-sm font-medium">
          {error}
        </div>
      )}

      <div className="bg-surface border border-default p-6 md:p-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <label className="block group">
              <span className={LabelClasses}>Nome del Gioco <span className="text-error">*</span></span>
              <input
                type="text"
                value={gameName}
                placeholder="Es. Click The Ball"
                maxLength={128}
                className={InputClasses}
                onChange={(e) => { setGameName(e.target.value); setSaved(false); }}
              />
            </label>

            <div className="block group">
              <label className="block">
                <div className="flex justify-between items-end mb-2">
                  <span className={LabelClasses}>Link Download</span>
                  {gameUrl && (
                    isUrlValid ?
                      <span className="text-success text-[10px] font-semibold uppercase tracking-wider bg-success/10 px-2 py-0.5">Valido</span> :
                      <span className="text-error text-[10px] font-semibold uppercase tracking-wider bg-error/10 px-2 py-0.5">URL Non Valido</span>
                  )}
                </div>
                <input
                  type="text"
                  maxLength={256}
                  value={gameUrl}
                  placeholder="https://tuosito.com/download.zip"
                  className={`${InputClasses} ${gameUrl && !isUrlValid ? 'border-error/50 focus:border-error/50 focus:ring-error/50' : ''}`}
                  onChange={(e) => { setGameUrl(e.target.value); setSaved(false); }}
                />
              </label>
              <p className="text-xs text-content-muted mt-2">
                Puoi iscriverti ora e inserire il link del gioco in un secondo momento, ma ricordati di farlo prima della scadenza della competizione!
              </p>
            </div>

            <label className="block group">
              <div className="flex justify-between items-end mb-2">
                <span className={LabelClasses}>Descrizione Breve <span className="text-error">*</span></span>
                <span className="text-xs font-mono text-content-muted">{gameShortDesc.length}/256</span>
              </div>
              <textarea
                value={gameShortDesc}
                maxLength={256}
                rows={3}
                placeholder="Una breve descrizione del gioco o frase d'effetto"
                className={`${InputClasses} resize-none`}
                onChange={(e) => { setGameShortDesc(e.target.value); setSaved(false); }}
              />
            </label>
          </div>

          <div className="space-y-8">
            <label className="block">
              <div className="flex justify-between items-end mb-2">
                <span className={LabelClasses}>Copertina <span className="text-error">*</span></span>
                <div className="flex gap-3">
                  <span className="text-xs font-mono text-content-muted border border-default px-2 py-0.5">Consigliato 4:3</span>
                  <span className="text-xs font-mono text-content-muted py-0.5">Max {Config.maxThumbnailSize / 1024}KB</span>
                </div>
              </div>
              <div className="relative w-full aspect-video rounded-md border border-dashed border-default hover:border-content/40 bg-surface flex flex-col items-center justify-center overflow-hidden transition-colors group cursor-pointer">
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
                      className="absolute inset-0 w-full h-full object-contain opacity-100 group-hover:opacity-60 transition-opacity"
                    />
                    <div className="absolute top-4 right-4 bg-surface border border-default text-content px-2 py-1 text-xs pointer-events-none">
                      Modifica
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-3 text-content-muted h-full w-full pointer-events-none">
                    <span className="text-sm font-medium text-center px-4">
                      {file ? `File selezionato: ${file.name}` : "Clicca per caricare un'immagine"}
                    </span>
                  </div>
                )}
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.gif"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleThumbnail(e.target.files[0]);
                    }
                  }}
                />
              </div>
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-default">
          <label className="block group">
            <div className="flex justify-between items-end mb-2">
              <span className={LabelClasses}>Descrizione Completa</span>
              <span className="text-xs font-mono text-content-muted">{gameDesc.length}/{Config.descriptionMaxLength}</span>
            </div>
            <textarea
              value={gameDesc}
              className={`${InputClasses} min-h-[300px]`}
              placeholder="Descrivi dettagliatamente il tuo gioco. Parla della trama, del gameplay e di ciò che lo rende unico"
              maxLength={Config.descriptionMaxLength}
              onChange={(e) => { setGameDesc(e.target.value); setSaved(false); }}
            />
          </label>
        </div>

        <div className="flex justify-end pt-2">
          <p className="text-[10px] font-semibold text-content-muted uppercase tracking-wider">
              <span className="text-error">*</span> campi obbligatori
          </p>
        </div>
      </div>
    </div>
  );
}

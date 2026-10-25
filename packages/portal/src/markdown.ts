import { Marked } from "./marked";

/**
 * Parser condiviso per i commenti Markdown del portale.
 *
 * I titoli setext (`Testo\n--` / `Testo\n===`) sono disabilitati: una riga
 * composta solo da trattini o uguali non deve trasformare il paragrafo
 * precedente in un titolo. I titoli ATX (`# Titolo`) restano supportati.
 */
const markdown = new Marked({
  breaks: true,
  tokenizer: {
    lheading: () => undefined,
  },
});

export function renderMarkdown(source: string) {
  return markdown.parse(source);
}

/**
 * Anteprima del commento.
 *
 * Usa lo stesso parser del rendering definitivo: inserire caratteri
 * segnaposto per conservare le righe vuote impediva di riconoscere citazioni,
 * linee orizzontali e altri blocchi Markdown.
 */
export function renderMarkdownPreview(source: string) {
  return markdown.parse(source);
}

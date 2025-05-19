import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'resourceCategories',
  title: 'Category Resource',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nome',
      type: 'string'
    }),
    defineField({
      name: 'description',
      title: 'Descrizione',
      type: 'text'
    }),
    defineField({
      name: 'color',
      title: 'Colore',
      type: 'string',
      description: 'Colore HEX per la categoria (es: #FF0000)',
      validation: Rule => Rule.regex(/^#([0-9A-Fa-f]{6})$/, {
        name: 'hex color',
        invert: false,
        message: 'Inserisci un colore HEX valido, es: #FF0000'
      })
    }),
    defineField({
      name: 'group',
      title: 'Ordine gruppo (numero intero, usato per ordinamento chip)',
      type: 'number',
      description: 'Numero intero per ordinare le categorie nel filtro (es: 0, 1, 2, ...). Lascia vuoto per mettere all\'inizio.'
    })
  ]
})
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'resource',
  type: 'document',
  title: 'Resource',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      title: 'Nome risorsa'
    }),
    defineField({
      name: 'description',
      type: 'string',
      title: 'Descrizione',
    }),
    defineField({
      name: 'url',
      type: 'string',
      title: 'URL',
    }),
    defineField({
      name: 'resourceCategories',
      title: 'Categoria',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'resourceCategories' } }],
    }),
  ]
})
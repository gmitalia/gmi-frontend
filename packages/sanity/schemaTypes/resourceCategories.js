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
    })
  ]
})
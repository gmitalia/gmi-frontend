import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'code',
  title: 'code',
  type: 'string',
  fields: [
    defineField({
      name: 'code',
      title: 'code',
      type: 'code',
    })
  ],
})
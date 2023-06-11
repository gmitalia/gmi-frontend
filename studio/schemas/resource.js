export default {
  name: 'resource',
  type: 'document',
	title: 'Resource',
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Nome risorsa'
    },
    {
      name: "description",
      type: "string",
      title: "Descrizione",
    },
    {
      name: "url",
      type: "string",
      title: "URL",
    },
    {
      name: "resourceCategories",
      title: "Categoria",
      type: "array",
      of: [{ type: "reference", to: { type: "resourceCategories" } }],
    },
  ]
}
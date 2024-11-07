import React from 'react'
import getYouTubeId from 'get-youtube-id'
import YouTube from 'react-youtube'
import { defineType, defineField } from 'sanity'

const Preview = ({ value }) => {
  const { url } = value
  const id = getYouTubeId(url)
  return (<YouTube videoId={id} />)
}

export default defineType({
  name: 'youtube',
  type: 'object',
  title: 'YouTube Embed',
  fields: [
    defineField({
      name: 'url',
      type: 'url',
      title: 'YouTube video URL'
    })
  ],
  preview: {
    select: {
      url: 'url'
    },
    component: Preview
  }
})
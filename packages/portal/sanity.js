import { createClient } from '@sanity/client'
import createImageUrlBuilder from '@sanity/image-url'


export const config = {
    dataset: 'production',
    projectId: 'idfqw720',
    useCdn: process.env.NODE_ENV === "production",
    apiVersion: '2021-12-28',
};

export const sanityClient = createClient(config);

export const urlFor = (source) => createImageUrlBuilder(config).image(source);

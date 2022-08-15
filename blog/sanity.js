import {
    createCurrentUserHook,
    createClient
} from 'next-sanity'
import createImageUrlBuilder from '@sanity/image-url'


export const config = {
    dataset: 'production',
    projectId: 'idfqw720',
    userCdn: process.env.NODE_ENV === "production",
    apiVersion: '2021-12-28',
};

export const sanityClient = createClient(config);

export const urlFor = (source) => createImageUrlBuilder(config).image(source);

export const useCurrentUser = createCurrentUserHook(config);
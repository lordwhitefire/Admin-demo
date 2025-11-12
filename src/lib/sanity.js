// src/lib/sanity.js
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
  dataset: 'production',
  token: process.env.REACT_APP_SANITY_TOKEN,
  useCdn: false,
  apiVersion: '2024-01-01',
});

const builder = imageUrlBuilder(client);
export const urlFor = (source) => builder.image(source);
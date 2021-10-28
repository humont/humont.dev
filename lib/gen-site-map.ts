import fs from 'fs';
import { getAllPosts } from './api';

export const generateSiteMap = async () => {
  const posts = getAllPosts(['slug'], true);
  const siteUrl = 'https://humont.dev';

  const siteMap = `
    <?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!--We manually set the two URLs we know already-->
     <url>
       <loc>${siteUrl}</loc>
     </url>
     <url>
       <loc>${siteUrl}/posts</loc>
     </url>
     ${posts
       .map(({ slug }) => {
         return `
       <url>
           <loc>${`${siteUrl}/${slug}`}</loc>
       </url>
     `;
       })
       .join('')}
   </urlset>
    `;

  fs.writeFileSync('./public/sitemap.xml', siteMap);
};

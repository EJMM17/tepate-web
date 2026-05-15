import { defineCollection, z } from 'astro:content';

const productCategory = z.enum([
  'calderas',
  'remolques',
  'maquinas',
  'zapatas',
  'senalamiento',
]);

const productos = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      slug: z.string().min(1),
      title: z.string().min(1),
      category: productCategory,
      description: z.string().min(1),
      model: z.string().min(1),
      capacity: z.string().optional(),
      mainImage: image(),
    }),
});

const servicios = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    imageSrc: z.string().min(1),
  }),
});

export const collections = { productos, servicios };

export type ProductCategory = z.infer<typeof productCategory>;

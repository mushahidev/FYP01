'use client'
import React from 'react'
import Link from 'next/link'

//import { Category } from '../../../../payload/payload-types'
import { Category, Media } from '../../../../payload/payload-types' // Imported Media from payload-types
import { useFilter } from '../../../_providers/Filter'

import classes from './index.module.scss'

type CategoryCardProps = {
  category: Category
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  const media = category.media as Media || null;// Added 'null' as a possible value for media
  const { setCategoryFilters } = useFilter()

  return (
    <Link
      href="/products"
      // Add a null check for media and provide a fallback background image
      style={{ backgroundImage: media?.url ? `url(${media.url})` : 'url(/path-to-fallback-image.jpg)' }}
      //style={{ backgroundImage: `url(${media.url})` }}
      onClick={() => setCategoryFilters([category.id])}
    >
      <p className={classes.title}>{category.title}</p>
    </Link>
  )
}

export default CategoryCard

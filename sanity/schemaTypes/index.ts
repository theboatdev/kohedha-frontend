import {authorType} from './authorType'
import {blockContentType} from './blockContentType'
import {categoryType} from './categoryType'
import {dealType} from './dealType'
import {dealCategoryType} from './dealCategoryType'
import {eventType} from './eventType'
import {eventCategoryType} from './eventCategoryType'
import {googleMapsLocationType} from './googleMapsLocationType'
import {locationType} from './locationType'
import {organizerType} from './organizerType'
import {placeType} from './placeType'
import {placeCategoryType} from './placeCategoryType'
import {postType} from './postType'

export const schema = {
  types: [postType, authorType, categoryType, dealType, dealCategoryType, eventType, eventCategoryType, googleMapsLocationType, locationType, organizerType, placeType, placeCategoryType, blockContentType],
}

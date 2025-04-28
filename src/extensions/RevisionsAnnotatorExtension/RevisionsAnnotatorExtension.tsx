import { AnnotoriousPlugin } from '@annotorious/react';
import { mountPlugin } from './mountPlugin';

export const RevisionsAnnotatorExtension = () => {
 
  return (
    <AnnotoriousPlugin plugin={mountPlugin} />
  )
  
}
import { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PencilLine } from '@phosphor-icons/react';
import { AnnotationEditorExtensionProps, SupabaseAnnotation } from '@recogito/studio-sdk';
import { useAnnotator } from '@annotorious/react';
import type { 
  AnnotoriousOpenSeadragonAnnotator, 
  ImageAnnotation, 
  ImageAnnotationTarget 
} from '@annotorious/react';

import './RevisionsEditorExtension.css';

export const RevisionsEditorExtension = (props: AnnotationEditorExtensionProps ) => {

  // Early return if this is NOT a read-only annotation
  if (!props.isReadOnly || !props.isSelected) return null;

  const anno = useAnnotator<AnnotoriousOpenSeadragonAnnotator>();

  const annotation = useMemo(() => {
    const selected = anno.getSelected();
    if (selected.length === 1) return selected[0] as SupabaseAnnotation;
  }, []);

  const activeLayer = useMemo(() => {
    if (!props.layers) return;

    const active = props.layers.find(l => l.is_active);
    return active?.id;
  }, [props.layers]);

  const onCloneToActiveLayer = () => {
    // Should never happen
    if (!activeLayer) return;

    // Should never happen
    if (!annotation) return;

    const { id: origId, bodies, target } = annotation;

    const id = uuidv4(); 

    const clone = {
      id,
      layer_id: activeLayer,
      bodies: [...bodies.map(b => ({
        ...b,
        id: uuidv4(),
        annotation: id,
        creator: props.me,
        created: new Date,
        updated: undefined,
        updatedBy: undefined
      })), {
        // Bit of an ad-hoc solution: add a marker body
        // with a custom 'correctig' purpose to establish
        // the link to the original annotation.
        id: uuidv4(),
        annotation: id,
        purpose: 'correcting',
        value: origId
      }],
      target: {
        ...target,
        creator: props.me,
        created: new Date(),
        updated: undefined,
        updatedBy: undefined
      } as ImageAnnotationTarget
    };

    anno.state.store.addAnnotation(clone as ImageAnnotation);
    anno.setSelected(id);
  }

  // Note: an annotation may be visible to the user, even if it has a 
  // correction! (Because of filter settings!) In this case, we don't 
  // want to show the editor extension.
  const canMakeEditable = annotation && !(anno as any).hasCorrection(annotation);

  return canMakeEditable ? (
    <div className="create-revision">
      <button onClick={onCloneToActiveLayer}>
        <PencilLine size={18} /> Make Editable
      </button>
      <p>
        Creates an editable copy, hiding the original annotation.
      </p>
    </div>
  ) : null;

}
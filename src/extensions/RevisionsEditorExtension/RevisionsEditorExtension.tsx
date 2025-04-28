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

  const anno = useAnnotator<AnnotoriousOpenSeadragonAnnotator>();

  const activeLayer = useMemo(() => {
    if (!props.layers) return;

    const active = props.layers.find(l => l.is_active);
    return active?.id;
  }, [props.layers]);

  const onCloneToActiveLayer = () => {
    // Should never happen
    if (!activeLayer) return;

    const selected = anno.getSelected();

    // Should never happen
    if (selected.length !== 1) return;

    const { id: origId, bodies, target } = selected[0] as SupabaseAnnotation;

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

  return (
    <div className="create-revision">
      <button onClick={onCloneToActiveLayer}>
        <PencilLine size={18} /> Make Editable
      </button>
      <p>
        Creates an editable copy, hiding the original annotation.
      </p>
    </div>
  )

}
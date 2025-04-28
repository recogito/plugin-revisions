import type { AstroIntegration } from "astro";
import { Plugin, registerPlugin } from "@recogito/studio-sdk";

const RevisionsPlugin: Plugin = {

  name: 'Recogito Revisions Plugin',

  module_name: '@recogito/plugin-revisions',

  description: 'A plugin that adds basic annotation revision functionality to Recogito Studio.',

  author: 'Performant Software',

  homepage: 'https://www.performantsoftware.com/',

  extensions: [{
    name: 'revisions-annotator-extension',
    component_name: 'RevisionsAnnotatorExtension',
    extension_point: 'annotation:*:annotator'
  },{
    name: 'revisions-editor-extension',
    component_name: 'RevisionsEditorExtension',
    extension_point: 'annotation:*:annotation-editor'
  }]

};

const plugin = (): AstroIntegration => ({
  name: '@recogito/plugin-revisions',
  hooks: {
    'astro:config:setup': ({ config, logger }) => {
      registerPlugin(RevisionsPlugin, config, logger);
    },
  },
});

export default plugin;
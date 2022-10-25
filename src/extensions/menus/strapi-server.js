'use strict';

module.exports = plugin => {
  // Get current `MenuItem` attributes.
  const defaultAttrs = plugin.contentTypes[ 'menu-item' ].schema.attributes;

  // Define custom attributes for `MenuItem` the same way they would be defined
  // on any other schema.
  const customAttrs = {

    example_text: {
      type: 'string',
    },

    example_relation_one: {
      type: 'relation',
      relation: 'oneToOne',
      target: 'api::artticle.artticle',
    },
    // "menus_relation": {
    //   "type": "relation",
    //   "relation": "oneToOne",
    //   "target": "plugin::artticle.slug",
    //   "inversedBy": "artticle"
    // }

  };

  // Extend the `MenuItem` content type with custom attributes.
  plugin.contentTypes[ 'menu-item' ].schema.attributes = {
    ...defaultAttrs,
    ...customAttrs,
  };

  console.log("plugin",plugin.contentTypes[ 'menu-item' ].schema)

  return plugin;
};

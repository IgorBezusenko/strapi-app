module.exports = {
  menus: {
    config: {
      maxDepth: 3,
      layouts: {
        menuItem: {
          link: [
            {
              input: {
                label: 'slug',
                name: 'example_relation_one',
                type: 'relation',

              },

            },
          ],

          select: [

            {
              input: {
                label: 'slug',
                name: 'example_relation_one',
                type: 'relation',
              },
            },

          ],

        },
      },
    },
  },
};

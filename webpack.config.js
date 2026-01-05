const path = require('path');

/** @type {import('webpack').Configuration} */
module.exports = {
  resolve: {
    alias: {
      // Force all React imports to resolve to Angular app's React instance
      // This prevents duplicate React instances when importing from ui-lib-react
      'react': path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      'react/jsx-runtime': path.resolve(__dirname, 'node_modules/react/jsx-runtime'),
      'react-dom/client': path.resolve(__dirname, 'node_modules/react-dom/client'),
    },
    // Ensure symlinked packages resolve modules from the correct location
    symlinks: true,
  },
};

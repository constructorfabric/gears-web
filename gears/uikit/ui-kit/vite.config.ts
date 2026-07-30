import nodeExternals from 'rollup-plugin-node-externals';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    sourcemap: true,
    minify: false,
    rolldownOptions: {
      output: {
        // preserveModules mirrors every bundled module's source path into dist,
        // keeping the package tree-shakeable per component. nodeExternals()
        // externalizes only dependencies/peerDependencies — see the telemetry
        // gear's vite config for the caveat about runtime devDependency imports.
        preserveModules: true,
      },
    },
    lib: {
      entry: {
        index: 'src/index.ts',
      },
      formats: ['es'],
    },
  },
  plugins: [
    nodeExternals(),
    dts({
      outDir: 'dist',
      entryRoot: './src',
      tsconfigPath: 'tsconfig.build.json',
    }),
  ],
});

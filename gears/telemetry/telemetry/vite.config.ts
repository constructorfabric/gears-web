/// <reference types="vitest/config" />
import nodeExternals from 'rollup-plugin-node-externals';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    sourcemap: true,
    minify: false,
    rolldownOptions: {
      output: {
        // preserveModules mirrors every bundled module's source path into dist.
        // nodeExternals() externalizes only dependencies/peerDependencies, so a
        // runtime import of a devDependency gets bundled and emitted under
        // dist/node_modules — a folder npm always excludes from the published
        // tarball, silently breaking the package. If this package ever needs to
        // bundle a devDependency, replace preserveModules with
        // codeSplitting: { includeDependenciesRecursively: false, groups: [{ name }] }
        // plus preserveEntrySignatures: 'allow-extension'.
        preserveModules: true,
      },
    },
    lib: {
      entry: {
        client: 'client.ts',
      },
      formats: ['es'],
    },
  },
  plugins: [
    nodeExternals(),
    dts({
      outDir: 'dist',
      tsconfigPath: 'tsconfig.build.json',
      // Do not enable rollupTypes: api-extractor drops the `declare global { interface Element }`
      // augmentation in src/plugins/autocapture/elementHook.ts, which is part of the public
      // element-hook contract. See the OSS checklist for the attw InternalResolutionError this
      // leaves open and the two candidate fixes.
    }),
  ],
  test: {
    coverage: {
      // *.* - exclude files in root(all configs)
      exclude: ['*.*'],
    },
    globalSetup: './vitest.global-setup.ts',
    environment: 'happy-dom',
  },
});

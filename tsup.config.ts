import { defineConfig } from 'tsup'
//import * as preset from 'tsup-preset-solid'

// const preset_options: PresetOptions = {
//     entries: [
//         { entry: 'src/index.ts' },
//     ],
//     cjs: false,
// }

// export default defineConfig(config => {
//     const watching = !!config.watch

//     //let parsedPresetOptions = preset.parsePresetOptions(preset_options, watching);
//     // const parsed_data = {
//     //     ...parsedPresetOptions,
//     //     modify_esbuild_options: (options, permutation) => {
//     //         let result = parsedPresetOptions.modify_esbuild_options(options, permutation)
//     //         //options.sourceMapsEnabled = true;
//     //         result.sourcemap = true;
//     //         return result;
//     //     }
//     // }

//     if (!watching) {
//         //const package_fields = preset.generatePackageExports(parsed_data)
//         //console.log(`\npackage.json: \n${JSON.stringify(package_fields)}\n\n`)
//         //preset.writePackageJson(package_fields)
//     }
//     //let result = preset.generateTsupOptions(parsed_data);
//     //console.log("config", JSON.stringify(result));
//     return result;
// })

export default defineConfig({
    entry: ['src/index.ts']
})
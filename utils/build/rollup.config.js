// rollup.config.js
const builds = [
	{
		input: 'src/FZY.js',
		output: [
			{
				format: 'esm',
				file: 'build/FZY.module.js'
			}
		]
	},
	{
		input: 'src/FZY.js',
		output: [
			{
				format: 'esm',
				file: 'build/FZY.module.min.js'
			}
		]
	}
];

export default ( args ) => args.configOnlyModule ? builds[ 0 ] : builds;

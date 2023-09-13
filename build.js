const esbuild = require( 'esbuild' );
const fs = require( 'fs' );
const AdmZip = require( 'adm-zip' );
const UglifyJS = require( 'uglify-js' );
const roadroller = require( 'roadroller' );

esbuild.build( {
	entryPoints: ['./src/index.js'],
	bundle: true,
	outfile: './dist/t.js',
	drop: [ 'console' ],
	minify: true,
	loader: { '.png': 'dataurl' },
} ).then( () => {

	// Tiny gains from running uglifyJS. ESBuild is semi-uglified already ... Let's pick up the gains anyway.
	const jsSource = fs.readFileSync( './dist/t.js', 'utf8' );
	const uglifiedSource = UglifyJS.minify( jsSource, {
		compress: {},
		mangle: true,
	} );

	// Pass to roadroller to further compress source.
	const inputs = [
		{
			data: uglifiedSource.code,
			type: 'js',
			action: 'eval',
		},
	];
	
	const options = {
		// see the Usage for available options.
	};
	
	const packer = new roadroller.Packer( inputs, options );
	packer.optimize().then( () => {
		const { firstLine, secondLine } = packer.makeDecoder();

		fs.writeFileSync( './dist/t.js', firstLine + secondLine, 'utf8' );

		const zip = new AdmZip();
		zip.addLocalFolder( './dist/' );
		zip.writeZip( 'temujin.zip' );

		const stats = fs.statSync( './temujin.zip' );
		const fileSize = stats.size;

		if ( fileSize > 13312 ) {
			console.error( "Your zip compressed game is larger than 13kb (13312 bytes)!" );
			console.log( "Your zip compressed game is " + fileSize + " bytes" );
		} else {
			console.log( 'Your zip compressed game is ' + fileSize + '/13312 bytes.' );
		}
	} );
} );



import * as esbuild from 'esbuild'
import fs from 'fs'
import AdmZip from 'adm-zip';

await esbuild.build({
	entryPoints: ['./src/index.js'],
	bundle: true,
	outfile: './dist/temujin.js',
	drop: [ 'console' ],
	minify: true,
	loader: { '.png': 'dataurl' },
} );



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
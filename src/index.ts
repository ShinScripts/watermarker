import ffmpeg from 'fluent-ffmpeg';
import consola from 'consola';
import { readdirSync } from 'fs';

const main = async function () {
	const videos = readdirSync('./videos/');
	const watermark = readdirSync('.').find((i) => i.toLowerCase() === 'watermark.png');

	if (videos.length == 0) {
		consola.error('Videos folder is currently empty, make sure to add all the videos you want watermarked!');
		return;
	}

	if (!watermark) {
		consola.error(
			'Cannot find a file named "watermark.png" in this directory, make sure to add it and run me again!'
		);
		return;
	}

	for (const video of videos) {
		ffmpeg(`./videos/${video}`)
			.input('./watermark.png')
			.complexFilter([`overlay=(W-w)/2:(H-h)/2`])
			.saveToFile(`./output/${video}`)
			.on('start', () => consola.info(`START: Starting the render of ${video}`))
			.on('progress', (progress) => consola.info(`UPDATE (${video}): processing frame ${progress.frames}`))
			.on('end', () => consola.success(`FINISHED: ${video} render finished`))
			.on('error', (err) => consola.error(`${err}`));
		console.log('\n');
	}
};

main();

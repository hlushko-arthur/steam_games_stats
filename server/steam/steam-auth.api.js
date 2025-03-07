import express from 'express';
import { EAuthTokenPlatformType, LoginSession } from 'steam-session';
import { io } from '../server.js';

const router = express.Router();

router.get('/qr', async (req, res) => {
	qrCodeAuth();
})
async function qrCodeAuth() {
	let session = new LoginSession(EAuthTokenPlatformType.MobileApp);
	session.loginTimeout = 120000; // timeout after 2 minutes
	let startResult = await session.startWithQR();

	let qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(startResult.qrChallengeUrl || '');

	io.emit('qrCode', { url: qrUrl });

	console.log(`Open QR code: ${qrUrl}`);

	session.on('remoteInteraction', () => {
		console.log('Looks like you\'ve scanned the code! Now just approve the login.');
	});

	session.on('authenticated', async () => {
		console.log('\nAuthenticated successfully! Printing your tokens now...');
		console.log(`SteamID: ${session.steamID}`);
		console.log(`Account name: ${session.accountName}`);
		console.log(`Access token: ${session.accessToken}`);
		console.log(`Refresh token: ${session.refreshToken}`);

		let webCookies = await session.getWebCookies();
		console.log('Web session cookies:');
		console.log(webCookies);
	});

	session.on('timeout', () => {
		console.log('This login attempt has timed out.');
	});

	session.on('error', (err) => {
		console.log(`ERROR: This login attempt has failed! ${err.message}`);
	});
}

export default router;
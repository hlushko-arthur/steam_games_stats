import express from 'express';
import { EAuthTokenPlatformType, LoginSession } from 'steam-session';
import { io } from '../server.js';
import User from '../user/user.collection.js';

const router = express.Router();

router.get('/qr', async (req, res) => {
	qrCodeAuth();
})
async function qrCodeAuth() {
	let session = new LoginSession(EAuthTokenPlatformType.MobileApp);
	session.loginTimeout = 120000; // timeout after 2 minutes
	let startResult = await session.startWithQR();

	let qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(startResult.qrChallengeUrl || '');

	io.emit('qrCode', qrUrl);

	session.on('remoteInteraction', () => {
		console.log('Looks like you\'ve scanned the code! Now just approve the login.');
	});

	session.on('authenticated', async () => {
		console.log(session.steamID);

		let user = await User.findOne({
			steamId: session.steamID
		})

		if (!user) {
			user = new User({
				steamId: session.steamID,
				ACCESS_TOKEN: session.accessToken,
				REFRESH_TOKEN: session.refreshToken,
			})

			await user.save();
		} else {
			await User.updateOne({
				steamId: session.steamID
			}, {
				ACCESS_TOKEN: session.accessToken,
				REFRESH_TOKEN: session.refreshToken,
			})

			user = await User.findOne({
				steamId: session.steamID
			})
		}

		io.emit('authenticated', {
			method: 'qr',
			steamId: session.steamID
		})
	});

	session.on('timeout', () => {
		console.log('This login attempt has timed out.');
	});

	session.on('error', (err) => {
		console.log(`ERROR: This login attempt has failed! ${err.message}`);
	});
}

export default router;
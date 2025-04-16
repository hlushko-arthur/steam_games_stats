import express from 'express';
import { EAuthTokenPlatformType, LoginSession, EAuthSessionGuardType, EResult } from 'steam-session';
import { io } from '../server.js';
import User from '../user/user.collection.js';
import { socketUsers } from '../server.js';

const router = express.Router();

const sessions = {};

router.get('/qr', async (req, res) => {
	let session = new LoginSession(EAuthTokenPlatformType.MobileApp);

	session.loginTimeout = 60000;

	let startResult = await session.startWithQR();

	let qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(startResult.qrChallengeUrl || '');

	io.emit('qrCode', qrUrl);

	session.on('remoteInteraction', () => {
		console.log('Looks like you\'ve scanned the code! Now just approve the login.');
	});

	session.on('authenticated', async () => {
		const steamId = String(session.steamID);

		saveUser(session)

		io.to(socketUsers[req.cookies.SUID]).emit('authenticated', steamId)
	});

	session.on('timeout', () => {
		console.log('This login attempt has timed out.');
	});

	session.on('error', (err) => {
		console.log(`ERROR: This login attempt has failed! ${err.message}`);
	});

	res.sendResponse(200, qrUrl);
})

router.post('/login', async (req, res) => {
	try {
		const session = new LoginSession(EAuthTokenPlatformType.SteamClient);
		session.loginTimeout = 60000;

		sessions[req.cookies.SUID] = session;

		let startResult = await session.startWithCredentials({
			accountName: req.body.accountName,
			password: req.body.password
		});

		if (startResult.actionRequired) {
			console.log('Action is required from you to complete this login');

			let promptingGuardTypes = [EAuthSessionGuardType.EmailCode, EAuthSessionGuardType.DeviceCode];
			let promptingGuards = startResult.validActions.filter(action => promptingGuardTypes.includes(action.type));
			let nonPromptingGuards = startResult.validActions.filter(action => !promptingGuardTypes.includes(action.type));

			session.on('steamGuardMachineToken', () => {
				console.log('\nReceived new Steam Guard machine token');
				console.log(`Machine Token: ${session.steamGuardMachineToken}`);
			});

			session.on('authenticated', async () => {
				const steamId = String(session.steamID);

				saveUser(session);

				io.to(socketUsers[req.cookies.SUID]).emit('authenticated', steamId);
			});

			session.on('timeout', () => {
				console.log('This login attempt has timed out.');
			});

			session.on('error', (err) => {
				// This should ordinarily not happen. This only happens in case there's some kind of unexpected error while
				// polling, e.g. the network connection goes down or Steam chokes on something.
				console.log(`ERROR: This login attempt has failed! ${err.message}`);
			});

			const result = [];

			let printGuard = async ({ type, detail }) => {
				try {
					switch (type) {
						case EAuthSessionGuardType.EmailCode:
							result.push('EmailCode');
							break;

						case EAuthSessionGuardType.DeviceCode:
							result.push('DeviceCode');
							break;

						case EAuthSessionGuardType.EmailConfirmation:
							result.push('Email Confirmation');
							break;

						case EAuthSessionGuardType.DeviceConfirmation:
							result.push('DeviceConfirmation')
							break;
					}
				} catch (ex) {
					if (ex.eresult == EResult.TwoFactorCodeMismatch) {
						printGuard({ type, detail });
					} else {
						throw ex;
					}
				}
			};

			nonPromptingGuards.forEach(printGuard);
			promptingGuards.forEach(printGuard);

			res.sendResponse(200, result);

			return;
		}

		res.sendResponse(200);
	} catch (error) {
		let code = error.message === 'InvalidPassword' ? 401 : 500;

		console.log(error.message);


		res.sendError(code, error.message);
	}
})

router.post('/send_guard_code', async (req, res) => {
	try {
		await sessions[req.cookies.SUID].submitSteamGuardCode(req.body.code);
	} catch (error) {
		console.log(error);

		res.sendError(500, error.message || error);
	}
})

async function saveUser(session) {
	const steamId = session.steamID;

	let user = await User.findOne({
		steamId: steamId
	})

	console.log('accessToken');
	console.log(session.accessToken);


	console.log('steamId', steamId);




	if (!user) {
		user = new User({
			steamId: steamId,
			ACCESS_TOKEN: session.accessToken,
			REFRESH_TOKEN: session.refreshToken,
		})

		await user.save();
	} else {
		await User.updateOne({
			steamId: steamId
		}, {
			ACCESS_TOKEN: session.accessToken,
			REFRESH_TOKEN: session.refreshToken,
		})

		user = await User.findOne({
			steamId: steamId
		})
	}
}

export default router;
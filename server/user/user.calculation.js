const PLAYTIME_CATEGORIES = [
	{ threshold: 60000, title: '1000+ hours' },
	{ threshold: 30000, title: '500-1000 hours' },
	{ threshold: 12000, title: '200-500 hours' },
	{ threshold: 6000, title: '100-200 hours' },
	{ threshold: 3000, title: '50-100 hours' },
	{ threshold: 1500, title: '25-50 hours' },
	{ threshold: 600, title: '10-25 hours' },
	{ threshold: 300, title: '5-10 hours' },
	{ threshold: 180, title: '3-5 hours' },
	{ threshold: 120, title: '2-3 hours' },
	{ threshold: 60, title: '1-2 hours' },
	{ threshold: 1, title: '0-1 hours' },
	{ threshold: 0, title: 'Never played' }
];

const COST_CATEGORIES = [
	{ threshold: 5500, title: '$55.00 and higher' },
	{ threshold: 4000, title: '$40.00 - $54.99' },
	{ threshold: 2500, title: '$25.00 - $39.99' },
	{ threshold: 1000, title: '$10.00 - $24.99' },
	{ threshold: 600, title: '$6.00 - $9.99' },
	{ threshold: 200, title: '$2.00 - $5.99' },
	{ threshold: 1, title: '$0.01 - $1.99' },
	{ threshold: 0, title: 'No price' },
];

export function getGamesStats(games) {
	const playtimeCategories = PLAYTIME_CATEGORIES.reduce((acc, { title }) => {
		acc[title] = 0;
		return acc;
	}, {});

	const costCategories = COST_CATEGORIES.reduce((acc, { title }) => {
		acc[title] = 0;
		return acc;
	}, {});

	let freeGamesCount = 0;

	let noPlayedGamesCount = 9;

	let totalPlaytime = 0;

	let totalPricePerHour = 0;

	for (const game of games) {
		const playtimeCategory = categorizeGame(PLAYTIME_CATEGORIES, game.playtime);

		const costCategory = categorizeGame(COST_CATEGORIES, game.price.initial);

		playtimeCategories[playtimeCategory]++;

		costCategories[costCategory]++;

		if (!game.price.initial || game.price.initial === 0) {
			freeGamesCount++;
		}

		totalPlaytime += game.playtime || 0;

		if (!game.playtime) {
			noPlayedGamesCount++;
		}

		if (game.price.initial && game.playtime) {
			totalPricePerHour += game.price.initial / game.playtime;
		}
	}

	const averageGamesPrice = '$' + (games.reduce((total, game) => total += game.price.initial || 0, 0) / (games.length - freeGamesCount)
		/ 100).toFixed(2);

	const totalGamesPrice = '$' + (games.reduce((total, { price }) => total += price.initial || 0, 0) / 100).toFixed(0);

	const todayGamesPrice = '$' + (games.reduce((total, { price }) => total += price.final || 0, 0) / 100).toFixed(0);

	const averagePlaytime = Math.round(totalPlaytime / (games.length - noPlayedGamesCount));

	const pricePerHour = '$' + ((totalPricePerHour / (games.length - freeGamesCount)) / 100).toFixed(2);

	return {
		gamesByCost: COST_CATEGORIES.map(({ title }) => ({
			title,
			value: costCategories[title]
		})),
		gamesByPlaytime: PLAYTIME_CATEGORIES.map(({ title }) => ({
			title,
			value: playtimeCategories[title]
		})),
		averageGamesPrice,
		totalGamesPrice,
		todayGamesPrice,
		totalPlaytime,
		averagePlaytime,
		pricePerHour
	}
}

function categorizeGame(category, value) {
	const result = category.find(({ threshold }) => value >= threshold);

	return result?.title;
}

export function getBansStats(bans) {
	return [
		{
			title: 'VAC bans',
			value: bans.VAC ? '' : 'In good standing'
		},
		{
			title: 'Game bans',
			value: bans.game ? '' : 'In good standing'
		},
		{
			title: 'Trade ban',
			value: bans.economy ? '' : 'In good standing'
		},
		{
			title: 'Community ban',
			value: bans.community ? '' : 'In good standing'
		}
	]
}

export function getCustomizationStats(user) {
	return [
		{
			title: 'Background',
			value: user.background.title
		},
		{
			title: 'Mini profile',
			value: user.miniBackground.title
		},
		{
			title: 'Avatar',
			value: user.avatar.title
		},
		{
			title: 'Avatar frame',
			value: user.avatarFrame.title
		}
	]
}

export function getUserStats(profile) {
	const gamesStats = getGamesStats(profile.games);

	const totalGamesCount = profile.games.length;
	const playedGamesCount = profile.games.filter(({ playtime }) => playtime > 0).length;
	const playedGamesPercent = Math.round(playedGamesCount / totalGamesCount * 100);

	return {
		level: profile.user.level,
		avatar: profile.user.avatar,
		background: profile.user.background,
		avatarFrame: profile.user.avatarFrame,
		...gamesStats,
		badges: getBadgesStats(profile.user.badges),
		bans: getBansStats(profile.user.bans),
		customization: getCustomizationStats(profile.user),
		name: profile.user.name,
		timeCreated: profile.user.timeCreated,
		steamId: profile.steamId,
		totalGamesCount,
		playedGamesCount,
		playedGamesPercent
	};
}

function getBadgesStats(badges) {
	let specialBadges = 0;
	let defaultBadges = 0;
	let foilBadges = 0;
	let levels = {
		1: 0,
		2: 0,
		3: 0,
		4: 0,
		5: 0,
		"6+": 0
	};

	for (const badge of badges) {
		if (badge.border_color === 1) {
			foilBadges++;
		}

		if (badge.level <= 5) {
			levels[badge.level]++;
		} else {
			levels['6+']++;
		}

		if ('appid' in badge) {
			defaultBadges++;
		} else {
			specialBadges++;
		}
	};

	return [
		{
			title: 'Special badges',
			value: specialBadges
		},
		{
			title: 'Default badges',
			value: defaultBadges
		},
		{
			title: 'Foil badges',
			value: foilBadges
		},
		{
			title: 'Level 1',
			value: levels['1']
		},
		{
			title: 'Level 2',
			value: levels['2']
		},
		{
			title: 'Level 3',
			value: levels['3']
		},
		{
			title: 'Level 4',
			value: levels['4']
		},
		{
			title: 'Level 5',
			value: levels['5']
		},
		{
			title: 'Level 6 and higher',
			value: levels['6+']
		}
	]
}
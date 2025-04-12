export async function getUserInformation(steamId) {
	const user = await getPlayerSummaries(steamId);

	await sleep(500);

	const avatar = await getPlayerAvatar(steamId);

	await sleep(500);

	const { totalXP, badges } = await getPlayerBadges(steamId);

	const level = await getPlayerLevel(totalXP);

	await sleep(500);

	const bans = await getPlayerBans(steamId);

	await sleep(500)

	const background = await getProfileBackground(steamId);

	await sleep(500);

	const miniBackground = await getMiniProfileBackground(steamId);

	await sleep(500);

	const avatarFrame = await getAvatarFrame(steamId);

	return {
		...user,
		avatar,
		badges,
		bans,
		level,
		background,
		miniBackground,
		avatarFrame
	}
}

async function getPlayerSummaries(steamId) {
	try {
		const url = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${API_KEY}&steamids=${steamId}`;

		const response = await fetch(url);
		const data = await response.json();

		const user = data.response.players[0];

		return {
			name: user.personaname,
			timeCreated: user.timecreated,
			steamId: user.steamid,
		}
	} catch (error) {
		throw error;
	}
}

async function getPlayerBadges(steamId) {
	try {
		const url = `https://api.steampowered.com/IPlayerService/GetBadges/v1/?key=${API_KEY}&steamid=${steamId}`;

		const response = await fetch(url);
		const data = await response.json();

		const badges = data.response.badges;

		let specialBadges = 0;
		let normalBadges = 0;
		let foilBadges = 0;
		let totalXP = 0;

		let levels = {
			1: 0,
			2: 0,
			3: 0,
			4: 0,
			5: 0,
			"6+": 0
		};

		for (const badge of badges) {
			totalXP += badge.xp;

			if (badge.border_color === 1) {
				foilBadges++;
			}

			if (badge.level <= 5) {
				levels[badge.level]++;
			} else {
				levels['6+']++;
			}

			if ('appid' in badge) {
				normalBadges++;
			} else {
				specialBadges++;
			}
		};

		return {
			totalXP,
			badges: {
				special: specialBadges,
				default: normalBadges,
				foil: foilBadges,
				levels: {
					'1': levels[1],
					'2': levels[2],
					'3': levels[3],
					'4': levels[4],
					'5': levels[5],
					'6+': levels['6+']
				},
				items: badges.map((badge) => {
					return {
						_id: badge.badgeid,
						level: badge.level,
						xp: badge.xp,
						appId: badge.appId,
						isFoil: badge.border_color === 1
					}
				})
			}
		}
	} catch (error) {
		throw error;
	}
}

async function getPlayerBans(steamId) {
	try {
		const url = `http://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=${API_KEY}&steamids=${steamId}`;

		const response = await fetch(url);
		const data = (await response.json()).players[0];


		return {
			VAC: data.VACBanned,
			game: Boolean(data.NumberOfGameBans),
			community: data.CommunityBanned,
			economy: data.EconomyBan !== 'none'
		}
	} catch (error) {
		throw error;
	}
}

async function getPlayerAvatar(steamId) {
	try {
		const url = `https://api.steampowered.com/IPlayerService/GetAnimatedAvatar/v1/?key=${API_KEY}&steamid=${steamId}`;

		const response = await fetch(url);
		const data = await response.json();

		const avatarData = data.response.avatar;

		return {
			title: avatarData.item_title,
			appId: avatarData.appid,
			type: avatarData.item_type,
			class: avatarData.item_class,
			icon: avatarData.image_large.match(/\/([0-9A-z]*)\./)[1],
			iconAnimated: avatarData.image_small.match(/\/([0-9A-z]*)\./)[1],
		}
	} catch (error) {
		throw error;
	}
}

async function getAvatarFrame(steamId) {
	try {
		const url = `https://api.steampowered.com/IPlayerService/GetAvatarFrame/v1/?key=${API_KEY}&steamid=${steamId}`;

		const response = await fetch(url);
		const data = await response.json();

		const frame = data.response.avatar_frame;

		return {
			title: frame.item_title,
			appId: frame.appid,
			type: frame.item_type,
			class: frame.item_class,
			icon: frame.image_large.match(/\/([0-9A-z]*)\./)[1],
			iconAnimated: frame.image_small.match(/\/([0-9A-z]*)\./)[1],
		}
	} catch (error) {
		throw error;
	}
}

async function getProfileBackground(steamId) {
	try {
		const url = `https://api.steampowered.com/IPlayerService/GetProfileBackground/v1/?key=${API_KEY}&steamid=${steamId}`;

		const response = await fetch(url);
		const data = await response.json();

		const background = data.response.profile_background;

		return {
			title: background.item_title,
			appId: background.appid,
			type: background.item_type,
			class: background.item_class,
			icon: background.image_large.match(/\/([0-9A-z]*)\./)[1],
			iconAnimated: background.movie_webm.match(/\/([0-9A-z]*)\./)[1],
		}
	} catch (error) {
		throw error;
	}
}

async function getMiniProfileBackground(steamId) {
	try {
		const url = `https://api.steampowered.com/IPlayerService/GetMiniProfileBackground/v1/?key=${API_KEY}&steamid=${steamId}`;

		const response = await fetch(url);
		const data = await response.json();

		const background = data.response.profile_background;

		return {
			title: background.item_title,
			appId: background.appid,
			type: background.item_type,
			class: background.item_class,
			icon: background.image_large.match(/\/([0-9A-z]*)\./)[1],
			iconAnimated: background.movie_webm.match(/\/([0-9A-z]*)\./)[1],
		}
	} catch (error) {
		throw error;
	}
}

async function getPlayerLevel(totalXP) {
	try {
		let remainingXP = totalXP;
		let level = 0;

		while (true) {
			const multiplier = level < 10 ? 1 : Math.floor(level / 10) + 1;

			const requiredXP = multiplier * 100;

			if (remainingXP < requiredXP) {
				return {
					currentXP: remainingXP,
					totalXP: totalXP,
					nextLevelXP: requiredXP,
					value: level,
				};
			}

			remainingXP -= requiredXP;

			level++;
		}
	} catch (error) {
		throw error;
	}
}

export async function getUserGames(steamId, accessToken) {
	const baseUrl = 'https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/';

	const params = new URLSearchParams({
		steamid: steamId,
		include_appinfo: true,
		include_played_free_games: true
	})

	if (accessToken) {
		params.append('access_token', accessToken);
	} else {
		params.append('key', API_KEY);
	}

	const url = `${baseUrl}?${params.toString()}`;

	try {
		const response = await axios.get(url);
		return response.data.response.games || [];
	} catch (error) {
		throw error;
	}
}

async function getGameAchievements(appId, steamId) {
	try {
		const url = `https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${API_KEY}&appid=${appId}`;

		const response = await axios.get(url);

		if (!response.data.game.availableGameStats) {
			return [];
		}

		const achievements = (response.data.game.availableGameStats.achievements || []).reduce((obj, item) => {
			obj[item.name] = item;
			return obj;
		}, {});

		const userAchievements = await getUserAchievementsForGame(appId, steamId) || []

		const percentageAchievements = await getAchievementPercentageForGame(appId);

		for (const _achievement of userAchievements) {
			achievements[_achievement.apiname].unlockTime = _achievement.unlocktime;

			achievements[_achievement.apiname].achieved = true;
		}

		for (const _achievement of percentageAchievements) {
			achievements[_achievement.name].rarity = _achievement.percent;
		}

		const regex = /\/([A-z0-9]*)\.jpg/

		return Object.values(achievements).map((achievement) => {
			return {
				appId: appId,
				icon: achievement.icon.match(regex)[1],
				iconGray: achievement.icongray.match(regex)[1],
				displayName: achievement.displayName,
				name: achievement.name,
				description: achievement.description,
				achieved: achievement.achieved ?? false,
				unlockTime: achievement.unlockTime,
				rarity: achievement.rarity,
			}
		});
	} catch (error) {
		throw error;
	}
}

async function getUserAchievementsForGame(appId, steamId) {
	try {
		const url = `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/?key=${API_KEY}&steamid=${steamId}&appid=${appId}`;

		const response = await fetch(url);
		const data = await response.json();
		return (data.playerstats.achievements || []).filter((achievement) => achievement.achieved);
	} catch (error) {
		throw error;
	}
}

async function getAchievementPercentageForGame(appId) {
	try {
		const url = `https://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v2/?key=${API_KEY}&gameid=${appId}`;

		const response = await axios.get(url);
		return response.data.achievementpercentages.achievements || [];
	} catch (error) {
		throw error;
	}
}

async function getGameDetails(appId) {
	try {
		const url = `https://store.steampowered.com/api/appdetails?appids=${appId}&cc=US&l=en&filters=developers,publishers,price_overview,release_date,genres,metacritic`;

		const response = await axios.get(url);

		if (!response.data[appId].success) {
			return {};
		}

		let data = response.data[appId].data;

		data = {
			developer: data.developers[0],
			publisher: data.publishers[0],
			price: {
				currency: data.price_overview?.currency || 'USD',
				value: data.price_overview?.final ?? 0,
				formatted: data.price_overview?.final_formatted || '$0'
			},
			genres: (data.genres || []).map((genre) => genre.description),
			releaseDate: data.release_date.date,
			metacritic: data.metacritic
		}

		return data;
	} catch (error) {
		throw error;
	}
}

async function getGameReviews(appId) {
	try {
		const url = `https://store.steampowered.com/appreviews/${appId}?json=1&language=all&num_per_page=0&purchase_type=all`;

		const response = await axios.get(url);

		const data = {
			totalPositive: response.data.query_summary.total_positive,
			totalNegative: response.data.query_summary.total_negative,
			score: response.data.query_summary.review_score,
			rating: Number((response.data.query_summary.total_positive / (response.data.query_summary.total_positive + response.data.query_summary.total_negative) * 100).toFixed(2)) || 0
		}

		return data;
	} catch (error) {
		throw error;
	}
}
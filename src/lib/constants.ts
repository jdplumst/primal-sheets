export const STALE_TIME = {
	FIVE_MINUTES: 5 * 60 * 1000,
	FIFTEEN_MINUTES: 15 * 60 * 1000,
	ONE_HOUR: 60 * 60 * 1000,
} as const;

export const QUERY_KEY = {
	CAMPAIGNS: {
		CAMPAIGN_ID: (campaignId: string) => ["campaigns", campaignId],
	},
};

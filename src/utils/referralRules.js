export const REFERRAL_LEVELS = [
    { level: 1, percent: '14%', requiredDirects: 1 },
    { level: 2, percent: '8%', requiredDirects: 2 },
    { level: 3, percent: '4%', requiredDirects: 4 },
    { level: 4, percent: '2%', requiredDirects: 7 },
    ...Array.from({ length: 16 }, (_, i) => ({
        level: i + 5,
        percent: '1%',
        requiredDirects: 12
    })) // Levels 5-20
];

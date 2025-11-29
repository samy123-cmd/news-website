export const CATEGORY_IMAGES: Record<string, string[]> = {
    "World": [
        "https://images.unsplash.com/photo-1529243856184-4f8c17728c47?w=800&q=80", // General News
        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80", // Globe
        "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80"  // Newspaper
    ],
    "Business": [
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80", // Chart
        "https://images.unsplash.com/photo-1611974765270-ca1258634369?w=800&q=80", // Stock
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80"  // Skyscraper
    ],
    "Technology": [
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80", // Chip
        "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&q=80", // Code
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80"  // Matrix
    ],
    "Entertainment": [
        "https://images.unsplash.com/photo-1499364615650-ec38552f4f34?w=800&q=80", // Concert
        "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=800&q=80", // Movie
        "https://images.unsplash.com/photo-1514525253440-b393452e3720?w=800&q=80"  // Party
    ],
    "Sports": [
        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80", // Sport generic
        "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80", // Football
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80"  // Gym/Active
    ],
    "Science": [
        "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&q=80", // Microscope
        "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80", // Lab
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80"  // Space
    ],
    "Health": [
        "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80", // Stethoscope
        "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&q=80", // Healthy food
        "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80"  // Fitness
    ],
    "General": [
        "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80",
        "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&q=80",
        "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&q=80"
    ],
    "Opinion": [
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80", // Writing/Journal
        "https://images.unsplash.com/photo-1576670159805-381a9de1e243?w=800&q=80", // Debate/Discussion
        "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=800&q=80"  // Megaphone/Voice
    ]
};

export function getImageForCategory(category: string): string {
    const images = CATEGORY_IMAGES[category] || CATEGORY_IMAGES["General"];
    return images[Math.floor(Math.random() * images.length)];
}

// Demo mode data — Mesa Group (fictional 5-location Southwestern restaurant group)

export const DEMO_MODE_KEY = 'rzh_demo_mode';

export function isDemoMode() {
  return localStorage.getItem(DEMO_MODE_KEY) === 'true';
}

export function enableDemoMode() {
  localStorage.setItem(DEMO_MODE_KEY, 'true');
}

export function disableDemoMode() {
  localStorage.removeItem(DEMO_MODE_KEY);
}

export const DEMO_USER = {
  id: 'demo',
  name: 'Demo User',
  email: 'demo@mesagrouputah.com',
  avatar_url: null,
  plan: 'growth',
};

export const DEMO_LOCATIONS = [
  {
    id: '1',
    name: 'Mesa Group — Downtown',
    address: '242 S Main St, Salt Lake City, UT 84101',
    pubsub_registered: true,
    avg_rating: 4.7,
    total_reviews: 64,
    pending_replies: 2,
    response_rate: 92,
  },
  {
    id: '2',
    name: 'Mesa Group — Provo',
    address: '1290 N University Ave, Provo, UT 84604',
    pubsub_registered: true,
    avg_rating: 4.5,
    total_reviews: 48,
    pending_replies: 1,
    response_rate: 88,
  },
  {
    id: '3',
    name: 'Mesa Group — Sugarhouse',
    address: '2100 S 1100 E, Salt Lake City, UT 84106',
    pubsub_registered: true,
    avg_rating: 4.4,
    total_reviews: 37,
    pending_replies: 3,
    response_rate: 73,
  },
  {
    id: '4',
    name: 'Mesa Group — Sandy',
    address: '9400 S State St, Sandy, UT 84070',
    pubsub_registered: false,
    avg_rating: null,
    total_reviews: 0,
    pending_replies: 0,
    response_rate: null,
  },
  {
    id: '5',
    name: 'Mesa Group — Lehi',
    address: '3600 N Digital Dr, Lehi, UT 84043',
    pubsub_registered: false,
    avg_rating: null,
    total_reviews: 0,
    pending_replies: 0,
    response_rate: null,
  },
];

export const DEMO_REVIEWS = [
  {
    id: 'r1',
    location_id: '1',
    location_name: 'Mesa Group — Downtown',
    reviewer_name: 'Sarah M.',
    star_rating: 5,
    review_text:
      'Best green chile in Salt Lake City — and I have been searching for years. The carne adovada plate is massive and packed with flavor. Service was fast and friendly even on a busy Friday night. This place is the real deal. Already planning my next visit.',
    review_time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    draft_status: 'pending',
    draft_text:
      "Thank you so much, Sarah! Finding the best green chile in SLC is serious business and we don't take that compliment lightly. Our team puts a lot of love into the carne adovada and it means everything to hear it shows. We can't wait to see you again soon — next time try the green chile smothered breakfast burrito! — The Mesa Group Downtown Team",
  },
  {
    id: 'r2',
    location_id: '3',
    location_name: 'Mesa Group — Sugarhouse',
    reviewer_name: 'James T.',
    star_rating: 2,
    review_text:
      'Waited over 40 minutes for food on a Tuesday afternoon when the restaurant was maybe half full. The food was good once it arrived but nobody checked on us the entire time. Felt forgotten. Used to love this place but the service has really slipped lately.',
    review_time: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    draft_status: 'pending',
    draft_text:
      "James, thank you for being honest with us — this is not the experience we want for any of our guests. A 40-minute wait with no check-ins on a quiet afternoon is simply not acceptable and we take full responsibility. We've shared your feedback directly with the Sugarhouse team. We'd love the chance to earn your trust back — please reach out to us at sugarhouse@mesagrouputah.com and we'll make your next visit right. — The Mesa Group Sugarhouse Team",
  },
  {
    id: 'r3',
    location_id: '2',
    location_name: 'Mesa Group — Provo',
    reviewer_name: 'Emily R.',
    star_rating: 4,
    review_text:
      'Really solid Southwestern food and a great vibe. The green chile chicken enchiladas were excellent. Knocked off one star only because parking on University Ave is always a headache at lunch. Staff was attentive and the portions are very generous.',
    review_time: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    draft_status: 'pending',
    draft_text:
      "Thank you, Emily! We're so glad the enchiladas hit the spot — that green chile sauce is made fresh every morning and it really shows. You're absolutely right about University Ave parking and we hear that a lot from our lunch crowd. There is a free lot one block east on 500 N that most regulars use — hope that helps next time! See you soon. — The Mesa Group Provo Team",
  },
  {
    id: 'r4',
    location_id: '1',
    location_name: 'Mesa Group — Downtown',
    reviewer_name: 'Mike D.',
    star_rating: 5,
    review_text:
      'Hands down the best breakfast burrito in Utah. I drive from Draper every Saturday morning just for this place. The staff knows my order by now and somehow it still tastes better every time. Never going anywhere else for breakfast.',
    review_time: new Date(Date.now() - 1000 * 60 * 60 * 32).toISOString(),
    draft_status: 'posted',
    draft_text:
      "Mike, driving from Draper every Saturday is the ultimate compliment and it honestly makes our whole team smile. We love having you as a regular and we will make sure it is always worth the drive. See you this Saturday! — The Mesa Group Downtown Team",
  },
  {
    id: 'r5',
    location_id: '3',
    location_name: 'Mesa Group — Sugarhouse',
    reviewer_name: 'Rachel P.',
    star_rating: 1,
    review_text:
      'Ordered takeout and got home to find my order was completely wrong. Called the restaurant three times and nobody picked up. This is the second time this has happened. Really disappointing because the food is great when they get it right.',
    review_time: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
    draft_status: 'pending',
    draft_text:
      "Rachel, we are so sorry — a wrong order is frustrating on its own, but not being able to reach us to fix it is completely unacceptable. We are looking into the phone issue at our Sugarhouse location immediately. Please email us at sugarhouse@mesagrouputah.com with your order details and we will make this right with a full refund and a meal on us. You deserve better than this and we appreciate you giving us the chance to fix it. — The Mesa Group Team",
  },
  {
    id: 'r6',
    location_id: '2',
    location_name: 'Mesa Group — Provo',
    reviewer_name: 'Tyler B.',
    star_rating: 5,
    review_text:
      'Brought my whole family here for my dad\'s birthday and it was perfect. The staff brought out chips and salsa while we waited and even remembered to wish my dad happy birthday without being prompted. Food was incredible. The green chile stew is a must-order.',
    review_time: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    draft_status: 'approved',
    draft_text:
      "Tyler, happy birthday to your dad from all of us at Mesa Group! Moments like this are exactly why we do what we do. Thank you for choosing us for such a special occasion — your family made our team's day. We hope to be part of many more celebrations. — The Mesa Group Provo Team",
  },
];

export const DEMO_ANALYTICS = {
  healthScore: 84,
  avgRating: 4.5,
  totalReviews: 149,
  totalResponded: 118,
  pendingResponses: 6,
  responseRate: 85,
  sentiment: {
    positive: 74,
    neutral: 16,
    negative: 10,
  },
  distribution: [
    { star: 5, count: 82, pct: 55 },
    { star: 4, count: 34, pct: 23 },
    { star: 3, count: 18, pct: 12 },
    { star: 2, count: 9,  pct: 6  },
    { star: 1, count: 6,  pct: 4  },
  ],
  trend: [
    { month: 'Oct', avg_rating: '4.0', review_count: 14 },
    { month: 'Nov', avg_rating: '4.1', review_count: 19 },
    { month: 'Dec', avg_rating: '4.2', review_count: 22 },
    { month: 'Jan', avg_rating: '4.3', review_count: 28 },
    { month: 'Feb', avg_rating: '4.4', review_count: 32 },
    { month: 'Mar', avg_rating: '4.5', review_count: 34 },
  ],
  recentReviews: [],
};

export const DEMO_BILLING = {
  plan: 'growth',
  locationCount: 3,
  maxLocations: 9,
  canAddLocation: true,
  pricePerLocation: { monthly: 19, yearly: 190 },
  monthlyTotal: 57,
};

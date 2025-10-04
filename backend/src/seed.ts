import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const germanCities = [
  { city: 'Berlin', state: 'Berlin', lat: 52.520008, lng: 13.404954 },
  { city: 'Munich', state: 'Bavaria', lat: 48.137154, lng: 11.576124 },
  { city: 'Hamburg', state: 'Hamburg', lat: 53.551086, lng: 9.993682 },
  { city: 'Cologne', state: 'North Rhine-Westphalia', lat: 50.937531, lng: 6.960279 },
  { city: 'Frankfurt', state: 'Hesse', lat: 50.110924, lng: 8.682127 },
  { city: 'Stuttgart', state: 'Baden-Württemberg', lat: 48.775846, lng: 9.182932 },
  { city: 'Düsseldorf', state: 'North Rhine-Westphalia', lat: 51.227741, lng: 6.773456 },
  { city: 'Leipzig', state: 'Saxony', lat: 51.339695, lng: 12.373075 },
  { city: 'Dresden', state: 'Saxony', lat: 51.050407, lng: 13.737262 },
  { city: 'Nuremberg', state: 'Bavaria', lat: 49.452103, lng: 11.076665 },
];

const eventTitles = [
  'Schoko-Pudding Sonntag',
  'Vanilla Dreams Meetup',
  'Caramel Connection',
  'Strawberry Pudding Party',
  'Chocolate Lovers Unite',
  'Vanilla Vibes',
  'Pudding Paradise',
  'Sweet Sunday Gathering',
  'Dessert Delight Meetup',
  'Pudding Power Hour',
];

const descriptions = [
  'Bring your favorite pudding and let\'s share stories!',
  'Let\'s meet and enjoy delicious pudding together!',
  'A gathering for pudding enthusiasts. All flavors welcome!',
  'Join us for an afternoon of pudding tasting and fun conversations.',
  'Let\'s celebrate the pudding culture together!',
];

async function main() {
  console.log('🌱 Seeding database...');

  // Create test users
  const users = [];
  for (let i = 1; i <= 5; i++) {
    const user = await prisma.user.create({
      data: {
        email: `user${i}@puddingmeetup.com`,
        passwordHash: await bcrypt.hash('password123', 10),
        name: `Test User ${i}`,
      },
    });
    users.push(user);
    console.log(`✅ Created user: ${user.name}`);
  }

  // Create test events
  const now = new Date();
  for (let i = 0; i < 10; i++) {
    const city = germanCities[i];
    const startTime = new Date(now.getTime() + (i + 1) * 24 * 60 * 60 * 1000 + Math.random() * 48 * 60 * 60 * 1000);
    const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000);

    const event = await prisma.event.create({
      data: {
        title: eventTitles[i],
        description: descriptions[i % descriptions.length],
        locationLat: city.lat,
        locationLng: city.lng,
        city: city.city,
        state: city.state,
        startTime,
        endTime,
        attendeeLimit: 10 + Math.floor(Math.random() * 20),
        organizerId: users[i % users.length].id,
      },
    });

    // Add some attendances
    const numAttendees = Math.floor(Math.random() * 5) + 2;
    for (let j = 0; j < numAttendees; j++) {
      const attendeeUser = users[(i + j + 1) % users.length];
      await prisma.attendance.create({
        data: {
          userId: attendeeUser.id,
          eventId: event.id,
          status: j < numAttendees - 1 ? 'APPROVED' : 'PENDING',
          puddingPhoto: '/uploads/placeholder-pudding.jpg',
          puddingName: ['Vanilla', 'Chocolate', 'Strawberry', 'Caramel', 'Banana'][j % 5] + ' Pudding',
          puddingDesc: 'Homemade with love!',
        },
      });
    }

    // Add some messages
    if (numAttendees > 1) {
      for (let k = 0; k < 3; k++) {
        const messageUser = users[(i + k) % users.length];
        await prisma.message.create({
          data: {
            userId: messageUser.id,
            eventId: event.id,
            content: [
              'Can\'t wait for this event!',
              'I\'m bringing my special pudding recipe!',
              'This is going to be amazing!',
              'Looking forward to meeting everyone!',
              'Does anyone have dietary restrictions?',
            ][k % 5],
          },
        });
      }
    }

    console.log(`✅ Created event: ${event.title} in ${event.city}`);
  }

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

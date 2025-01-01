import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

const data = JSON.parse(fs.readFileSync('./MOCK_DATA.json', 'utf-8'));

async function main() {
  for (const user of data) {
    await prisma.user.create({
      data: {
        userId: user.userId,
        email: user.email,
        name: user.name,
        dateJoined: new Date(user.dateJoined),
        totalSpend: user.totalSpend,
        lastLogin: user.lastLogin ? new Date(user.lastLogin) : null,
        creditCardType: user.creditCardType,
      },
    });
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());

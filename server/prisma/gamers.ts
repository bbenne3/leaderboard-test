import { PrismaClient } from '@prisma/client';

function createUser(rank: number, name: string, pic: string, score: number) {
  return {
    rank, name, pic, score
  };
}

const GAMER_TOTAL = 250;
const ranks = Array.from({ length: GAMER_TOTAL }).map((_, i) => i + 1);
function randomNumberInRank() {
  return Math.floor(1 + Math.random() * GAMER_TOTAL)
}

// apply some random sorting
// could track ones already swapped as to not multiple swap
for(let i = 0; i < ranks.length; i++) {
  const idx = randomNumberInRank() - 1;
  [ranks[i]] = [ranks[idx]];
}

// gen some static scores from high to low for idx based ranking match
const scores = Array.from({ length: GAMER_TOTAL }).map((_, i) => Math.ceil(50000000 / (i + 1)))

function* getGamer() {
  let i = 1;
  while(true) {
    const rank = ranks[i - 1];
    yield createUser(rank, `Gamer ${i++}`, `https://xsgames.co/randomusers/avatar.php?g=pixel`, scores[rank - 1]);
  }
}


async function seeds() {
  const prisma = new PrismaClient();
  await prisma.gamer.deleteMany();

  const nextGamer = getGamer();
  for (let i = 0; i<GAMER_TOTAL; i++) {
    const gamer = nextGamer.next().value;
    if (gamer) {
      console.log('generating gamer', gamer);
      await prisma.gamer.create({
        data: gamer
      });
    }
  }

  const ct = await prisma.gamer.count();
  console.log('ct', ct);
  prisma.$disconnect();
}

seeds();
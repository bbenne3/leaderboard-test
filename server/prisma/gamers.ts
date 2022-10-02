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
  [ranks[i], ranks[idx]] = [ranks[idx], ranks[i]];
}

// gen some static scores from high to low for idx based ranking match
const scores = Array.from({ length: GAMER_TOTAL }).map((_, i) => Math.ceil(50000000 / (i + 1)))

async function* getGamer() {
  let i = 1;
  while(true) {
    const rank = ranks[i - 1];
    const imageId = rank % 50; // there are only 50 images available?? works for now
    yield createUser(rank, `Gamer ${i++}`, `https://xsgames.co/randomusers/assets/avatars/pixel/${imageId}.jpg`, scores[rank - 1]);
  }
}


async function seeds() {
  const dbClient = (await import("../src/dbclient")).default;
  await dbClient.gamer.deleteMany();

  const nextGamer = getGamer();
  for (let i = 0; i<GAMER_TOTAL; i++) {
    const gamer = (await nextGamer.next()).value;
    if (gamer) {
      console.log('generating gamer', gamer);
      await dbClient.gamer.create({
        data: gamer
      });
    }
  }

  const ct = await dbClient.gamer.count();
  console.log('ct', ct);

  dbClient.$disconnect();
}

seeds();
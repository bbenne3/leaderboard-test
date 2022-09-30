import { Prisma } from '@prisma/client';
import express, { NextFunction } from 'express';
import dbClient from '../dbclient';

const router = express.Router();

const PAGE_SIZE = 20;

function validatePage(next: NextFunction, total: number, p: number) {
   if (p > total || p < 0) next(new Error('Page does not exist'));
}

router.get('/', async (req, res, next) => {
  const {view = 'hundred', event_name, sortOrder = '1', page = '1'} = req.query;
  const params = {
    where: event_name ? {name: {contains: event_name as string}} : undefined,
    orderBy: {
      rank: sortOrder === '-1' ? 'desc' : 'asc'
    }
  } as Prisma.GamerFindManyArgs;
  const total = view === 'hundred' ? 100 : await dbClient.gamer.count({
    where: params.where
  });
  const pages = Math.ceil(total / PAGE_SIZE);
  const p = parseInt(page as string || '1');

  validatePage(next, pages, p);
  const offset = (p * PAGE_SIZE - PAGE_SIZE);

  const gamers = await dbClient.gamer.findMany({
    // limit to PAGE_SIZE records at a time
    // will better simulate pagination for the top 100
    take: PAGE_SIZE,
    skip: offset,
    where: params.where,
    orderBy: {
      rank: sortOrder === '-1' ? 'desc' : 'asc'
    }
  });

  res.json({
    nextPage: p + 1 <= pages ? p + 1 : -1,
    sort: 1,
    entries: gamers
  });
});

export default router;

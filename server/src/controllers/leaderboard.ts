import { Prisma } from '@prisma/client';
import { json } from 'body-parser';
import express, { NextFunction } from 'express';
import dbClient from '../dbclient';

const router = express.Router();

const PAGE_SIZE = 20;

function validatePage(next: NextFunction, total: number, p: number) {
  if (p > total || p < 0) next(new Error('Page does not exist'));
}

function validateView(next: NextFunction, view: string = '') {
  if (view && !['hundred', 'global'].includes(view)) next(new Error('Invalid view selected'));
}

function validateSortOrder(next: NextFunction, sortOrder) {
  if (sortOrder && !['-1', '1'].includes(sortOrder)) next(new Error('Invalid sort selected'));
}

router.get('/', async (req, res, next) => {
  const {view = 'hundred', event_name, sortOrder = '1', page = '1'} = req.query;
  validateView(next, view as string);
  validateSortOrder(next, sortOrder);

  let where: Prisma.GamerWhereInput;
  if (view === 'hundred') {
    where = {
      ...where,
      rank: {
        lte: 100,
      }
    }
  }

  if (event_name) {
    where = {
      ...where,
      name: {contains: event_name as string}
    };
  }

  const params = {
    where,
    orderBy: {
      rank: sortOrder === '-1' ? 'desc' : 'asc'
    }
  } as Prisma.GamerFindManyArgs;

  const subcount = await dbClient.gamer.count({
    where: params.where
  })

  // take min total
  const total = view === 'hundred' ? Math.min(subcount, 100) : subcount
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

  /** simulate network lag or longer running query for UI loading state */
  if (page === '2') {
    setTimeout(() => {
      res.json({
        nextPage: p + 1 <= pages ? p + 1 : -1,
        sort: 1,
        entries: gamers
      });
    }, 4000);
  } else {
    res.json({
      nextPage: p + 1 <= pages ? p + 1 : -1,
      sort: 1,
      entries: gamers
    });
  }
});

export default router;

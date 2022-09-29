import express from 'express';

const router = express.Router();

/**
 {
    id: '1',
    name: 'Leader 1',
    score: 50000,
    pic: '',
    rank: 1
  }
*/
router.get('/', (req, res) => {
  const {view, eventName} = req.query;

  console.log('view', view, 'eventName', eventName);

  res.json({
    nextPage: -1,
    sort: 1,
    entries: []
  });
});

export default router;

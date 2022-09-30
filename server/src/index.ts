import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import leaderboard from './controllers/leaderboard';

const app = express();
const port = 3003;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use('/api/v1/leaderboard', leaderboard);

app.use((err, _, res, next) => {
  res.status(500).json({err_msg: err.message});
})
app.all('*', (req, res) => {
  res.status(404).send();
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

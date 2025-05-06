import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import {
  Checkbox,
  FormGroup,
  FormControlLabel,
  Paper,
  Typography,
} from '@mui/material';
import { getAllGames } from '../../service/game.service';
import { Game } from '../../model/Game';
import getUserSubject, { getAllUsers } from '../../service/user.Service';

interface DataPoint2 {
  date: string;
  [key: string]: any;
}

type SeriesKey = string;

const MultiLineToggleChart: React.FC = () => {
  const [chartData, setChartData] = useState<DataPoint2[]>([]);
  const [visibleSeries, setVisibleSeries] = useState<Record<SeriesKey, boolean>>({});
  const [seriesConfig, setSeriesConfig] = useState<Record<SeriesKey, { label: string; color: string }>>({});

  useEffect(() => {
    getUserSubject().subscribe((user) => {
      if (!user) return;

      getAllGames().then((games: Game[]) => {
        const data = games.map((game) => new Date(game.date).toLocaleDateString());
        const uniqueDates = [...new Set(data)];

        getAllUsers().then((users) => {
          let chartData: DataPoint2[] = [];

          let dynamicData: DataPoint2 = { date: "06/05/2024" };
          for (const user of users) {
            dynamicData[user.username] = 100;
          }
          chartData.push(dynamicData);

          for (const date of uniqueDates) {
            const dateGames = games.filter(
              (g) => new Date(g.date).toLocaleDateString() === date
            );
            const datePlayers = dateGames
              .map((game) =>
                game.playerScores.map((ps) => ({
                  player: ps.player,
                  date: game.date,
                  endElo: ps.endElo,
                }))
              )
              .flat(1);

            let dateData: DataPoint2 = { date };
            for (const user of users) {
              if (datePlayers.map((e) => e.player.username).includes(user.username)) {
                games.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                const lastDateGame = datePlayers
                  .filter((e) => e.player.username === user.username)
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
                dateData[user.username] = lastDateGame.endElo;
              } else {
                const lastDataPoint = chartData[chartData.length - 1];
                const lastElo = lastDataPoint[user.username];
                dateData[user.username] = lastElo;
              }
            }
            chartData.push(dateData);
          }

          setChartData(chartData);

          // ⚠️ Build series config and toggle states based on first valid chart row
          if (chartData.length > 0) {
            const first = chartData[0];
            const seriesKeys = Object.keys(first).filter((k) => k !== 'date');

            const colorPalette = ['#8884d8', '#82ca9d', '#ff7300', '#ffc658', '#00c49f', '#d0ed57', '#a28dd0'];
            const config: Record<SeriesKey, { label: string; color: string }> = {};
            const visibility: Record<SeriesKey, boolean> = {};

            seriesKeys.forEach((key, idx) => {
              config[key] = { label: key, color: colorPalette[idx % colorPalette.length] };
              visibility[key] = true;
            });

            setSeriesConfig(config);
            setVisibleSeries(visibility);
          }
        });
      });
    });
  }, []);

  const handleToggle = (key: SeriesKey) => {
    setVisibleSeries((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Paper sx={{ padding: 3 }} elevation={0}>

      <FormGroup row>
        {Object.keys(seriesConfig).map((key) => (
          <FormControlLabel
            key={key}
            control={
              <Checkbox
                size='small'
                checked={visibleSeries[key]}
                onChange={() => handleToggle(key)}
              />
            }
            label={seriesConfig[key].label}
            sx={{ '.MuiFormControlLabel-label': { fontSize: '0.8rem' } }}
          />
        ))}
      </FormGroup>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {Object.keys(seriesConfig).map((key) =>
            visibleSeries[key] ? (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={seriesConfig[key].color}
                strokeWidth={2}
              />
            ) : null
          )}
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default MultiLineToggleChart;

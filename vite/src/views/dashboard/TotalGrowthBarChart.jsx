import PropTypes from 'prop-types';
import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// third-party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

// project imports
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// chart data
import chartData from './chart-data/total-growth-bar-chart';

const status = [
  {
    value: 'today',
    label: 'Today'
  },
  {
    value: 'month',
    label: 'This Month'
  },
  {
    value: 'year',
    label: 'This Year'
  }
];

// ==============================|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||============================== //

const TotalGrowthBarChart = ({ isLoading }) => {
  const [value, setValue] = React.useState('today');
  const theme = useTheme();

  const { primary } = theme.palette.text;
  const divider = theme.palette.divider;
  const grey500 = theme.palette.grey[500];

  const primary200 = theme.palette.primary[200];
  const primaryDark = theme.palette.primary.dark;
  const secondaryMain = theme.palette.secondary.main;
  const secondaryLight = theme.palette.secondary.light;



  const [data, setData] = useState(null);
  const [investmentData, setInvestmentData] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // Default static value
  const [lossData, setLossData] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // Default static value
  const [profitData, setProfitData] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // Default static value
  const [maintenanceData, setMaintenanceData] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // Default static value
  // Fetching dynamic data from API
  useEffect(() => {
    axios
      .get('http://localhost:8080/data/totalgrothbar')
      .then((response) => {
        setData(response.data);

        // Set dynamic data if available from the response
        if (response.data?.totalGrowthBar)  {
          setInvestmentData(response.data.totalGrowthBar.Investment || investmentData);
          setLossData(response.data.totalGrowthBar.Loss || lossData);
          setProfitData(response.data.totalGrowthBar.profit || profitData);
          setMaintenanceData(response.data.totalGrowthBar.maintenance || maintenanceData);
        }
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        // Fallback to static values in case of error
        setData({
          TotalGrowthBarChartCard: {
            'Total Growth': 0
          },
          totalGrowthBar: {
            Investment: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            Loss: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            profit: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            maintenance: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          }
        });
      });
  }, []);

  const dynamicChartData = {
    ...chartData,
    series: [
      {
        name: 'Investment',
        data: investmentData
      },
      {
        name: 'Loss',
        data: lossData
      },
      {
        name: 'Profit',
        data: profitData
      },
      {
        name: 'Maintenance',
        data: maintenanceData
      }
    ],
    
  };


  React.useEffect(() => {
    const newChartData = {
      ...chartData.options,
      colors: [primary200, primaryDark, secondaryMain, secondaryLight],
      xaxis: {
        labels: {
          style: {
            colors: [primary, primary, primary, primary, primary, primary, primary, primary, primary, primary, primary, primary]
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: [primary]
          }
        }
      },
      grid: { borderColor: divider },
      tooltip: { theme: 'light' },
      legend: { labels: { colors: grey500 } }
    };

    
    if (data && !isLoading) {
      ApexCharts.exec(`bar-chart`, 'updateOptions', newChartData);
    }
  }, [primary200, primaryDark, secondaryMain, secondaryLight, primary, divider, isLoading, grey500]);



  return (
    <>
      {isLoading || !data ? (
        <SkeletonTotalGrowthBarChart />
      ) : (
        <MainCard>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                  <Grid container direction="column" spacing={1}>
                    <Grid item>
                      <Typography variant="subtitle2">Total Growth</Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h3">${data && data.TotalGrowthBarChart ? data.TotalGrowthBarChart['Total Growth'] : 0}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <TextField id="standard-select-currency" select value={value} onChange={(e) => setValue(e.target.value)}>
                    {status.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                '& .apexcharts-menu.apexcharts-menu-open': {
                  bgcolor: 'background.paper'
                }
              }}
            >
              <Chart {...dynamicChartData} />
            </Grid>
          </Grid>
        </MainCard>
      )}
    </>
  );
};

TotalGrowthBarChart.propTypes = {
  isLoading: PropTypes.bool
};

export default TotalGrowthBarChart;

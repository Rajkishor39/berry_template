import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

// material-ui
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// third-party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

// project imports
import chartData from './chart-data/bajaj-area-chart';


// ===========================|| DASHBOARD DEFAULT - BAJAJ AREA CHART CARD ||=========================== //

const BajajAreaChartCard = () => {
  const theme = useTheme();
  const orangeDark = theme.palette.secondary[800];

  const customization = useSelector((state) => state.customization);
  const { navType } = customization;

  const [data, setData] = useState(null);
  const [chartDataDynamic, setChartDataDynamic] = useState([0, 15, 10, 50, 30, 40, 25]);
  

  useEffect(() => {
    axios
      .get('http://localhost:8080/data/bajajcard') 
      .then((response) => {
        setData(response.data);
        if (response.data.chartData && response.data.chartData.bajajAreaChart) {
          setChartDataDynamic(response.data.chartData.bajajAreaChart); 
        }
      
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setData({
          BajajAreaChartCard: {
            'Bajaj Finery': 0,
            Profit: 0
          },
          chartData: {
            bajajAreaChart: [0, 15, 10, 50, 30, 40, 25]  
          }
        });
        setChartDataDynamic([0, 15, 10, 50, 30, 40, 25]);
      });
  }, []); 

  React.useEffect(() => {
    const newSupportChart = {
      ...chartData.options,
      colors: [orangeDark],
      tooltip: { theme: 'light' }
    };
    ApexCharts.exec(`support-chart`, 'updateOptions', newSupportChart);
  }, [navType, orangeDark]);

  const dynamicChartData = {
    ...chartData, 
    series: [
      {
        data: chartDataDynamic, 
      }
    ]
  };
  
  return (
    <Card sx={{ bgcolor: 'secondary.light' }}>
      <Grid container sx={{ p: 2, pb: 0, color: '#fff' }}>
        <Grid item xs={12}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="subtitle1" sx={{ color: 'secondary.dark' }}>
                Bajaj Finery
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h4" sx={{ color: 'grey.800' }}>
                ${data ? data.BajajAreaChartCard['Bajaj Finery'] : 0}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle2" sx={{ color: 'grey.800' }}>
          {data ? data.BajajAreaChartCard.Profit : 0 }% Profit
          </Typography>
        </Grid>
      </Grid>
      <Chart {... dynamicChartData}/>
    </Card>
  );
};

export default BajajAreaChartCard;
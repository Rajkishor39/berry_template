import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// third-party
import Chart from 'react-apexcharts';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonTotalOrderCard from 'ui-component/cards/Skeleton/EarningCard';

import ChartDataMonth from './chart-data/total-order-month-line-chart';
import ChartDataYear from './chart-data/total-order-year-line-chart';

// assets
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import axios from 'axios';

// ==============================|| DASHBOARD - TOTAL ORDER LINE CHART CARD ||============================== //

const TotalOrderLineChartCard = ({ isLoading }) => {
  const theme = useTheme();

  const [timeValue, setTimeValue] = React.useState(false);
  const handleChangeTime = (event, newValue) => {
    setTimeValue(newValue);
  };

  const [data, setData] = useState(null);
  const [chartDataDynamicMonthly, setChartDataDynamicMonthly] = useState([0, 15, 10, 50, 30, 40, 25]);
  const [chartDataDynamicYearly, setChartDataDynamicYearly] = useState([0, 15, 10, 50, 30, 40, 25]);

  // Static fallback data
  const staticMonthlyData = [0, 15, 10, 50, 30, 40, 25];
  const staticYearlyData = [0, 15, 10, 50, 30, 40, 25];

  useEffect(() => {
    axios
      .get('http://localhost:8080/data/totalorderline')
      .then((response) => {
        // If response contains valid data, update the state
        setData(response.data);

        // If monthly data exists, set it. Else, use static data
        if (response.data?.totalOrderMonthly?.data) {
          setChartDataDynamicMonthly(response.data.totalOrderMonthly.data);
        } else {
          setChartDataDynamicMonthly(staticMonthlyData); // Static fallback data
        }

        // If yearly data exists, set it. Else, use static data
        if (response.data?.totalOrderYearly?.data) {
          setChartDataDynamicYearly(response.data.totalOrderYearly.data);
        } else {
          setChartDataDynamicYearly(staticYearlyData); // Static fallback data
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);

        // In case of error or no response, set static data
        setData({
          TotalOrderLineChartCard: {
            month: 0,
            year: 0,
          },
          totalOrderMonthly: { data: staticMonthlyData },
          totalOrderYearly: { data: staticYearlyData },
        });
        setChartDataDynamicMonthly(staticMonthlyData);
        setChartDataDynamicYearly(staticYearlyData);
      });
  }, []);  // Empty dependency array to only run on component mount

  const monthlydata = {
    ...ChartDataMonth,
    series: [
      {
        data: chartDataDynamicMonthly,  // Use separate monthly state
      },
    ],
  };

  const yearlydata = {
    ...ChartDataYear,
    series: [
      {
        data: chartDataDynamicYearly,  // Use separate yearly state
      },
    ],
  };


  const totalOrderDataMonth = data?.TotalOrderLineChartCard?.month ?? 0;
  const totalOrderDataYear = data?.TotalOrderLineChartCard?.year ?? 0;


  return (
    <>
      {isLoading ? (
        <SkeletonTotalOrderCard />
      ) : (
        <MainCard
          border={false}
          content={false}
          sx={{
            bgcolor: 'primary.dark',
            color: '#fff',
            overflow: 'hidden',
            position: 'relative',
            '&>div': {
              position: 'relative',
              zIndex: 5
            },
            '&:after': {
              content: '""',
              position: 'absolute',
              width: 210,
              height: 210,
              background: theme.palette.primary[800],
              borderRadius: '50%',
              top: { xs: -105, sm: -85 },
              right: { xs: -140, sm: -95 }
            },
            '&:before': {
              content: '""',
              position: 'absolute',
              width: 210,
              height: 210,
              background: theme.palette.primary[800],
              borderRadius: '50%',
              top: { xs: -155, sm: -125 },
              right: { xs: -70, sm: -15 },
              opacity: 0.5
            }
          }}
        >
          <Box sx={{ p: 2.25 }}>
            <Grid container direction="column">
              <Grid item>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Avatar
                      variant="rounded"
                      sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.largeAvatar,
                        bgcolor: 'primary.800',
                        color: '#fff',
                        mt: 1
                      }}
                    >
                      <LocalMallOutlinedIcon fontSize="inherit" />
                    </Avatar>
                  </Grid>
                  <Grid item>
                    <Button
                      disableElevation
                      variant={timeValue ? 'contained' : 'text'}
                      size="small"
                      sx={{ color: 'inherit' }}
                      onClick={(e) => handleChangeTime(e, true)}
                    >
                      Month
                    </Button>
                    <Button
                      disableElevation
                      variant={!timeValue ? 'contained' : 'text'}
                      size="small"
                      sx={{ color: 'inherit' }}
                      onClick={(e) => handleChangeTime(e, false)}
                    >
                      Year
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sx={{ mb: 0.75 }}>
                <Grid container alignItems="center">
                  <Grid item xs={6}>
                    <Grid container alignItems="center">
                      <Grid item>
                        {timeValue ? (
                          <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>${data ? data.TotalOrderLineChartCard['month'] : 0}</Typography>
                        ) : (
                          <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>${data ? data.TotalOrderLineChartCard['year'] : 0 }</Typography>
                        )}
                      </Grid>
                      <Grid item>
                        <Avatar
                          sx={{
                            ...theme.typography.smallAvatar,
                            cursor: 'pointer',
                            bgcolor: 'primary.200',
                            color: 'primary.dark'
                          }}
                        >
                          <ArrowDownwardIcon fontSize="inherit" sx={{ transform: 'rotate3d(1, 1, 1, 45deg)' }} />
                        </Avatar>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography
                          sx={{
                            fontSize: '1rem',
                            fontWeight: 500,
                            color: 'primary.200'
                          }}
                        >
                          Total Order
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={6}>
                    {timeValue ? <Chart {...monthlydata} /> : <Chart {...yearlydata} />}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </MainCard>
      )}
    </>
  );
};

TotalOrderLineChartCard.propTypes = {
  isLoading: PropTypes.bool
};

export default TotalOrderLineChartCard;

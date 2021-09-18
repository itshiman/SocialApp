import { Grid, makeStyles } from '@material-ui/core';
import React from 'react';
import Navbar from '../components/Navbar';
import Leftbar from '../components/sidebar/Leftbar';
import Feed from '../components/Feed';
import Rightbar from '../components/sidebar/Rightbar';
import Add from '../components/Add';
const useStyles = makeStyles((theme) => ({
  gridItemLeft: {
    backgroundColor: theme.palette.primary.main,
    [theme.breakpoints.up('sm')]: {
      backgroundColor: 'white',
    },
  },
}));

export default function Home() {
  const classes = useStyles();
  return (
    <div>
      <Navbar />
      <Grid container spacing={2}>
        <Grid item sm={2} xs={2} className={classes.gridItemLeft}>
          <Leftbar />
        </Grid>
        <Grid item sm={7} xs={10}>
          <Feed />
        </Grid>
        <Grid item sm={3} className={classes.gridItemRight}>
          <Rightbar />
        </Grid>
      </Grid>
      <Add />
    </div>
  );
}

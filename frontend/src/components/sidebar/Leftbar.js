import { Container, Typography } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { Link } from 'react-router-dom';
import { serverUrl } from '../../config';

const useStyles = makeStyles((theme) => ({
  container: {
    height: '100vh',
    color: 'white',
    position: 'sticky',
    top: 0,
    paddingTop: theme.spacing(10),
    [theme.breakpoints.up('sm')]: {
      backgroundColor: 'white',
      color: '#555',
      borderRight: '3px solid #ece7e7',
    },
  },
  item: {
    display: 'flex',
    color: 'grey',
    alignItems: 'center',
    marginBottom: theme.spacing(4),
    [theme.breakpoints.up('sm')]: {
      marginBottom: theme.spacing(3),
      cursor: 'pointer',
    },
  },
  icon: {
    height: '30px',
    width: '30px',
    marginRight: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
      fontSize: '18px',
    },
  },
  text: {
    fontWeight: 500,
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
}));

const Leftbar = () => {
  const classes = useStyles();

  return (
    <Container className={classes.container} border>
      <Link to='/' style={{ textDecoration: 'none' }}>
        <div className={classes.item}>
          <img
            src={`${serverUrl}/images/icons8-home-48.png`}
            className={classes.icon}
          />
          <Typography className={classes.text}>Home</Typography>
        </div>
      </Link>
      <Link to='/category/Web Development' style={{ textDecoration: 'none' }}>
        <div className={classes.item}>
          <img
            src={`${serverUrl}/images/icons8-web-development-48.png`}
            className={classes.icon}
          />
          <Typography className={classes.text}>Web Development</Typography>
        </div>
      </Link>
      <Link
        to='/category/Android Development'
        style={{ textDecoration: 'none' }}>
        <div className={classes.item}>
          <img
            src={`${serverUrl}/images/icons8-android-os-48.png`}
            className={classes.icon}
          />
          <Typography className={classes.text}>Android Dev</Typography>
        </div>
      </Link>
      <Link to='/category/Data Structures' style={{ textDecoration: 'none' }}>
        <div className={classes.item}>
          <img
            src={`${serverUrl}/images/icons8-java-48.png`}
            className={classes.icon}
          />
          <Typography className={classes.text}>Data Structures</Typography>
        </div>
      </Link>
      <Link to='/category/Machine Learning' style={{ textDecoration: 'none' }}>
        <div className={classes.item}>
          <img
            src={`${serverUrl}/images/ml.png.png`}
            className={classes.icon}
          />
          <Typography className={classes.text}>Machine Learning</Typography>
        </div>
      </Link>
      <Link to='/category/Block Chain' style={{ textDecoration: 'none' }}>
        <div className={classes.item}>
          <img src={`${serverUrl}/images/block.png`} className={classes.icon} />
          <Typography className={classes.text}>Block Chain</Typography>
        </div>
      </Link>
    </Container>
  );
};

export default Leftbar;

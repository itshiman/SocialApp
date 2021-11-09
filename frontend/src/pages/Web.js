import './web.css';
import Topbar from '../components/Navbar';
import Sidebar from '../components/sidebar/Leftbar';
import Feed from '../components/Feed';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router';
import { AuthContext } from '../context/AuthContext';
import { Box, Grid, makeStyles } from '@material-ui/core';

import WebRightBar from '../components/WebRightbar';
import Leftbar from '../components/sidebar/Leftbar';
import CategoryFeed from '../components/CategoryFeed';

const useStyles = makeStyles((theme) => ({
  gridItemLeft: {
    backgroundColor: theme.palette.primary.main,
    [theme.breakpoints.up('sm')]: {
      backgroundColor: 'white',
    },
  },
  descriptionBox: {
    position: 'relatie',
    marginLeft: 'auto',
    margingRight: '0',
  },
  nestGridItem: {
    marginTop: '100px',
  },
  imageList: {
    width: 350,
    height: 450,
  },
}));

export default function Web() {
  const classes = useStyles();
  const [user, setUser] = useState({});
  const username = useParams().username;
  const [friends, setFriends] = useState([]);
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get('/users?username=' + username, {
        headers: {
          Authorization: 'bearer ' + currentUser.token,
        },
      });
      setUser(res.data);
    };
    fetchUser();
  }, [username, currentUser.token]);

  console.log(user, currentUser);
  return (
    <div>
      <Topbar />
      <Grid container>
        <Grid item sm={2} xs={2} className={classes.gridItemLeft}>
          <Leftbar />
        </Grid>
        <Grid item sm={10} xs={10} className={classes.gridItemLeft}>
          <Grid container>
            <Grid item sm={12}>
              <div className='profile'>
                <div className='profileRight'>
                  <div className='profileRightTop'>
                    <div className='profileCover'>
                      <img
                        className='profileCoverImgWeb'
                        src='https://www.reachfirst.com/wp-content/uploads/2018/08/Web-Development.jpg'
                        alt=''
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>
          <Grid
            container
            className={classes.nestGrid}
            style={{ marginTop: '80px' }}>
            <Grid item sm={4} className={classes.gridItemRight}></Grid>
            <Grid item sm={4} className={classes.gridItemRight}>
              <Box className={classes.descriptionBox} mt={5}>
                <div className='profileInfo'>
                  <h4 className='profileInfoName'>{username}</h4>

                  <span className='profileInfoDesc'>
                    <h3>Welcome to Web Home Page</h3>
                  </span>
                </div>
              </Box>
            </Grid>
            <Grid item sm={4} className={classes.gridItemRight}>
              <WebRightBar user={user} />
            </Grid>
          </Grid>
          <Grid item>
            <CategoryFeed category={username} currentUser={currentUser} />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

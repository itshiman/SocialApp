import './profile.css';
import Topbar from '../components/Navbar';
import Sidebar from '../components/sidebar/Leftbar';
import Feed from '../components/Feed';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router';
import { AuthContext } from '../context/AuthContext';
import { Box, Grid, makeStyles, Paper } from '@material-ui/core';
import FriendList from '../components/FriendList';
import ProfileRightBar from '../components/ProfileRightBar';

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
    margingTop: '150px',
  },
  imageList: {
    width: 350,
    height: 450,
  },
}));

export default function Profile() {
  const classes = useStyles();
  const [user, setUser] = useState({});
  const [currentUser1, setCurrentUser1] = useState({});
  const username = useParams().username;

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
    const fetchCurrentUser = async () => {
      const res = await axios.get('/users?username=' + currentUser.username, {
        headers: {
          Authorization: 'bearer ' + currentUser.token,
        },
      });
      setCurrentUser1(res.data);
    };
    fetchUser();
    fetchCurrentUser();
  }, [username, currentUser.token]);

  return (
    <div>
      <Topbar />
      <Grid container>
        <Grid item sm={2} xs={2} className={classes.gridItemLeft}>
          <Sidebar />
        </Grid>
        <Grid item sm={10} xs={10} className={classes.gridItemLeft}>
          <Box>
            <div className='profile'>
              <div className='profileRight'>
                <div className='profileRightTop'>
                  <div className='profileCover'>
                    <img
                      className='profileCoverImg'
                      src='https://picsum.photos/5000/5000'
                      alt=''
                    />
                    <img
                      className='profileUserImg'
                      src={user.profilePicture}
                      alt=''
                    />
                  </div>
                </div>
              </div>
            </div>
          </Box>
          <Grid container className={classes.nestGrid}>
            <Grid item sm={4} className={classes.gridItemRight}>
              <FriendList user={user} />
            </Grid>
            <Grid item sm={4} className={classes.gridItemRight}>
              <Box className={classes.descriptionBox} mt={15}>
                <div className='profileInfo'>
                  <h4 className='profileInfoName'>{username}</h4>
                  <Paper elevation={2}>
                    <span className='profileInfoDesc'>
                      Non nisi et non officia do officia pariatur commodo aliqua
                      reprehenderit cillum. Enim pariatur aliqua aliquip sint
                      officia deserunt non proident ipsum cupidatat sint enim
                      elit culpa. Ut consequat amet velit proident id excepteur
                      consequat voluptate veniam adipisicing sit veniam ex
                      mollit. Esse veniam ea excepteur sint sit irure dolor
                      nulla commodo aliquip sint do sint.
                    </span>
                  </Paper>
                </div>
              </Box>
            </Grid>
            <Grid item sm={4} className={classes.gridItemRight}>
              <ProfileRightBar user={user} currentUser={currentUser} />
            </Grid>
          </Grid>
          <Grid item>
            <Feed username={username} />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

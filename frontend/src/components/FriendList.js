import {
  Box,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Info } from '@material-ui/icons';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  imageList: {
    width: 350,
    height: 450,
  },
}));

function FriendList({ user }) {
  const classes = useStyles();
  const [friends, setFriends] = useState([]);
  console.log(friends);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const friendList = await axios.get('/users/friends/' + user._id);
        setFriends(friendList.data);
      } catch (err) {
        console.log(err);
      }
    };
    getFriends();
  }, [user]);

  return (
    <Box className={classes.descriptionBox} mt={15}>
      <Typography gutterBottom variant='h4' component='h2'>
        Friends
      </Typography>
      <ImageList rowHeight={180} cols={2} className={classes.imageList}>
        {friends.map((friend) => {
          return (
            <Link to={'/Profile/' + friend.username}>
              <ImageListItem>
                <img src={friend.profilePicture} alt={friend.username} />
                <ImageListItemBar
                  title={friend.username}
                  actionIcon={
                    <IconButton
                      aria-label={`info about Something`}
                      className={classes.icon}>
                      <Info />
                    </IconButton>
                  }
                />
              </ImageListItem>
            </Link>
          );
        })}
      </ImageList>
    </Box>
  );
}

export default FriendList;

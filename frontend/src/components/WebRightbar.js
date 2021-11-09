import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Typography,
} from '@material-ui/core';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

function WebRightBar({ user }) {
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [followed, setFollowed] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFollowed(currentUser.categories.includes(user.username));
    }
  }, [currentUser, user]);

  const body = {};

  const handleClick = async () => {
    try {
      await axios.put(`/users/category/${user.username}/unfollow`, body, {
        headers: {
          Authorization: 'bearer ' + currentUser.token,
        },
      });
      dispatch({ type: 'UNFOLLOW', payload: user._id });

      setFollowed(!followed);
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickFollow = async () => {
    try {
      console.log(followed);
      await axios.put(`/users/category/${user.username}/follow`, body, {
        headers: {
          Authorization: 'bearer ' + currentUser.token,
        },
      });
      dispatch({ type: 'FOLLOW', payload: user._id });

      setFollowed(!followed);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box mt={10}>
      <Card>
        <CardActionArea>
          <CardContent></CardContent>
        </CardActionArea>
        {currentUser._id === user._id ? (
          <></>
        ) : (
          <CardActions>
            {followed ? (
              <Button size='small' color='primary' onClick={handleClick}>
                UnFollow
              </Button>
            ) : (
              <Button size='small' color='primary' onClick={handleClickFollow}>
                Follow
              </Button>
            )}
          </CardActions>
        )}
      </Card>
    </Box>
  );
}

export default WebRightBar;

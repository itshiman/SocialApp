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

function WebRightBar({ user, currentUser }) {
  const { dispatch } = useContext(AuthContext);
  const [followed, setFollowed] = useState(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('user', JSON.stringify(currentUser));
      setFollowed(currentUser.categories.includes(user.username));
    }
  }, [currentUser, user]);

  const body = {};

  const handleClick = async () => {
    try {
      await axios.put(
        `https://afternoon-woodland-88900.herokuapp.com/users/category/${user.username}/unfollow`,
        body,
        {
          headers: {
            Authorization: 'bearer ' + currentUser.token,
          },
        }
      );
      dispatch({ type: 'CATUNFOLLOW', payload: user.username });

      setFollowed(!followed);
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickFollow = async () => {
    try {
      console.log(followed);
      await axios.put(
        `https://afternoon-woodland-88900.herokuapp.com/users/category/${user.username}/follow`,
        body,
        {
          headers: {
            Authorization: 'bearer ' + currentUser.token,
          },
        }
      );
      dispatch({ type: 'CATFOLLOW', payload: user.username });

      setFollowed(!followed);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box mt={5}>
      <Card>
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

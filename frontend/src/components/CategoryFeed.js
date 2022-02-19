import { makeStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';

import React, { useContext, useEffect, useState } from 'react';
import Post from './Post';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(10),
  },
}));

const CategoryFeed = ({ category }) => {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await axios.get(
        'https://afternoon-woodland-88900.herokuapp.com/posts/category/' +
          category
      );
      setPosts(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    };
    fetchPosts();
  }, [category, user._id]);

  const classes = useStyles();
  return (
    <div>
      <Container className={classes.container} style={{ paddingTop: '50px' }}>
        {posts.map((p, index) => {
          return <Post post={p} key={p._id} index={index} />;
        })}
      </Container>
    </div>
  );
};

export default CategoryFeed;

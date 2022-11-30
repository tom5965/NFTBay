import * as React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import cx from 'clsx';
import NoSsr from '@material-ui/core/NoSsr';
import GoogleFontLoader from 'react-google-font-loader';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import { Column, Row, Item } from '@mui-treasury/components/flex';
import { useDynamicAvatarStyles } from '@mui-treasury/styles/avatar/dynamic';

const usePersonStyles = makeStyles(() => ({
  text: {
    fontFamily: 'Barlow, san-serif',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  name: {
    fontWeight: 600,
    fontSize: '1rem',
    color: '#122740',
  },
  caption: {
    fontSize: '0.875rem',
    color: '#758392',
    marginTop: -4,
  },
  btn: {
    borderRadius: 20,
    padding: '0.125rem 0.75rem',
    borderColor: '#becddc',
    fontSize: '0.75rem',
  },
}));

const PersonItem = ({ name, bid, img }) => {
  const avatarStyles = useDynamicAvatarStyles({ size: 56 });
  const styles = usePersonStyles();

  return (
    <Row gap={2} p={2.5}>
      <Item>
        <Avatar classes={avatarStyles} src={img} />
      </Item>
      <Row wrap grow gap={0.5} minWidth={0}>
        <Item grow minWidth={0}>
          <div className={cx(styles.name, styles.text)}>{name}</div>
          <div className={cx(styles.caption, styles.text)}>
            {bid} ETH
          </div>
        </Item>
        <Item position={'middle'}>
          <Button className={styles.btn} variant={'outlined'}>
            DETAIL
          </Button>
          <Divider variant={'middle'} className={styles.divider} />
        </Item>
        
      </Row>
    </Row>
    
  );
};

const useStyles = makeStyles(() => ({
  card: {
    width: '100%',
    borderRadius: 16,
    boxShadow: '0 8px 16px 0 #BDC9D7',
    overflow: 'hidden',
  },
  header: {
    fontFamily: 'Barlow, san-serif',
    backgroundColor: '#fff',
  },
  headline: {
    color: '#122740',
    fontSize: '1.25rem',
    fontWeight: 600,
  },
  link: {
    color: '#2281bb',
    padding: '0 0.25rem',
    fontSize: '0.875rem',
  },
  actions: {
    color: '#BDC9D7'
  },
  divider: {
    backgroundColor: '#d9e2ee',
    margin: '0 20px',
  }
}));

function FeaturedPost(props) {
  const styles = useStyles();
  const {post} = props;

  // alert(Object.entries(post.list[0]));
  return (
    <>
    <Grid item xs={12} md={6}>
      <NoSsr>
        <GoogleFontLoader fonts={[{ font: 'Barlow', weights: [400, 600] }]} />
      </NoSsr>
      <Column p={0} gap={0} className={styles.card}>
        <Row wrap p={2} alignItems={'baseline'} className={styles.header}>
          <Item stretched className={styles.headline}>{post.title}</Item>
          <Item className={styles.actions}>
            <Link className={styles.link}> <Button>See all</Button></Link>
          </Item>
        </Row>
        {(post.list).map(({name,cost,img}) => (<PersonItem key={name} name={name} bid = {cost} img={img} />))}
        {/* <PersonItem name={'Amber Matthews'} bid={6} src={'https://img.seadn.io/files/37c1876a5cd53d9c8d0914f73a533018.png?auto=format&fit=max&w=512'} />
        
        <PersonItem name={'Russel Robertson'} bid={2} src={'https://img.seadn.io/files/8c3be0288c1053f14d6289cbb919249b.png?auto=format&fit=max&w=512'} />
        
        <PersonItem name={'Kathleen Ellis'} bid={2} src={'https://img.seadn.io/files/b8f5cdf1e9cd3fcf8547d9f09cc044c3.jpg?auto=format&fit=max&w=512'} /> */}
      </Column>
      </Grid>
    </>
    
  );
}
// {featuredPosts.map((post) => (
//   <FeaturedPost key={post.title} post={post} />
// ))}

FeaturedPost.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string.isRequired,
    list : PropTypes.array.isRequired,
  }).isRequired,
};

export default FeaturedPost;

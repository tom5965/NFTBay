import React from 'react';
import NoSsr from '@material-ui/core/NoSsr';
import GoogleFontLoader from 'react-google-font-loader';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';

import Button from '@material-ui/core/Button';
import { Column, Row, Item } from '@mui-treasury/components/flex';
import {
  Info,
  InfoTitle,
  InfoSubtitle,
  InfoCaption,
} from '@mui-treasury/components/info';
import { useGrowAvatarStyles } from '@mui-treasury/styles/avatar/grow';
import { useMusicInfoStyles } from '@mui-treasury/styles/info/music';

const useStyles = makeStyles(() => ({
  text: {
    display: 'flex',
    alignItems: 'center',
    '& > svg': {
      fontSize: 18,
      color: '#888',
      marginRight: 4,
    },
  },
  btn: {
    borderRadius: 20,
    padding: '0.125rem 0.75rem',
    borderColor: '#becddc',
    fontSize: '0.75rem',
  },
  listnum:{
    padding: '0.125rem 0.125rem',
    marginTop:7,
    fontSize:'1.3rem',
    fontWeight: '500',
  },
}));

const ListItem = ({ num, name, bid, img }) => {
    const commonProps = {
    blur: '12px',
    radius: 16,
    size: 48,
    opacity: 0.6,
  };
    const src = img;
  const avatarStyles = useGrowAvatarStyles({ src, ...commonProps });
  
  const styles = useStyles();
  <Row mt={2}>
        
        <Button className={styles.listnum}>{num}</Button>
        
          <Item>
            <div className={avatarStyles.root}>
              <Avatar src={src} />
            </div>
          </Item>

          <Info useStyles={useMusicInfoStyles} minWidth={0} position={'middle'}>
            <InfoTitle> <h3>Wait For You</h3></InfoTitle>
          </Info>
          <Info useStyles={useMusicInfoStyles} position={'right'}> 
           <InfoSubtitle> <h4>10 ETH</h4></InfoSubtitle>
           </Info>
           <Info>
            
           </Info>
          <Item position={'right'} sx={{paddingTop:20}}>
          <Button className={styles.btn} variant={'outlined'}>
            DETAIL
          </Button>
            
          </Item>
        </Row>
};

function Listup() {
  const commonProps = {
    // blur: '12px',
    radius: 16,
    size: 48,
    opacity: 0.6,
  };
  const src =
    'https://cdn1.vectorstock.com/i/1000x1000/85/40/music-abstract-poster-cover-1980s-style-background-vector-11958540.jpg';
  const avatarStyles = useGrowAvatarStyles({ src, ...commonProps });
  
  const styles = useStyles();
  return (
    <>
      <NoSsr>
        <GoogleFontLoader fonts={[{ font: 'Questrial' }]} />
      </NoSsr>
      <Column gap={2} width={'80%'}>
        
        <Row mt={2}>
        <Item sx={{ml:-5}}>
        <Button className={styles.listnum}>1</Button>
        </Item>
          <Item>
            <div className={avatarStyles.root} >
              <Avatar sx={{ml:10,mr:10}} src={src} />
            </div>
          </Item>

          <Info useStyles={useMusicInfoStyles} minWidth={0} position={'middle'}>
            <InfoTitle> <h3>Wait For You</h3></InfoTitle>
          </Info>
          <Info useStyles={useMusicInfoStyles} position={'right'}> 
           <InfoSubtitle> <h4>10 ETH</h4></InfoSubtitle>
           </Info>
           <Info>
            
           </Info>
          <Item position={'right'} sx={{paddingTop:20}}>
          <Button className={styles.btn} variant={'outlined'}>
            DETAIL
          </Button>
            
          </Item>
        </Row>

        
      </Column>
    </>
  );
}

export default Listup;
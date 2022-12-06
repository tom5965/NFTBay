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
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import Container from '@mui/material/Container';
import { useNavigate, useNavigation, useParams, NavLink, createSearchParams } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';

let type;

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
  withdraw_btn: {
    borderRadius: 20,
    padding: '0.125rem 0.75rem',
    borderColor: '#fa0f0f',
    fontSize: '0.75rem',
    color: '#fa0f0f',
  },
}));

const theme = createMuiTheme({
  overrides: {
    MuiCssBaseline: {
      "@global": {
        "*::-webkit-scrollbar": {
          width: "5px"
        },
        "*::-webkit-scrollbar-track": {
          background: "#E4EFEF"
        },
        "*::-webkit-scrollbar-thumb": {
          background: "#1D388F61",
          borderRadius: "2px"
        }
      }
    }
  }
});
let now = +new Date();
var timeStamp = setInterval(function(){
  now = +new Date();
},1000);

const PersonItem = ({ type,name, bid, img,tokenId, tokenAddress, endTime,id,account  }) => {
  const avatarStyles = useDynamicAvatarStyles({ size: 56 });
  const styles = usePersonStyles();
  let isFinish = false;
  now = + new Date();

  if(Number(endTime) <= Number(now)) isFinish = true;

  const navigate = useNavigate();

  let ifFinish = "";
  console.log(type);
  
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
          {isFinish == false ?<Button className={styles.btn} variant={'outlined'} 
          onClick={() => {
                    //name, bid, img,tokenId, tokenAddress, endTime,id,account
                    navigate({
                        pathname: '/Detail',
                        search: createSearchParams({
                            tokenId: tokenId,
                            tokenAddress: tokenAddress,
                            highestBid: bid,
                            auctionEndTime: endTime,
                            auctionId: id,
                            account: account,
                            name: name,
                        }).toString()
                    });
                }}>
            DETAIL
          </Button> : <Tooltip title="호가한 상품 : 낙찰 & 등록한 상품 : 낙찰가 회수">
            <Button className={styles.withdraw_btn} variant={'outlined'} > 경매 종료
            </Button>
            </Tooltip>}
            
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
    flexDirection : 'column',
    overflowY :'scroll',
    '&::-webkit-scrollbar': {display: 'none'}
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
  let show_list = [];
  // if(post.list.length > 3) show_list = (post.list).slice(0,3);
  // else show_list = post.list;
  show_list = post.list;
 
  if(post.title == '호가 내역') type = 0;
  else type = 1;

  console.log(type);
  // console.log(post.list);
  const {account} = props;

  const navigate = useNavigate();
  
  return (
    <>
    
    <Grid item xs={12} md={6}>
      <NoSsr>
        <GoogleFontLoader fonts={[{ font: 'Barlow', weights: [400, 600] }]} />
      </NoSsr>
      <Container fixed={true} >
      <Column p={0} gap={0} className={styles.card} sx={{display:'flex', flexDirection:'column',
      overflow:'hidden',
     overflowY:'scroll', height:350}}>
        <Row wrap p={2} alignItems={'baseline'} className={styles.header}>
          <Item stretched className={styles.headline}>{post.title}</Item>
          <Item className={styles.actions}>
            
          </Item>
        </Row>
       
        {(show_list).map(({name,cost,img,tokenId,tokenAddress,endTime,id,account}) => (<PersonItem key={name} name={name} bid = {cost} img={img} tokenId={tokenId} tokenAddress = {tokenAddress} endTime = {endTime} id = {id} account = {account} />))}
      </Column>
      </Container>
      </Grid>
    </>
    
  );
}
// {featuredPosts.map((post) => (
//   <FeaturedPost key={post.title} post={post} />
// ))}

// FeaturedPost.propTypes = {
//   post: PropTypes.shape({
//     title: PropTypes.string.isRequired,
//     // list : PropTypes.array.isRequired,
//   }).isRequired,
// };

export default FeaturedPost;

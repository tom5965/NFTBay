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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Web3 from 'web3'
import { AUCTION_ABI, AUCTION_ADDRESS, TOKENURIABI } from '../config'

let type;

const web3 = new Web3(Web3.givenProvider || 'https://localhost:7545')
const auctionContract = new web3.eth.Contract(AUCTION_ABI, AUCTION_ADDRESS)


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

const PersonItem = ({ itemType,name, bid, img,tokenId, tokenAddress, endTime,id,account  }) => {

  async function getBiddedAuctionInstances(contract){
    return await contract.methods.getBiddedAuctionInstances().call({from: account});
  }
  
  const avatarStyles = useDynamicAvatarStyles({ size: 56 });
  const styles = usePersonStyles();
  let isFinish = false;
  now = + new Date();

  const [endOpen,setEnd] = React.useState(false);

  if(Number(endTime) <= Number(now)) isFinish = true;

  const navigate = useNavigate();

  console.log(itemType);
  const afterEnd = async (e) =>{
    console.log("afterEnd in");
    //type : 0 호가 내역이므로 token을 내는 함수가 작동하고
    //type : 1 등록 내역이므로 낙찰가를 회수하는 함수가 작동
    if(itemType == 0){
      //alert("receive");
      // console.log("token id :"+tokenId);
      // console.log("bid :"+bid);
      // console.log("name :"+name);
      // console.log("tokenAddress :"+tokenAddress);
      // console.log("endTime :"+endTime);
      // console.log("account :"+account);
      // console.log("id :"+id);
      await auctionContract.methods.receiveToken(id).call();
    }
    else{
      //alert("widthdraw");
      await auctionContract.methods.widthdrawFromAuctionInstance(id).call();
      
    }
  };
  
  const earlyOpen = (e)=>{
    setEnd(true);
    //await auctionContract.methods.endAuction(id).call();
  };

  const endClose = (e)=>{
    setEnd(false);
  }

  const endOK = async(e)=>{
    setEnd(false);
    await auctionContract.methods.endAuction(id).call();
  }

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
          {isFinish == false ?<div><Button className={styles.btn} variant={'outlined'} 
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
                }}
                onContextMenu={earlyOpen}>
            DETAIL
          </Button>
          <Dialog
        open={endOpen}
        onClose={endClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"경매를 일찍 종료하시겠습니까?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            누르시면 경매가 바로 종료됩니다. 종료하시겠습니까?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={endClose}>Disagree</Button>
          <Button onClick={endOK} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog></div> : <Tooltip title="호가한 상품 : 낙찰 & 등록한 상품 : 낙찰가 회수">
            <Button className={styles.withdraw_btn} variant={'outlined'} onClick={afterEnd}> 경매 종료
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

  for(var i = 0; i<show_list.length;i++){
    show_list[i]['type'] = type;
  }
  

  console.log(show_list);
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
       
        {(show_list).map(({type,name,cost,img,tokenId,tokenAddress,endTime,id,account}) => (<PersonItem key={name} itemType={type}name={name} bid = {cost} img={img} tokenId={tokenId} tokenAddress = {tokenAddress} endTime = {endTime} id = {id} account = {account} />))}
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

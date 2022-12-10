import * as React from 'react';
import Web3 from 'web3'
import { AUCTION_ABI, AUCTION_ADDRESS, TOKENURIABI } from '../config'

import cx from 'clsx';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Popper from '@mui/material/Popper';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import Container from '@mui/material/Container';
import TextField from '@material-ui/core/TextField';
import { Column, Row, Item } from '@mui-treasury/components/flex';
import { DataGrid } from '@material-ui/data-grid';


import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import TextInfoContent from '@mui-treasury/components/content/textInfo';
import Grid from '@material-ui/core/Grid';

import SendIcon from '@mui/icons-material/Send';
import Logoicon from '../img/Logo_trans.png';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

import { useBlogTextInfoContentStyles } from '@mui-treasury/styles/textInfoContent/blog';
import { useOverShadowStyles } from '@mui-treasury/styles/shadow/over';
import { getFormControlLabelUtilityClasses } from '@mui/material';

import { useAsync,Async,createInstance } from 'react-async';
import './Detail.css';

const useStyles = makeStyles(({ breakpoints, spacing }) => ({
  root: {
    margin: 'auto',
    borderRadius: spacing(2), // 16px
    transition: '0.3s',
    boxShadow: '0px 14px 80px rgba(34, 35, 58, 0.2)',
    position: 'relative',
    maxWidth: '90%',
    marginLeft: 'auto',
    overflow: 'initial',
    background: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: spacing(2),
    [breakpoints.up('md')]: {
      flexDirection: 'row',
      paddingTop: spacing(2),
    },
  },
  media: {
    width: '60%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: spacing(-3),
    height: 0,
    paddingBottom: '45%',
    borderRadius: spacing(2),
    backgroundColor: '#fff',
    position: 'relative',
    [breakpoints.up('md')]: {
      width: '60%',
      marginLeft: spacing(-3),
      marginTop: 0,
      transform: 'translateX(-8px)',
    },
    '&:after': {
      content: '" "',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      //   backgroundImage: 'linear-gradient(147deg, #fe8a39 0%, #fd3838 74%)',
      borderRadius: spacing(2), // 16
      opacity: 0.5,
    },
  },
  content: {
    padding: 24,
  },
  cta: {
    marginTop: 24,
    textTransform: 'initial',
  },
  paper: {
    padding: spacing(2),
    textAlign: 'center',
  },
  textField: {
    width: '80%',
    marginRight: spacing(3),
  },
  bidButton: {
    borderRadius: 20,
    padding: '0.125rem 0.75rem',
    fontSize: '1rem',
  },
}));

const columns = [
  { field: 'id', headerName: 'NUM', width: 150 },
  {
    field: 'bid',
    headerName: '응찰가',
    width: 250,
    type: 'number',
    editable: true,
  },
  {
    field: 'bidTime',
    headerName: 'Date',
    width: 250,
    editable: true,
  },
  {
    field: 'Bidder',
    headerName: '응찰자 주소',
    width: 400,
    editable: true,
  },
];

let tokenId = '';
let tokenAddress = '';
let tokenName = '';

const web3 = new Web3(Web3.givenProvider || 'https://localhost:7545');
const auctionContract = new web3.eth.Contract(AUCTION_ABI, AUCTION_ADDRESS);

const loadAuctionInstances = async () => {
    
  //await new Promise((resolve, reject) => setTimeout(resolve, 1000));

  // setAuctionInstances((auctionInstances) => [...auctionInstances, auctionInstance])
  const nftContract = new web3.eth.Contract(TOKENURIABI, tokenAddress);
  await new Promise((resolve, reject) => setTimeout(resolve, 1000));
  const result = await nftContract.methods.tokenURI(tokenId).call();

  const ipfsAddress = await result.replace("ipfs://", "https://ipfs.io/ipfs/");
  
  console.log(ipfsAddress);
  const response = await fetch(ipfsAddress);
  const res_json = await response.json();
  const imageIpfsAddress = await res_json.image.replace("ipfs://", "https://ipfs.io/ipfs/");

  const imageData = await fetch(imageIpfsAddress);
  const _img = await imageData.url;

  return _img;

}

const AsyncPlayer = createInstance({promiseFn:loadAuctionInstances},"AsyncPlayer");

let now = + new Date();

var timeStamp = setInterval(function(){
  now = +new Date();
},1000);

export default function Detail({ route }) {
  // const tokenId = route.params.id;
  // alert("in");
  // const { search } = useParams;	// 문자열 형식으로 결과값이 반환된다.

  const [searchparams] = useSearchParams();
  const [auctionLogs, setAuctionLogs] = React.useState([]);
  const [contract, setContract] = React.useState();
  const [rows, setRow] = React.useState([]);

  tokenId = searchparams.get("tokenId");
  tokenAddress = searchparams.get("tokenAddress");
  const highestBid = searchparams.get("highestBid");
  const endTime = searchparams.get("auctionEndTime");
  const auctionId = searchparams.get("auctionId");
  const account = searchparams.get("account");
  const name = searchparams.get("name");
  var date = new Date(Number(endTime));

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  var time_diff = Number(endTime) - now;

//   if(time_diff < 1000 * 60)
// 	  a += Math.floor(time_diff / 1000) + ' 초전';
//   else if(time_diff < 1000 * 60 * 60)
// 	a += Math.floor(time_diff / (1000 * 60)) + ' 분전';
// else if(time_diff < 1000 * 60 * 60 * 24)
// 	a += Math.floor(time_diff / (1000 * 60 * 60)) + ' 시간전';
// else if(time_diff < 1000 * 60 * 60 * 24 * 30)
// 	a += Math.floor(time_diff / (1000 * 60 * 60 * 24)) + ' 일전';
// else if(time_diff < 1000 * 60 * 60 * 24 * 30 * 12)
// 	a += Math.floor(time_diff / (1000 * 60 * 60 * 24 * 30)) + ' 달전';


  const [bidValue, setbidValue] = React.useState(0);
  const bidChange = (event) => {
    setbidValue(event.target.value);
  };


  // console.log(contract);
  const navigate = useNavigate();
  //LOGO 클릭 시 main 화면으로 이동
  const toMain = () => {
    navigate("/");
  }


  //유저 아이콘 클릭시
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };



  const styles = useStyles();
  const {
    button: buttonStyles,
    ...contentStyles
  } = useBlogTextInfoContentStyles();
  const shadowStyles = useOverShadowStyles();


  const [mainDetail, setmainDetail] = React.useState(true);

  const detailMainClick = (event) => {
    setmainDetail(!mainDetail);
  };

  function detailPopup(auctionInstanceId) {
    auctionContract.events.AuctionLogCreated({
      fromBlock: 'latest'
    }, (error, event) => onLogAdded(event.auctionInstanceId))
  }

  async function onLogAdded(auctionId) {
    loadLogs(auctionId);
  }

  async function loadLogs(auctionId) {
    const auctionLog = await auctionContract.methods.getAuctionLogs(auctionId).call()
   // console.log(auctionLog);
    let tmpArray = []
    for (var i = 0; i < auctionLog.length; i++) {

      let date = new Date(auctionLog[i].bidTime * 1000);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hour = date.getHours();
      let min = date.getMinutes();
      let sec = date.getSeconds();

      let tmpTime = year + "." + month + "." + day + " " + hour + ":" + min + ":" + sec;

      let tmp = {
        id: i + 1,
        bid: auctionLog[i].bidPrice,
        bidTime: tmpTime,
        Bidder: auctionLog[i].bidder
      };

      tmpArray.push(tmp);
    }
    setRow([...tmpArray]);
  }

  function bid() {
    auctionContract.methods.bid(auctionId, bidValue)
      .send({ from: account })
  }

  loadLogs(auctionId);
  //console.log()

  return (
    <>
      <Container maxWidth="lg">
        <React.Fragment>

          <Toolbar label={'margin = "normal"'} sx={{ marginBottom: 5 }}>

            <Button onClick={toMain}>
              <img src={Logoicon}></img>

            </Button>
            <Typography
              component="h2"
              variant="h5"
              color="inherit"
              align="center"
              noWrap
              sx={{ flex: 1 }}
            >
              <Paper
                component="form"
                sx={{ display: 'flex', alignItems: 'center', width: 900 }}
              >
                <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                  <SearchIcon />
                </IconButton>
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="어떤 컬렉션을 찾으세요?"
                  inputProps={{ 'aria-label': 'search google maps' }}
                  fullWidth
                />

              </Paper>

            </Typography>


            <div>
              <IconButton onClick={handleClick}>
                <AccountCircleIcon fontSize="large"></AccountCircleIcon>

              </IconButton>


              <Popper id={id} open={open} anchorEl={anchorEl}>
                <Box sx={{ width: '100%', maxWidth: 500, bgcolor: 'background.paper' }}>
                  <nav aria-label="main mailbox folders">
                    <List>
                      <ListItem disablePadding>
                        <ListItemButton>
                          <ListItemIcon>
                            <AddBusinessIcon />
                          </ListItemIcon>
                          <ListItemText primary="상품 등록" />
                        </ListItemButton>
                      </ListItem>

                    </List>
                  </nav>
                </Box>

              </Popper>
            </div>

          </Toolbar>
        </React.Fragment>


        {mainDetail ? <Card className={cx(styles.root, shadowStyles.root)} sx={{ marginTop: 50, }}> 
        <AsyncPlayer>
                        <AsyncPlayer.Fulfilled>{
                            result =>(
                              <CardMedia
                              className={styles.media}
                              image={
                                result
                              }
                            />
                                
                            )
                            
                            }
                        
                        </AsyncPlayer.Fulfilled>
                    </AsyncPlayer>
        
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextInfoContent
                  classes={contentStyles}
                  overline={'#'+tokenId}
                  heading={name}
                />
              </Grid>

              <Grid item xs={12} sm={5}>
                <TextInfoContent
                  classes={contentStyles}
                  overline={'현재가'}
                  heading={highestBid}

                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextInfoContent
                  classes={contentStyles}
                  overline={'경매 종료 일자'}
                  heading={year + "/" + month + "/" + day}

                />
              </Grid>
              <Grid item xs={12} sm={2}>

                <IconButton onClick={detailMainClick}><NavigateNextIcon fontSize="large" /></IconButton>
              
              </Grid>
              <Grid item xs={12} sm={8}>
                
                  {
                    (now < Number(endTime))?
                    <div> <Row><TextField id="standard-basic" label="응찰가 입력 (ETH)" className={styles.textField}
                    onChange={bidChange} />
                  <IconButton onClick={bid}><SendIcon fontSize="medium" /></IconButton> </Row> </div>:
                  <Button variant="outlined" color="error" className="blink">
                  경매가 종료된 상품입니다
                  </Button>
                  }
                  
                
                
              </Grid>


            </Grid>

          </CardContent> </Card> :

          <Card sx={{ marginTop: 50, }}>


            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextInfoContent
                    classes={contentStyles}
                    heading={'History'}

                  />
                </Grid>

              </Grid>
              <Row>

                <IconButton onClick={detailMainClick}><NavigateBeforeIcon fontSize="large" /></IconButton>
                <div style={{ height: 400, width: '100%' }}>
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={6}
                  />
                </div>
              </Row>


            </CardContent> </Card>}





      </Container>


    </>
  );
};

Detail.propTypes = {
  post: PropTypes.shape({
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    end_date: PropTypes.string.isRequired,
    highest_bid: PropTypes.number.isRequired,
    highest_bidder: PropTypes.string.isRequired,
    bidder_list: PropTypes.array.isRequired,
  }).isRequired,
};



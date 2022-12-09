import * as React from 'react';
import Web3 from 'web3'
import { AUCTION_ABI, AUCTION_ADDRESS, ERC721_ABI } from '../config'
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Popper from '@mui/material/Popper';
import Box from '@mui/material/Box';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';

import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Logoicon from '../img/Logo_trans.png';
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { useAsync, Async, createInstance } from 'react-async';

import Main from '../Blog/Main';
import { useGrowAvatarStyles } from '@mui-treasury/styles/avatar/grow';
import { useMusicInfoStyles } from '@mui-treasury/styles/info/music';
import { makeStyles } from '@material-ui/core/styles';
import { Column, Row, Item } from '@mui-treasury/components/flex';
import Avatar from '@material-ui/core/Avatar';
import {
    Info,
    InfoTitle,
    InfoSubtitle,
    InfoCaption,
} from '@mui-treasury/components/info';

import { useNavigate, useParams, useSearchParams,createSearchParams } from 'react-router-dom';

let list = [];
let account = "";
let type = -1;
let name = [];
let data = [];
let num = 0;
let totalList = [];

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
    listnum: {
        padding: '0.125rem 0.125rem',
        marginTop: 7,
        fontSize: '1.3rem',
        fontWeight: '500',
        color : '#000000',
    },
}));

const ListItem2 = ({ tokenId, tokenAddress, highestBid, auctionEndTime, id, account }) => {
    console.log("listitem2");
    const commonProps = {
        blur: '12px',
        radius: 16,
        size: 48,
        opacity: 0.6,
    };

    let src = ''
    //let src = 'ipfs://QmYhbk2FKxeihT8NC7qGvCEuNTB8yyALP4yrQPWYRc6ZHQ'
    const avatarStyles = useGrowAvatarStyles({ src, ...commonProps });
    const navigate = useNavigate();

    console.log(tokenId);
    const styles = useStyles();
    const tmpName = name[num];
    num += 1;
    return (
        <Row mt={2}>
            <Item sx={{ ml: -5 }}>
                <Button className={styles.listnum}>{num}</Button>
            </Item>
            <Item>
                <div className={avatarStyles.root} >


                    <Avatar sx={{ ml: 10, mr: 20, display: 'table' }} src={data[num - 1]}>

                    </Avatar>


                </div>
            </Item>

            <Info useStyles={useMusicInfoStyles} minWidth={0} position={'middle'}>
                <InfoTitle sx={{mL:10}}> <h3> {tmpName} </h3> </InfoTitle>
            </Info>
            <Info useStyles={useMusicInfoStyles} position={'right'}>
                <InfoSubtitle> <h4>{highestBid} WEI</h4></InfoSubtitle>
            </Info>
            <Info>

            </Info>
            <Item position={'right'} sx={{ paddingTop: 20 }}>
                <Button className={styles.btn} variant={'outlined'} onClick={() => {
                    
                    navigate({
                        pathname: '/Detail',
                        search: createSearchParams({
                            tokenId: tokenId,
                            tokenAddress: tokenAddress,
                            highestBid: highestBid,
                            auctionEndTime: auctionEndTime,
                            auctionId: id,
                            account: account,
                            name: tmpName,
                        }).toString()
                    });
                }}>
                    DETAIL
                </Button>

            </Item>
        </Row>
    );

};

const web3 = new Web3(Web3.givenProvider || 'https://localhost:7545');
const auctionContract = new web3.eth.Contract(AUCTION_ABI, AUCTION_ADDRESS);

async function getCosignedAuctionInstances(account){
    const result = await auctionContract.methods.getCosignedAuctionInstances().call({from: account});
    return result;
}

async function getBiddedAuctionInstances(account){
    return await auctionContract.methods.getBiddedAuctionInstances().call({from: account});
}

async function load(){
    if(type == 0){
        list = await getBiddedAuctionInstances(account);
    }
    else{
        list = await getCosignedAuctionInstances(account);
    }


    for (var i = 0; i < list.length; i++) {
        let tmp={};
        tmp['tokenId'] = list[i].tokenId;
        tmp['tokenAddress'] = list[i].tokenAddress;
        tmp['auctionEndTime'] = list[i].auctionEndTime;
        tmp['highestBid'] = list[i].highestBid;
        tmp['id'] = list[i].id;

        const nftContract = new web3.eth.Contract(ERC721_ABI, list[i].tokenAddress);
        await new Promise((resolve, reject) => setTimeout(resolve, 1000));
        const result = await nftContract.methods.tokenURI(list[i].tokenId).call();
        // { tokenId, tokenAddress, highestBid, auctionEndTime, id }
        
        const ipfsAddress = await result.replace("ipfs://", "https://ipfs.io/ipfs/");

        const response = await fetch(ipfsAddress);
        const res_json = await response.json();

        name.push(res_json.name);
        tmp['name'] = res_json.name;

        const imageIpfsAddress = await res_json.image.replace("ipfs://", "https://ipfs.io/ipfs/");

        const imageData = await fetch(imageIpfsAddress);
        const _img = await imageData.url;
        data.push(_img);
        tmp['img'] = _img;
        totalList.push(tmp);
    }
    console.log(totalList);
}
const AsyncPlayer = createInstance({ promiseFn: load }, "AsyncPlayer");


export default function MyList() {
    num = 0;
    totalList = [];
    const [searchparams] = useSearchParams();

    type = searchparams.get("type");
    account = searchparams.get("account");
    list = searchparams.get("list");

    let title = "";
    if(type == 0) title = "호가 내역";
    else title = "등록 내역";
    
    console.log(list);

    const navigate = useNavigate();
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
    
            <Grid container spacing={10} >
                        <Main title={title}/>

                    </Grid>
            <AsyncPlayer>
                <AsyncPlayer.Fulfilled>
                    {(totalList).map(
                        ({ tokenId, tokenAddress, highestBid, auctionEndTime, id }) => (
                            <ListItem2 key={tokenId} tokenId={tokenId} tokenAddress={tokenAddress} highestBid={highestBid} auctionEndTime={auctionEndTime} id={id} account={account} />
                        )
                        )
                    }
                </AsyncPlayer.Fulfilled>
            </AsyncPlayer>
    
    
          </Container>
    

        </>
      );
}

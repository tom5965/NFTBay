import * as React from 'react';
import Web3 from 'web3'
import { AUCTION_ABI, AUCTION_ADDRESS, ERC721_ABI } from '../config'

import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import { createTheme, ThemeProvider } from '@mui/material/styles';


import FeaturedPost from '../Blog/FeaturedPost';
import Main from '../Blog/Main';
import Listup from '../Blog/Listup';



import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';


import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import Logoicon from '../img/Logo_trans.png';
import metaMaskIcon from "../img/metamask3.png"
import { useNavigate } from 'react-router-dom';
import { Column, Row, Item } from '@mui-treasury/components/flex';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import Box from '@mui/material/Box';
import Popper from '@mui/material/Popper';
import CardMedia from '@mui/material/CardMedia';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import Switch from '@mui/material/Switch';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Birthday from '@mui-treasury/components/textField/birthday';
import { useBootstrapInputStyles } from '@mui-treasury/styles/input/bootstrap';
import { bootstrapLabelStyles } from '@mui-treasury/styles/textField/bootstrap';
import { makeStyles } from '@material-ui/core/styles';
import { createInstance } from 'react-async';


let buy = [];

let sell = [];

let buy_tokenId = [];
let sell_tokenId = [];
const featuredPosts = [
    {
        title: '호가 내역',
        list: buy,
    },
    {
        title: '등록 컬렉션',
        list: sell,
    },
];


const theme = createTheme();

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const useStyles = makeStyles(() => ({
    label: { marginBottom: 8 },
    day: {
        width: 56,
    },
    month: {
        width: 56,
    },
    year: {
        width: 72,
    },
}));
const useLabelStyles = makeStyles(bootstrapLabelStyles);
let cosignedAuctionInstances = [];


export default function Blog() {

    // const { sections, title } = props;

    //로그인
    const [isLogin, setLogin] = React.useState(false);

    //login modal
    const [modalOpen, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const onLogin = (e) => {
        setLogin(!isLogin);
        setOpen(true);
    };

    const [account, setAccount] = React.useState();
    const accountRef = React.useRef();
    accountRef.current = account;
    const [contract, setContract] = React.useState();
    const [auctionInstances, setAuctionInstances] = React.useState([]);
    const [newAuctionName, setNewAuctionName] = React.useState('');
    const [startingPrice, setStartingPrice] = React.useState(0);

    React.useEffect(() => {
        if (typeof account !== 'undefined') {
            loadContract(contract);
        }
    }, [account]);

    //login창
    const startLogin = async (e) => {
        loadAccount();
    };
    
    async function loadAccount() {
        if (typeof window.ethereum == 'undefined') {
            console.log('There is no wallets')
            window.open('https://metamask.io/download/').focus()
            return
        }

        if (!window.ethereum.isMetaMask) {
            console.log('There is no metamask.')
            window.open('https://metamask.io/download/').focus()
            return
        }

        await window.ethereum.request({
            method: 'wallet_requestPermissions',
            params: [{ eth_accounts: {} }],
        }).then((permissions) => {
            setAccount(permissions[0].caveats[0].value[0])

            window.ethereum.on('accountsChanged', function (accounts) {
                setAccount(accounts[0])
            })
            handleClose()
        })
    }

    async function loadContract() {
        const web3 = new Web3(Web3.givenProvider || 'https://localhost:7545')
        const auctionContract = new web3.eth.Contract(AUCTION_ABI, AUCTION_ADDRESS)
        setContract(auctionContract);

        auctionContract.events.AuctionInstanceCreated({
            fromBlock: 'latest'
        }, (error, event) => loadAuctionInstances(auctionContract));

        loadAuctionInstances(auctionContract);
    }

    async function loadAuctionInstances(contract) {
        setAuctionInstances([])
        const auctionInstanceCount = await contract.methods.auctionInstanceCount().call();
        
        for (var i = 0; i < auctionInstanceCount; i++) {
            const auctionInstance = await contract.methods.getAuctionInstance(i).call();
            setAuctionInstances((auctionInstances) => [...auctionInstances, auctionInstance])
        }
    }

    // async function createAuctionInstance(tokenAddress, tokenId, startingPrice, auctionEndTime) {
    //     const web3 = new Web3(Web3.givenProvider || 'https://localhost:7545')
    //     const tokenContract = new web3.eth.Contract(ERC721_ABI, tokenAddress);
    //     await tokenContract.methods.approve(AUCTION_ADDRESS, tokenId).send({ from: account })
    //     .then(() => {
    //         contract.methods.createAuctionInstance(tokenAddress, tokenId, web3.utils.toWei(String(startingPrice)), auctionEndTime).send({ from: account })
    //     })
    // }

    async function approveAccount(tokenAddress, tokenId, startingPrice, auctionEndTime){
        const web3 = new Web3(Web3.givenProvider || 'https://localhost:7545')
        const tokenContract = new web3.eth.Contract(ERC721_ABI, tokenAddress);
        await tokenContract.methods.approve(AUCTION_ADDRESS, tokenId).send({ from: account });
    }

    async function createAuctionInstance(tokenAddress, tokenId, startingPrice, auctionEndTime){
        const web3 = new Web3(Web3.givenProvider || 'https://localhost:7545');
        const tokenContract = new web3.eth.Contract(ERC721_ABI, tokenAddress);
        await contract.methods.createAuctionInstance(tokenAddress, tokenId, web3.utils.toWei(String(startingPrice)), auctionEndTime).send({ from: account });
    }
//     getCosignedAuctionInstances() 로 내가 출품했던 경매의 목록을,
//     getBiddedAuctionInstances()로 내가 호가했던 경매의 목록을 가져올 수 있습니다
    
    async function getCosignedAuctionInstances(contract){
        const result = await contract.methods.getCosignedAuctionInstances().call({from: account});
        return result;
    }

    async function getBiddedAuctionInstances(contract){
        return await contract.methods.getBiddedAuctionInstances().call({from: account});
    }
//     getCosignedAuctionInstances() 로 내가 출품했던 경매의 목록을,
//     getBiddedAuctionInstances()로 내가 호가했던 경매의 목록을 가져올 수 있습니다
    
    async function getCosignedAuctionInstances(contract){
        const result = await contract.methods.getCosignedAuctionInstances().call({from: account});
        return result;
    }

    async function getBiddedAuctionInstances(contract){
        return await contract.methods.getBiddedAuctionInstances().call({from: account});
    }

    const navigate = useNavigate();

    //LOGO 클릭 시 main 화면으로 이동
    const toMain = () => {
        navigate("/");
    }

    //유저 아이콘 클릭시
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popper' : undefined;

    //상품 등록
    const [registerOpen, setRegisterOpen] = React.useState(false);

    const [dueDayValue, setdueDayValue] = React.useState('');
    const styles = useStyles();
    const labelStyles = useLabelStyles();
    const bootstrap = useBootstrapInputStyles();

    const [registerValue, setRegisterValue] = React.useState({tokenId:"", des:"",bid :"", tokenAddress:"",dueDD:"",dueMN:"",dueYY:""});
    const registerChange = (event) => {
        setRegisterValue({...registerValue, [event.target.id]:event.target.value,});
    };

    const [agree,setAgree] = React.useState(false);

    const registerClick = () => {
        setRegisterOpen(true);
    };
    const registerCloseCancel = () => {
       setRegisterOpen(false);
    }

    const registerClose_R = () => {
        
        var dueDate = dueDayValue + "T23:59:59.000Z";
        var unixTime = Math.floor((new Date(dueDate).getTime()) / 1000);
        
        if(agree == true){
            setRegisterOpen(false);
            createAuctionInstance(registerValue.tokenAddress, Number(registerValue.tokenId), Number(registerValue.bid), unixTime);
        }
        else{
            alert("판매 동의를 해주십시오.");
        }
        
    }

    

    const approve = async() =>{
       setAgree(!agree);
       var dueDate = dueDayValue + "T23:59:59.000Z";
        var unixTime = Math.floor((new Date(dueDate).getTime()) / 1000);
       approveAccount(registerValue.tokenAddress, Number(registerValue.tokenId), Number(registerValue.bid), unixTime);

    }
    async function myInfoLoading() {
        

        sell_tokenId = await getCosignedAuctionInstances(contract);
        var sell_Count = sell_tokenId.length;

        //Sell
        const web3 = new Web3(Web3.givenProvider || 'https://localhost:7545')
        const auctionContract = new web3.eth.Contract(AUCTION_ABI, AUCTION_ADDRESS)
        
        for (var i = 0; i < sell_Count; i++) {
            let tmp = {};
            const nftContract = await new web3.eth.Contract(ERC721_ABI, sell_tokenId[i].tokenAddress);
            tmp['tokenId'] = sell_tokenId[i].tokenId;
            tmp['tokenAddress'] = sell_tokenId[i].tokenAddress;
            tmp['cost'] = sell_tokenId[i].highestBid;
            tmp['endTime'] = sell_tokenId[i].auctionEndTime;
            tmp['id'] = sell_tokenId[i].id;
            tmp['account'] = accountRef.current;
            

            await new Promise((resolve, reject) => setTimeout(resolve, 1000));
            const result = await nftContract.methods.tokenURI(sell_tokenId[i].tokenId).call();

            const ipfsAddress = await result.replace("ipfs://", "https://ipfs.io/ipfs/");
    
            const response = await fetch(ipfsAddress);
            const res_json = await response.json();
            tmp['name'] = res_json['name'];

            const imageIpfsAddress = await res_json.image.replace("ipfs://", "https://ipfs.io/ipfs/");
    
            const imageData = await fetch(imageIpfsAddress);
            const _img = await imageData.url;

            tmp['img'] = _img;
            if(sell.findIndex(e => e.id === tmp['id']) === -1) sell.push(tmp);
        }


        //BUY
        buy_tokenId = await getBiddedAuctionInstances(contract);
        await new Promise((resolve, reject) => setTimeout(resolve, 1000));
        var buy_Count = buy_tokenId.length;
        for (var i = 0; i < buy_Count; i++) {
            let tmp = {};
            const nftContract = await new web3.eth.Contract(ERC721_ABI, buy_tokenId[i].tokenAddress);
            tmp['tokenId'] = buy_tokenId[i].tokenId;
            tmp['tokenAddress'] = buy_tokenId[i].tokenAddress;
            tmp['cost'] = buy_tokenId[i].highestBid;
            tmp['endTime'] = buy_tokenId[i].auctionEndTime;
            tmp['id'] = buy_tokenId[i].id;
            tmp['account'] = accountRef.current;
            

            await new Promise((resolve, reject) => setTimeout(resolve, 1000));
            const result = await nftContract.methods.tokenURI(buy_tokenId[i].tokenId).call();

            const ipfsAddress = await result.replace("ipfs://", "https://ipfs.io/ipfs/");
    
            const response = await fetch(ipfsAddress);
            const res_json = await response.json();
            tmp['name'] = res_json['name'];

            const imageIpfsAddress = await res_json.image.replace("ipfs://", "https://ipfs.io/ipfs/");
    
            const imageData = await fetch(imageIpfsAddress);
            const _img = await imageData.url;

            tmp['img'] = _img;
            if(buy.findIndex(e => e.id === tmp['id']) === -1) buy.push(tmp);

        }

    }
    

    const AsyncPlayer = createInstance({ promiseFn: myInfoLoading }, "AsyncPlayer");
    
    //css

    const ModalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 700,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: "10px",
        margin: "0 auto",
        // display:"flex",
        alginItems: "center",
    };

    //darkmode switch
    const label = { inputProps: { 'aria-label': 'Switch demo' } };

    const [isDark, setDark] = React.useState(false);
    const handleChange = (event) => {
        setDark(!isDark);
    };

    

    
    
    return (
        <ThemeProvider theme={isDark ? darkTheme : theme}>
            <CssBaseline />
            <Container maxWidth="lg">


                <React.Fragment>

                    <Toolbar label={'margin = "normal"'}>

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
                                    
                                </IconButton>
                                <InputBase
                                    sx={{ ml: 1, flex: 1 }}
                                    placeholder=""
                                    inputProps={{ 'aria-label': 'search google maps' }}
                                    fullWidth
                                />

                            </Paper>

                        </Typography>


                        {account != null ? null : <div><Button color="secondary" variant="outlined"
                            onClick={onLogin}> 지갑 연결하기</Button>
                        </div>}

                        <Modal
                            open={modalOpen}
                            onClose={handleClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={ModalStyle}>
                                <Typography id="modal-modal-title" variant="h6" component="h3" sx={{ mb: 2, textAlign: "center" }}>
                                    지갑 연결
                                </Typography>
                                <Divider />
                                <ListItem disablePadding sx={{ mt: 5, mb: 5 }}>
                                    <ListItemButton onClick={startLogin}>
                                        <img src={metaMaskIcon} sx={{ width: 50, height: 100, align: "center" }}></img>
                                        <ListItemText primary="메타마스크 연결" />

                                    </ListItemButton>
                                </ListItem>
                                <Divider />
                                <ListItem disablePadding sx={{ mt: 1, textAlign: "center" }}>


                                    <ListItemText primary="더 많은 지갑 지원 예정.." />

                                </ListItem>
                            </Box>
                        </Modal>

                        {account != null ? <div>
                            <IconButton onClick={handleClick}>
                                <AccountCircleIcon fontSize="large"></AccountCircleIcon>

                            </IconButton>


                            <Popper id={id} open={open} anchorEl={anchorEl}>
                                <Box sx={{ width: '100%', maxWidth: 500, bgcolor: 'background.paper' }}>
                                    <nav aria-label="main mailbox folders">
                                        <List>
                                            <ListItem disablePadding>
                                                <ListItemButton onClick={registerClick}>
                                                    <ListItemIcon>
                                                        <AddBusinessIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary="상품 등록" />
                                                </ListItemButton>
                                            </ListItem>

                                            <ListItem disablePadding>
                                                <ListItemButton>
                                                    <ListItemIcon>
                                                        <DarkModeIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary="다크 모드" />
                                                    <Switch checked={isDark}
                                                        onChange={handleChange} {...label} />
                                                </ListItemButton>
                                            </ListItem>


                                        </List>
                                    </nav>
                                </Box>

                            </Popper>
                            <div>
                                <Dialog
                                    open={registerOpen}
                                    onClose={registerCloseCancel}
                                    maxWidth="md"
                                >
                                    <DialogTitle id="form-dialog-title">상품 등록</DialogTitle>
                                    <DialogContent>
                                        <Row sx={{ width: '100%' }}>
                                            
                                            <Column sx={{ marginLeft: 20, width: '100%' }}>
                                                <Row>
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            required
                                                            id="tokenId"
                                                            name="tokenId"
                                                            label="tokenId"
                                                            fullWidth
                                                            autoComplete="given-name"
                                                            variant="outlined"
                                                            onChange={registerChange}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}></Grid>

                                                </Row>



                                                <Grid item xs={24} sm={12} sx={{ marginTop: 2 }}>
                                                    <TextField
                                                        required
                                                        id="des"
                                                        name="des"
                                                        label="description"
                                                        multiline
                                                        rows={4}
                                                        fullWidth
                                                        autoComplete="given-name"
                                                        variant="outlined"
                                                        onChange={registerChange}
                                                    />
                                                </Grid>
                                            </Column>

                                        </Row>


                                        <Grid container spacing={3} sx={{ marginTop: 3 }}>


                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    required
                                                    id="bid"
                                                    name="bid"
                                                    label="시작가 (MATIC)"
                                                    fullWidth
                                                    autoComplete="shipping address-level2"
                                                    variant="standard"
                                                    onChange={registerChange}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Birthday
                                                    label={'판매종료일자'}
                                                    value={dueDayValue}
                                                    onChange={setdueDayValue}
                                                    // display={{ day: '10', month: '02', year: '1994' }}
                                                    InputLabelProps={{ classes: labelStyles, className: styles.label }}
                                                >
                                                    <Birthday.Day
                                                        classes={bootstrap}
                                                        className={styles.day}
                                                        placeholder={'DD'}
                                                    />
                                                    <Birthday.Month
                                                        classes={bootstrap}
                                                        className={styles.month}
                                                        placeholder={'MM'}
                                                    />
                                                    <Birthday.Year
                                                        classes={bootstrap}
                                                        className={styles.year}
                                                        placeholder={'YYYY'}
                                                    />
                                                    {/* <FormHelperText error>nextFocus is disabled!</FormHelperText> */}
                                                </Birthday>
                                            </Grid>
                                            <Grid item xs={12} sm={12}>
                                                <TextField
                                                    required
                                                    id="tokenAddress"
                                                    name="tokenAddress"
                                                    label="tokenAddress"
                                                    fullWidth
                                                    autoComplete="shipping postal-code"
                                                    variant="standard"
                                                    onChange={registerChange}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <FormControlLabel
                                                    control={<Checkbox color="primary" name="saveAddress" value="yes" onChange={approve} />}
                                                    label="상기 정보를 확인하였고, 판매 등록에 동의합니다." />
                                            </Grid>
                                        </Grid>
                                    </DialogContent>

                                    <DialogActions>
                                        <Button onClick={registerCloseCancel} color="primary">
                                            취소
                                        </Button>
                                        <Button onClick={registerClose_R} color="primary">
                                            등록
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </div>
                        </div>
                            : null}

                    </Toolbar>
                </React.Fragment>

                <Toolbar></Toolbar>
                <main>
                    {account != null ? <div>
                        <Grid container spacing={4} sx={{ height: 400 }}>
                        <AsyncPlayer>
                            <AsyncPlayer.Fulfilled>
                            {featuredPosts.map((post) => (
                                <FeaturedPost key={post.title} post={post} account = {accountRef.current}/>
                            ))}
                            </AsyncPlayer.Fulfilled>
                        </AsyncPlayer>
                        </Grid>
                        <Grid sx={{ mb: 5 }}></Grid>
                        <Grid container spacing={10} >
                        <Main title="전체 상품 보기"/>

                    </Grid>
                    </div> : <div>
                        <Grid container spacing={4} sx={{height:400}}>
                        {featuredPosts.map((post) => (
                                <FeaturedPost key={post.title} post={post} account = {accountRef.current}/>
                            ))}
                            </Grid>
                            <Grid sx={{ mb: 5 }}></Grid>
                        <Grid container spacing={20} >
                        <Main title="전체 상품 보기"/>
    
                        </Grid>
                        <Grid sx={{ mb: 3 }}></Grid>
                        <Item sx={{ width:"70%",bgcolor:'#dcdcdc',textAlign:'center',borderRadius:'12px',border:"solid 20px #dcdcdc"}}>지갑 연결 후 이용 가능합니다.</Item>
                        </div>}

                    

                    {auctionInstances.length == 0? null : <Listup key="list" list={auctionInstances} account = {account}/>}

                </main>
            </Container>
        </ThemeProvider>
    );
}


import * as React from 'react';
import Web3 from 'web3'
import { AUCTION_ABI, AUCTION_ADDRESS } from '../config'

import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import { createTheme, ThemeProvider } from '@mui/material/styles';


import FeaturedPost from '../Blog/FeaturedPost';
import Main from '../Blog/Main';

import Modal from '@mui/material/Modal';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import LogoutIcon from '@mui/icons-material/Logout';
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

import Box from '@mui/material/Box';
import Popper from '@mui/material/Popper';
import { makeStyles } from "@material-ui/core/styles";

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import Switch from '@mui/material/Switch';

const buy = [
    {name:'Wassie 10352', cost : 0.6,
     img : 'https://img.seadn.io/files/37c1876a5cd53d9c8d0914f73a533018.png?fit=max&w=1000'},

     {name : 'Wassie 2651', cost : 0.6142,
    img: 'https://img.seadn.io/files/8c3be0288c1053f14d6289cbb919249b.png?auto=format&fit=max&w=512'},
    
];

const sell = [
    {name : '#80', cost : 0.085,
    img:'https://i.seadn.io/gae/tk8c7kTX_euzFuLP_6rl_f_1ZPMMFNEEu5AqjdlzMOzl0zzbfIqyKZAkVetmToq299M1ger-k9D0F7Pyaoe9ndf_aEj6UHnhWnq-fg?auto=format&w=512'},

    {name : '7330', cost: 58.300,
    img : 'https://img.seadn.io/files/f4e7af0cf0d55d6529e43efbb68427ea.png?auto=format&fit=max&w=512'},

    {name : 'Pudgy Penguin #3139', cost : 2.5946,
    img:'https://img.seadn.io/files/82f60175d1c642299b0e4c8aa8ea7d14.png?auto=format&fit=max&w=512' },

];

const featuredPosts = [
    {
        title: '호가 내역',
        list : buy,
    },
    {
        title: '등록 컬렉션',
        list : sell,
    },
];


const theme = createTheme();

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});


export default function Blog() {

    // const { sections, title } = props;

    //로그인
    const [isLogin, setLogin] = React.useState(false);
    const [accountLoaded, setAccountLoaded] = React.useState(false);


    //login modal
    const [modalOpen, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const onLogin = (e) => {
        setLogin(!isLogin);
        setOpen(true);
    };


    //login창
    const startLogin = async (e) => {
        setAccountLoaded(false);


        loadAccount()
        .then(() => {
            loadContract()
        })
    };

    const [account, setAccount] = React.useState();
    const [contract, setContract] = React.useState();
    const [auctionInstances, setAuctionInstances] = React.useState([]);
    const [newAuctionName, setNewAuctionName] = React.useState('');
    const [startingPrice, setStartingPrice] = React.useState(0);

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
            params: [{ eth_accounts: {}}],
        }).then((permissions) => {
            setAccount(permissions[0].caveats[0].value[0])
            setAccountLoaded(true)

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
        const auctionInstanceCount = await contract.methods.auctionInstanceCount().call()

        for (var i = 1; i <= auctionInstanceCount; i++) {
            const auctionInstance = await contract.methods.auctionInstances(i).call()
            setAuctionInstances((auctionInstances) => [...auctionInstances, auctionInstance])
        }
    }

    function createAuctionInstance(name, startingPrice) {
        contract.methods.createAuctionInstance(name, startingPrice)
            .send({ from: account })
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
                                                <ListItemButton>
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
                        </div> : null}

                    </Toolbar>
                </React.Fragment>

                <Toolbar></Toolbar>
                <main>
                    {account != null? <div>
                    <Grid container spacing={4} sx={{ height: 300 }}>
                        {featuredPosts.map((post) => (
                            <FeaturedPost key={post.title} post={post} />
                        ))}
                    </Grid>
                    <Grid sx={{mb:10}}></Grid>
                    </div> :null}

                    <Grid container spacing={5} >
                        <Main title="전체 상품 보기" />

                    </Grid>
                </main>
            </Container>
        </ThemeProvider>
    );
}


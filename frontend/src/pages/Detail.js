import * as React from 'react';
import Web3 from 'web3'
import { AUCTION_ABI, AUCTION_ADDRESS } from '../config'

import cx from 'clsx';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router-dom';
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
  bidButton:{
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


  const rows = [
    { id: 1, bid: '5', bidTime: '2022.10.7 10:55', Bidder: 35 },
    { id: 2, bid: '8', bidTime: '2022.10.7 10:55', Bidder: 42 },
    { id: 3, bid: '12', bidTime: '2022.10.7 10:55', Bidder: 45 },
    { id: 4, bid: '45', bidTime: '2022.10.7 10:55', Bidder: 16 },
    { id: 5, bid: '65', bidTime: '2022.10.7 10:55', Bidder: null },
    { id: 6, bid: '23', bidTime: '2022.10.7 10:55', Bidder: 150 },
    { id: 7, bid: '0.23', bidTime: '2022.10.7 10:55', Bidder: 44 },
    { id: 8, bid: '1', bidTime: '2022.10.7 10:55', Bidder: 36 },
    { id: 9, bid: '5', bidTime: '2022.10.7 10:55', Bidder: 65 },
  ];
export default function Detail(props){
    const {detailInfo} = props;
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

    
    const [mainDetail,setmainDetail] = React.useState(true);

    const detailMainClick = (event) => {
        setmainDetail(!mainDetail);    
    };

    return(
        <>
    <Container maxWidth="lg">
<React.Fragment>

<Toolbar label={'margin = "normal"'} sx={{marginBottom:5}}>

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


      {mainDetail? <Card className={cx(styles.root, shadowStyles.root)} sx={{marginTop:50,}}> <CardMedia
        className={styles.media}
        image={
          'https://img.seadn.io/files/37c1876a5cd53d9c8d0914f73a533018.png?fit=max&w=1000'
        }
      />
      <CardContent>
      <Grid container spacing={3}>
        <Grid item xs={12}>
        <TextInfoContent
          classes={contentStyles}
          overline={'#경매품 번호'}
          heading={'경매품 이름'}
          
        />
        </Grid>
        
        <Grid item xs={12} sm={5}>
        <TextInfoContent
          classes={contentStyles}
          overline={'현재가'}
          heading={'경매품 가격'}
          
        />
        </Grid>
        <Grid item xs={12} sm={5}>
        <TextInfoContent
          classes={contentStyles}
          overline={'경매 종료 일자'}
          heading={'경매 종료일'}
          
        />
        </Grid>
        <Grid item xs={12} sm={2}>
            
            <IconButton onClick={detailMainClick}><NavigateNextIcon fontSize="large"/></IconButton>
        </Grid>
        <Grid item xs={12} sm={8}>
        <Row>
        <TextField id="standard-basic" label="응찰가 입력 (ETH)" className={styles.textField} />
        <IconButton><SendIcon fontSize="medium"/></IconButton>
        </Row>  
        </Grid>
        
        
      </Grid>
        
      </CardContent> </Card>:
      
      <Card  sx={{marginTop:50,}}> 
      

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
      
      <IconButton onClick={detailMainClick}><NavigateBeforeIcon fontSize="large"/></IconButton>
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
      highest_bidder : PropTypes.string.isRequired,
      bidder_list: PropTypes.array.isRequired,
    }).isRequired,
  };
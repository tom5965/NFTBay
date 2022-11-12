// import * as React from 'react';
// import PropTypes from 'prop-types';
// import Toolbar from '@mui/material/Toolbar';
// import Button from '@mui/material/Button';
// import IconButton from '@mui/material/IconButton';
// import AccountCircleIcon from "@material-ui/icons/AccountCircle";
// import LogoutIcon from '@mui/icons-material/Logout';
// import DarkModeIcon from '@mui/icons-material/DarkMode';
// import AddBusinessIcon from '@mui/icons-material/AddBusiness';


// import Typography from '@mui/material/Typography';
// import SearchIcon from '@mui/icons-material/Search';
// import Paper from '@mui/material/Paper';
// import InputBase from '@mui/material/InputBase';
// import Divider from '@mui/material/Divider';
// import Logoicon from '../img/Logo_trans.png';
// import { useNavigate } from 'react-router-dom';

// import Box from '@mui/material/Box';
// import Popper from '@mui/material/Popper';
// import { makeStyles } from "@material-ui/core/styles";

// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';

// import Switch from '@mui/material/Switch';

// const isDark = false;
// function Header(props) {
//   const { sections, title } = props;

//   //로그인
//   const [isLogin, setLogin] = React.useState(false);

//   const onLogin = (e) =>{
//     setLogin(!isLogin);
//   };

//   const navigate = useNavigate();

//   //LOGO 클릭 시 main 화면으로 이동
//   const toMain = () => {
//     navigate("/");
//   }

//   //유저 아이콘 클릭시
//   const [anchorEl, setAnchorEl] = React.useState(null);

//   const handleClick = (event) => {
//     setAnchorEl(anchorEl ? null : event.currentTarget);
//   };

//   const open = Boolean(anchorEl);
//   const id = open ? 'simple-popper' : undefined;

//   //css

//   const useStyles = makeStyles({
//     popper:{
//       borderRadius: "7px",
//       boxShadow: "3px 3px 3px grey",
//     },
  
//   });

  
//   //darkmode switch
//   // const label = { inputProps: { 'aria-label': 'Switch demo' } };

//   // const handleChange = (event) => {
//   //   if(isDark == false) isDark = true;
//   //   else isDark = false;
//   // };


//   const classes = useStyles();

//   return (
//     <React.Fragment>

//       <Toolbar label={'margin = "normal"'}>

//         <Button onClick={toMain}>
//           <img src={Logoicon}></img>

//         </Button>
//         <Typography
//           component="h2"
//           variant="h5"
//           color="inherit"
//           align="center"
//           noWrap
//           sx={{ flex: 1 }}
//         >
//           <Paper
//             component="form"
//             sx={{ display: 'flex', alignItems: 'center', width: 1000 }}
//           >
//             <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
//               <SearchIcon />
//             </IconButton>
//             <InputBase
//               sx={{ ml: 1, flex: 1 }}
//               placeholder="어떤 컬렉션을 찾으세요?"
//               inputProps={{ 'aria-label': 'search google maps' }}
//               fullWidth
//             />

//             <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />

//           </Paper>

//         </Typography>

        
//         {isLogin? null : <div><Button color="secondary" variant="outlined"
//         onClick={onLogin}> 지갑 연결하기</Button>
//         </div>}
//         {isLogin?<div>
//         <IconButton onClick={handleClick}>
//           <AccountCircleIcon fontSize="large"></AccountCircleIcon>
          
//         </IconButton>
        
        
//         <Popper id={id} open={open} anchorEl={anchorEl}>
//         <Box sx={{ width: '100%', maxWidth: 500, bgcolor: 'background.paper' }}>
//       <nav aria-label="main mailbox folders">
//         <List>
//           <ListItem disablePadding>
//             <ListItemButton>
//               <ListItemIcon>
//                 <AddBusinessIcon />
//               </ListItemIcon>
//               <ListItemText primary="상품 등록" />
//             </ListItemButton>
//           </ListItem>

//           {/* <ListItem disablePadding>
//             <ListItemButton>
//               <ListItemIcon>
//                 <DarkModeIcon/>
//               </ListItemIcon>
//               <ListItemText primary="다크 모드" />
//               <Switch checked={!isDark}
//       onChange={handleChange} {...label}/>
//             </ListItemButton>
//           </ListItem> */}

//           <ListItem disablePadding>
//             <ListItemButton onClick={onLogin}>
//               <ListItemIcon>
//                 <LogoutIcon/>
//               </ListItemIcon>
//               <ListItemText primary="로그 아웃" />
//             </ListItemButton>
//           </ListItem>
//         </List>
//       </nav>
//     </Box>
        
//         </Popper>
//         </div> : null}
        
//       </Toolbar>
//     </React.Fragment>
//   );
// }

// Header.propTypes = {
//   sections: PropTypes.arrayOf(
//     PropTypes.shape({
//       title: PropTypes.string.isRequired,
//       url: PropTypes.string.isRequired,
//     }),
//   ).isRequired,
//   title: PropTypes.string.isRequired,
// };

// export {isDark};
// export default Header;
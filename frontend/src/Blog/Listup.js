import React from 'react';
import Web3 from 'web3'
import { AUCTION_ABI, AUCTION_ADDRESS, TOKENURIABI } from '../config'

import NoSsr from '@material-ui/core/NoSsr';
import GoogleFontLoader from 'react-google-font-loader';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import PropTypes from 'prop-types';
import { useNavigate, useNavigation, useParams, NavLink, createSearchParams } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Detail from '../pages/Detail';
import { IpfsImage } from 'react-ipfs-image';

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
    listnum: {
        padding: '0.125rem 0.125rem',
        marginTop: 7,
        fontSize: '1.3rem',
        fontWeight: '500',
    },
}));

let num = 0;



const ListItem = ({ tokenId, tokenAddress, highestBid, auctionEndTime,id,account }) => {

    
    const commonProps = {
        blur: '12px',
        radius: 16,
        size: 48,
        opacity: 0.6,
    };
    
    
    
    async function loadAuctionInstances(contract, tokenAddress, tokenId) {

        const web3 = new Web3(Web3.givenProvider || 'https://localhost:7545')

        // setAuctionInstances((auctionInstances) => [...auctionInstances, auctionInstance])
        const nftContract = new web3.eth.Contract(TOKENURIABI, tokenAddress);
        const result = await nftContract.methods.tokenURI(tokenId).call();

        
        
        const ipfsAddress = result.replace("ipfs://", "https://ipfs.io/ipfs/");
        // return ipfsAddress;

        return await new Promise((resolve) =>{resolve(ipfsAddress.image)});
    //    console.log(ipfsAddress.image);
       
        // fetch(ipfsAddress)
        //     .then(response => response.json())
        //     .then(data => {
        //         const imageIpfsAddress = data.image.replace("ipfs://", "https://ipfs.io/ipfs/");
        //         fetch(imageIpfsAddress)
        //             .then(imageData => {
        //                 var src = imageData.url;
        //                 return src;
        //                 // return new Promise(resolve=>{
        //                 //     setTimeout(()=>{
        //                 //         resolve(src);
        //                 //         console.log(src);
        //                 //     },2000);
        //                 // })
        //             });
        //     });

    }

    var getImage = async function(auctionContract, tokenAddress, tokenId){
        var result = await loadAuctionInstances(auctionContract, tokenAddress, tokenId);
        //console.log(result);
    }
    //let src = ''
    let src = 'ipfs.io/ipfs/QmZ8EAHYWKoGyk5PuJxAts8ZmzhraPusD5MtApp79hFUbp'
    const avatarStyles = useGrowAvatarStyles({ src, ...commonProps });
    const navigate = useNavigate();


    const styles = useStyles();

    const web3 = new Web3(Web3.givenProvider || 'https://localhost:7545')
    const auctionContract = new web3.eth.Contract(AUCTION_ABI, AUCTION_ADDRESS);

    loadAuctionInstances(auctionContract, tokenAddress, tokenId).then((result)=>{console.log(result)});
    console.log(src);
    // .then(
    //     result => {
    //         src = result;
    //     }
    // )

    // console.log(src);
    num += 1;
    return (
        <Row mt={2}>
            <Item sx={{ ml: -5 }}>
                <Button className={styles.listnum}>{num}</Button>
            </Item>
            <Item>
                <div className={avatarStyles.root} >
                {/* <IpfsImage hash={src}></IpfsImage> */}
                    {/* <Avatar  src={src} /> */}
                    <Avatar sx={{ ml: 10, mr: 10 }}>
                    
                    </Avatar>
                    
                </div>
            </Item>

            <Info useStyles={useMusicInfoStyles} minWidth={0} position={'middle'}>
                <InfoTitle> <h3># {tokenId}</h3></InfoTitle>
            </Info>
            <Info useStyles={useMusicInfoStyles} position={'right'}>
                <InfoSubtitle> <h4>{highestBid} WEI</h4></InfoSubtitle>
            </Info>
            <Info>

            </Info>
            <Item position={'right'} sx={{ paddingTop: 20 }}>
                <Button className={styles.btn} variant={'outlined'} onClick={() => {
                    //const tmpString = '?id='+tokenId+'&address='+tokenAddress;
                    navigate({
                        pathname: '/Detail',
                        search: createSearchParams({
                            tokenId:  tokenId ,
                            tokenAddress: tokenAddress,
                            highestBid : highestBid,
                            auctionEndTime : auctionEndTime,
                            auctionId: id,
                            account : account,
                        }).toString()
                    });
                }}>
                    DETAIL
                </Button>

            </Item>
        </Row>
    );

};


function Listup(props, { navigation }) {
    const commonProps = {
        // blur: '12px',
        radius: 16,
        size: 48,
        opacity: 0.6,
    };


    const { list } = props;
    const {account} = props;

    const src =
        'https://cdn1.vectorstock.com/i/1000x1000/85/40/music-abstract-poster-cover-1980s-style-background-vector-11958540.jpg';
    const avatarStyles = useGrowAvatarStyles({ src, ...commonProps });

    //   for(var i = 0; i<list.length;i++){
    //     let tokenAddress = list[i].tokenAddress;
    //     let tokenId = list[i].tokenId;
    //     let bid = list[i].highestBid;


    //   }


    const styles = useStyles();
    const navigate = useNavigate();

    const params = useParams();
    return (
        <>
            <NoSsr>
                <GoogleFontLoader fonts={[{ font: 'Questrial' }]} />
            </NoSsr>
            <Column gap={2} width={'80%'}>

                {(list).map(({ tokenId, tokenAddress, highestBid,auctionEndTime,id }) => (
                    <ListItem key={tokenId} tokenId={tokenId} tokenAddress={tokenAddress} highestBid={highestBid} auctionEndTime = {auctionEndTime} id={id} account = {account}/>

                ))}


            </Column>
        </>
    );
}
export default Listup;
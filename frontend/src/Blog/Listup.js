import React from 'react';
import Web3 from 'web3'
import { AUCTION_ABI, AUCTION_ADDRESS, ERC721_ABI } from '../config'

import NoSsr from '@material-ui/core/NoSsr';
import GoogleFontLoader from 'react-google-font-loader';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import PropTypes from 'prop-types';
import { useNavigate, useNavigation, useParams, NavLink, createSearchParams } from 'react-router-dom';
import { useAsync, Async, createInstance } from 'react-async';

import Button from '@material-ui/core/Button';
import Detail from '../pages/Detail';
import { IpfsImage } from 'react-ipfs-image';
import MyList from '../pages/MyList';

import Container from '@mui/material/Container';
import { Column, Row, Item } from '@mui-treasury/components/flex';
import {
    Info,
    InfoTitle,
    InfoSubtitle,
    InfoCaption,
} from '@mui-treasury/components/info';
import { useGrowAvatarStyles } from '@mui-treasury/styles/avatar/grow';
import { useMusicInfoStyles } from '@mui-treasury/styles/info/music';
import { resolve } from 'path';
import SelectInput from '@material-ui/core/Select/SelectInput';

import wait from "waait";



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


let num = 0;

let data = []
let name = []

let count = 0;

const web3 = new Web3(Web3.givenProvider || 'https://localhost:7545')
const auctionContract = new web3.eth.Contract(AUCTION_ABI, AUCTION_ADDRESS)


const ListItem = ({ tokenId, tokenAddress, highestBid, auctionEndTime, id, account }) => {
    
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


                    <Avatar sx={{ ml: 10, mr: 10, display: 'table' }} src={data[num - 1]}>

                    </Avatar>


                </div>
            </Item>

            <Info useStyles={useMusicInfoStyles} minWidth={0} position={'middle'}>
                <InfoTitle> <h3># {tokenId} </h3> </InfoTitle>
                {/* <h4>{name[num-1]}</h4> */}
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



async function loading() {
    const auctionInstanceCount = await auctionContract.methods.auctionInstanceCount().call();
    count = auctionInstanceCount;

    for (var i = 0; i < auctionInstanceCount; i++) {
        const auctionInstance = await auctionContract.methods.getAuctionInstance(i).call();
        const nftContract = new web3.eth.Contract(ERC721_ABI, auctionInstance.tokenAddress);
        await new Promise((resolve, reject) => setTimeout(resolve, 1000));
        const result = await nftContract.methods.tokenURI(auctionInstance.tokenId).call();

        const ipfsAddress = await result.replace("ipfs://", "https://ipfs.io/ipfs/");

        const response = await fetch(ipfsAddress);
        const res_json = await response.json();

        name.push(res_json.name);

        const imageIpfsAddress = await res_json.image.replace("ipfs://", "https://ipfs.io/ipfs/");

        const imageData = await fetch(imageIpfsAddress);
        const _img = await imageData.url;
        data.push(_img);

    }
}

const AsyncPlayer2 = createInstance({ promiseFn: loading }, "AsyncPlayer2");


function Listup(props, { navigation }) {
    num = 0;

    const commonProps = {
        // blur: '12px',
        radius: 16,
        size: 48,
        opacity: 0.6,
    };


    const { list } = props;
    const { account } = props;

    const src =
        'https://cdn1.vectorstock.com/i/1000x1000/85/40/music-abstract-poster-cover-1980s-style-background-vector-11958540.jpg';
    const avatarStyles = useGrowAvatarStyles({ src, ...commonProps });

    const styles = useStyles();
    const navigate = useNavigate();

    const params = useParams();
    return (
        <>
            <NoSsr>
                <GoogleFontLoader fonts={[{ font: 'Questrial' }]} />
            </NoSsr>
            <Column gap={2} width={'80%'}>

                <AsyncPlayer2>
                    <AsyncPlayer2.Fulfilled>
                        {(list).map(({ tokenId, tokenAddress, highestBid, auctionEndTime, id }) => (
                            <ListItem key={tokenId} tokenId={tokenId} tokenAddress={tokenAddress} highestBid={highestBid} auctionEndTime={auctionEndTime} id={id} account={account} />

                        ))}
                    </AsyncPlayer2.Fulfilled>
                </AsyncPlayer2>
            </Column>
        </>
    );
}
export default Listup;
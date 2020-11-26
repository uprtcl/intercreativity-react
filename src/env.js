// const peerPath = `/dns4/localhost/tcp/4003/ws/p2p`;
// const peerId = 'QmWy2HpZrAacU5j8gFArwnkhyo4acxGseq3gEiFzK9cTba';
// const env = {
//   pinner: {
//     url: 'http://localhost:3100',
//     Swarm: [],
//     Bootstrap: [`${peerPath}/${peerId}`],
//     peerMultiaddr: `${peerPath}/${peerId}`,
//   },
//   ethers: {
//     apiKeys: {
//       etherscan: '6H4I43M46DJ4IJ9KKR8SFF1MF2TMUQTS2F',
//       infura: '73e0929fc849451dae4662585aea9a7b',
//     },
//     provider: '',
//   },
// };

const peerPath = `/dns4/pinner.intercreativity.io/tcp/4003/wss/p2p`;
const peerId = 'QmVD8LC6vjAHaDgsLySc86BVbnb256LuRZqsWtK5toABsc';

const env = {
  entry: './src/index.eth.orbitdb.js',
  officialRemote: 'eth',
  pinner: {
    url: 'https://apps.intercreativity.io:3000',
    Swarm: [],
    Bootstrap: [`${peerPath}/${peerId}`],
    peerMultiaddr: `${peerPath}/${peerId}`,
  },
  ethers: {
    apiKeys: {
      etherscan: '6H4I43M46DJ4IJ9KKR8SFF1MF2TMUQTS2F',
      infura: '73e0929fc849451dae4662585aea9a7b',
    },
    provider: 'https://xdai.poanetwork.dev',
  },
};

module.exports = {
  env,
};

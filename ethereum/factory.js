import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0x9B0d475D6cb63D03DD9C06e56988413e3D4C2d3c'
);

export default instance;

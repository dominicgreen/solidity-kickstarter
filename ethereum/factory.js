import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0xB771Fe0Fa922FF09a9b1c5F273027e78411BEA34'
);

export default instance;

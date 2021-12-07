import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0xA757d91095c55d478c893290c3C9045CBaebe54D'
);

export default instance;

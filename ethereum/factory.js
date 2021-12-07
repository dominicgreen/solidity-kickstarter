import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0x3E8707c9FA8c859D94BC8A8e810df4c7cBBEaFF3'
);

export default instance;

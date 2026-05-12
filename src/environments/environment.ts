const dev_url: string = "https://usstaging.ivisecurity.com";
// const dev_url: string = "https://preprod.ivisecurity.com";
const local_url: string = 'http://localhost';


export const environment = {
  production: false,

  // adsAndInventoryUrl: `${dev_url}:8080`,
  // metadataUrl: `${dev_url}:8844/metadata`,
  // authUrl: `${dev_url}:8922`,
  // sitesUrl: `${dev_url}:3004/vipsites`,
  // role:`${dev_url}:8922`,
  // sensorUrl:`${dev_url}:8947`,
  // faqUrl: `${dev_url}:8928`,
  // genericUrl: `${dev_url}:8925/generic`




  // authUrl: `${dev_url}/userDetails`,
  // sitesUrl: `${dev_url}/vipsites`,
  // metadataUrl: `${dev_url}/metadata`,
  // adsUrl: `${dev_url}/proximityAdsMain`,
  // rulesUrl: `${dev_url}/proximityAdsRules `,
  // sensorUrl:`${dev_url}/sensors`,
  // faqUrl: `${dev_url}/faq`,
  // inventoryUrl: `${dev_url}/inventory`,
  // genericUrl: `${dev_url}/supportRequests`,
  // eventsData: `${dev_url}/events_data`





    authUrl: `${local_url}:3002/userDetails`,
  sitesUrl: `${local_url}:3004/vipsites`,
  metadataUrl: `${local_url}:3005/metadata`,
  adsUrl: `${local_url}:8854/proximityAdsMain`,
  rulesUrl: `${local_url}:8856/proximityAdsRules `,
  sensorUrl:`${local_url}:8859/sensors`,
  faqUrl: `${local_url}:8866/faq`,
  inventoryUrl: `${local_url}:6465/inventory`,
  genericUrl: `${local_url}:3003/supportRequests`,
  eventsData: `${local_url}:3009/events_data`
};

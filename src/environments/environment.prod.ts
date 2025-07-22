// const prod_url: string = "http://rsmgmt.ivisecurity.com";
const prod_url: string = "https://prod.ivisecurity.com";

export const environment = {
  production: true,

  // authUrl: `${prod_url}:8543/userDetails`,
  // metadataUrl: `${prod_url}:8844/metadata`,
  // sitesUrl: `${prod_url}:8943/vipsites`,
  // faqUrl: `${prod_url}:8928/faq`,
  // sensorUrl:`${prod_url}:8947/sensors`,
  // genericUrl: `${prod_url}:8925/generic`,
  // adsUrl: `${prod_url}:8080/proximityAdsMain`,
  // inventoryUrl: `${prod_url}:8080/inventory`,

  authUrl: `${prod_url}/userDetails`,
  sitesUrl: `${prod_url}/vipsites`,
  metadataUrl: `${prod_url}/metadata`,
  adsUrl: `${prod_url}/proximityAdsMain`,
  rulesUrl: `${prod_url}/proximityAdsRules `,
  sensorUrl:`${prod_url}/sensors`,
  faqUrl: `${prod_url}/faq`,
  inventoryUrl: `${prod_url}/inventory`,
  genericUrl: `${prod_url}/supportRequests`
};

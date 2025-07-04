const prod_url: string = "http://rsmgmt.ivisecurity.com";

export const environment = {
  production: true,

  // authUrl: `${prod_url}:8543`,
  // adsAndInventoryUrl: `${prod_url}:8080`,
  // metadataUrl: `${prod_url}:8844/metadata`,
  // baseUrl: `${prod_url}:8943`,
  // faqUrl: `${prod_url}:8928`,
  // sensorUrl:`${prod_url}:8947`,
  // genericUrl: `${prod_url}:8925/generic`,

  authUrl: `${prod_url}/userDetails`,
  sitesUrl: `${prod_url}/vipsites`,
  metadataUrl: `${prod_url}/metadata`,
  adsUrl: `${prod_url}/proximityAdsMain`,
  rulesUrl: `${prod_url}/proximityAdsRules `,
  sensorUrl:`${prod_url}/sensors`,
  faqUrl: `${prod_url}/faq`,
  inventoryUrl: `${prod_url}/inventory`,
  genericUrl: `${prod_url}/generic`
};

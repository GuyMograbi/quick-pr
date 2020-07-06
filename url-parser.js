exports.parse = (url) => {
  //  assume template of http(s)://<vendor>.com/<owner>/<repo> 'https://github.com/Hippo-Analytics-Inc/hippo'
  const [all, vendor, owner, repo] = url.match(/https?:\/\/(.*).com\/(.*)\/(.*)/);
  return {all, vendor, owner, repo};
};

exports.parse = (url) => {
  //  assume template of http(s)://<vendor>.com/<owner>/<repo> 'https://github.com/company-name/repository-name'
  const [all, vendor, owner, repo] = url.match(/https?:\/\/(.*).com\/(.*)\/(.*)/);
  return { all, vendor, owner, repo };
};

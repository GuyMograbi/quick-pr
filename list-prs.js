const Client = require('./client');
const input = require('./input').get();

const pad = (str, length) => {
  const blanks = '                               ';
  const value = str.slice(0, length);
  return `${value}${blanks.slice(0, length - value.length)}`;
}

exports.run = async (args) => {
  const client = new Client(input.credentials);
  console.log('✅ list all');
  const prs = await client.pullRequests.get();
  const prsObj = JSON.parse(prs);
  const output = prsObj.values.map(v => {
    const normalizedTitle = pad(v.title.replace('\n',' '), 40);
    const normalizedSource = pad(v.source.branch.name, 40);
    const normalizedDest = pad(v.destination.branch.name, 20);
    return `${normalizedTitle}\t[${normalizedSource}] ==> [${normalizedDest}] [${v.links.html.href}]`
  }).join('\n');
  console.log(output);
  // console.log(prsObj.values[0].links);
  // const prSample = prsObj.values.find(v => v.id === );
  // console.log('got response', JSON.stringify(prSample, {}, 2));
  // console.log('got response', prSample.title);
  // console.log('got response', prSample.author.nickname);
  // console.log('got response', prSample.source.branch.name);
  // console.log('got response', prSample.destination.branch.name);
  // console.log('got response', prSample.links.html.href);

}

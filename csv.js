require('dotenv').config()
const fs = require("graceful-fs");
const csv = require("csvtojson");
const YAML = require("json-to-pretty-yaml");
const mkdirp = require("mkdirp");
const slugify = require("slugify");

const setHugoConfig = (region) => {
    let config = {
        title: `GetWell ${region}`,
        baseURL: `www.getwell.nyc/${slugify(region)}`,
        taxonomies: {
            city: 'cities'
        }
    }
    fs.writeFile(`config.yaml`, YAML.stringify(config), error => {
        console.log(error)
    })
}

let region = process.env.REGION
let csvFile
if(region == 'NY') {
    csvFile = "ny-doctors.csv";
    setHugoConfig(region)
}
else if (region == 'GA') {
    csvFile = 'ga-doctors.csv';
    setHugoConfig(region)
}



const createMdFile = (obj, id) => {
  console.log(`creating ${id}.md`);
  let fileContent = `---\n${YAML.stringify(obj)}---`;
  fs.writeFile(`./content/providers/${id}.md`, fileContent, error => {
    if (error) {
      console.log(error);
    }
  });
};

csv()
  .fromFile(csvFile)
  .then(json => {
    mkdirp.sync('./content/providers/', err => {
        if (err) {
            console.log(err)
        } else {
            console.log(`directory created`)
        }
    })
    for (let i = 0; i < json.length; i++) {
      createMdFile(json[i], i);
    }
  })
  .catch(err => {
    console.log(err);
  });

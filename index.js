const fs = require('fs');
const axios = require('axios');
const mkdirp = require('mkdirp');
const YAML = require('json-to-pretty-yaml');

const getWPListings = (pageNum) => {
    axios.get(`https://www.getwell.nyc/wp-json/wp/v2/job-listings?page=${pageNum}`)
        .then((res) => {
            if(res.status == 200){
                for(let item of res.data){
                    createMarkdownFile(item)
                }
            }
        })
        .finally(()=>{
            console.log(`page ${pageNum} complete\n`)
        })
}

const createMarkdownFile = (obj) => {
    let fileContent = `---\n${YAML.stringify(obj)}---\n`
    fs.writeFile(`./content/providers/${obj.id}.md`, fileContent, error => {
        if (error) {
            console.log(error)
        }
    })
}

axios.get('https://www.getwell.nyc/wp-json/wp/v2/job-listings')
    .then((res) => {
        let totalPages = res.headers['x-wp-totalpages'];
        for(let i = 40; i < 50; i++){
            let page = i + 1
            console.log(`pulling page ${i + 1}`)
            getWPListings(page)
        }
    })
    .catch((err) => {
        console.log(err)
    })
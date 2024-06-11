import jsdom from 'jsdom'
import fs from 'fs'

const URLS = [
    {
        url: "https://news.wisc.edu/raw-milk-containing-h5n1-can-infect-mice-while-lab-based-heat-treatments-greatly-reduce-the-virus/",
        img: "cows.jpg",
        tags: ["agriculture", "research"]
    },
    {
        url: "https://news.wisc.edu/abandoned-farmlands-could-play-a-role-in-fighting-climate-change-a-new-study-shows-exactly-where-they-are/",
        img: "farmlands.jpg",
        tags: ["agriculture", "research"]
    },
    {
        url: "https://news.wisc.edu/uw-madison-engineers-mark-3d-printing-milestone-in-race-to-in-space-manufacturing/",
        img: "3d.jpg",
        tags: ["research"]
    },
    {
        url: "https://news.wisc.edu/camp-randall-commencement-2024-golden-day-golden-speaker-golden-memories/",
        img: "grad.jpg",
        tags: ["graduation", "social"]
    },
    {
        url: "https://news.wisc.edu/commencement-2024-meet-some-of-this-springs-notable-graduates/",
        img: "notables.jpg",
        tags: ["graduation", "social", "outreach"]
    },
    {
        url: "https://news.wisc.edu/bringing-delight-by-investigating-a-no-melt-ice-cream/",
        img: "icecream.jpg",
        tags: ["research", "social"]
    },
    {
        url: "https://news.wisc.edu/small-cool-and-sulfurous-exoplanet-may-help-write-recipe-for-planetary-formation/",
        img: "space.jpg",
        tags: ["research"]
    },
    {
        url: "https://news.wisc.edu/uw-madison-scientists-develop-most-sensitive-way-to-observe-single-molecules/",
        img: "molecules.jpg",
        tags: ["research"]
    },
    {
        url: "https://news.wisc.edu/on-the-road-again-uw-175-tour-heads-to-fox-valley/",
        img: "foxvalley.jpg",
        tags: ["social", "outreach"]
    },
    {
        url: "https://news.wisc.edu/qa-with-prof-steffi-diem-a-uw-madison-fusion-scientist-and-2024-u-s-science-envoy/",
        img: "diem.jpg",
        tags: ["research"]
    },
    {
        url: "https://news.wisc.edu/forbes-names-uw-madison-as-new-ivy/",
        img: "ivy.jpeg",
        tags: ["outreach"]
    },
    {
        url: "https://news.wisc.edu/three-honored-for-innovation-entrepreneurial-excellence/",
        img: "innovation.jpg",
        tags: ["outreach"]
    },
    {
        url: "https://news.wisc.edu/new-tool-provides-researchers-with-improved-understanding-of-stem-cell-aging-in-the-brain/",
        img: "stem.jpg",
        tags: ["research"]
    }
]

const articles = [];

for(const url of URLS) {
    console.log("Processing " + url.url);
    const resp = await fetch(url.url);
    const data = await resp.text();
    // https://stackoverflow.com/questions/11398419/trying-to-use-the-domparser-with-node-js
    const dom = new jsdom.JSDOM(data);
    const story = dom.window.document.getElementsByClassName("story-body")[0].textContent
        .replace(/(\r?\n)+/g, "\n")
        .replace(/Share via .*/g, "")
        .replace(/Photo by .*/g, "")
        .split("\n")
        .map(cleanStr)
        .filter(t => t)
    const title = dom.window.document.getElementsByClassName("story-head")[0].getElementsByTagName("h1")[0].textContent
    const author = dom.window.document.getElementsByClassName("writer")[0]?.textContent.replace(/By /g, "")
    const dt = dom.window.document.getElementsByClassName("date")[0]?.textContent
    await sleep(500 + Math.ceil(500 * Math.random()))
    articles.push({
        title: cleanStr(title),
        body: story,
        posted: dt ?? "unknown",
        url: url.url,
        author: author ?? "unknown",
        img: url.img,
        tags: url.tags
    })
}

fs.writeFileSync("_articles.json", JSON.stringify(articles, null, 2))

// https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function cleanStr(s) {
    return s.trim()
        .replace(/“/g, '"')
        .replace(/”/g, '"')
        .replace(/’/g, '\'')
        .replace(/–/g, "-")
        .replace(/ /g, " ")
}
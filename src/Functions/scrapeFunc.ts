import puppeteer from "puppeteer";

// will return an array of objects
export async function ScrapeWebsite(url: string): Promise<any> {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url);
    console.log(`🤖 Scraping ${url}...`);
    await page.waitForSelector("a");
    const mainBody = await page.$x(`//*[@id="__next"]/main/div/div/div[2]/div`);

    const urlSanitized = url.endsWith("/") ? url.slice(0, -1) : url;




    let data = [];
    if (mainBody.length > 0) {
      for (const child of mainBody) {
        const childData: ChildData = {} as ChildData;

        const link = await child.$eval('a', (el) => el.getAttribute('href'));

        const postlink = urlSanitized + link;

        const imageRaw = await child.$eval('img', (el) => el.getAttribute('src'));

        const imageRawSanitized = imageRaw?.startsWith(" ") ? imageRaw.slice(1) : imageRaw;
        const image = urlSanitized + imageRawSanitized;
        const imageAlt = await child.$eval('img', (el) => el.getAttribute('alt'));
        const imageWidth = await child.$eval('img', (el) => el.getAttribute('width'));
        const imageHeight = await child.$eval('img', (el) => el.getAttribute('height'));

        const imageData = {
          link: image,
          alt: imageAlt,
          width: imageWidth,
          height: imageHeight,
        }

        const date = await child.$eval('time', (el) => el.getAttribute('datetime') || null);
        const title = await child.$eval('div > div:nth-child(2) > div > div > a', el => el.textContent?.trim() || null);
        const author = await child.$eval('div > div:nth-child(2) > div:nth-child(3) > div > div > div', el => el.textContent?.trim() || null);
        const shortDescription = await child.$eval('div > div:nth-of-type(2) > div:nth-of-type(2)', el => el.textContent?.trim() || null);
        const authorProfession = await child.$eval('div > div:nth-of-type(3) > div > div:nth-of-type(2)', el => el.textContent?.trim() || null);

        childData.link = postlink;
        childData.image = imageData;
        childData.date = date;
        childData.title = title;
        childData.author = author;
        childData.short_description = shortDescription;
        childData.authorProfession = authorProfession;

        data.push(childData);

        // access the link and get the full description
        const postPage = await browser.newPage();
        await postPage.goto(postlink);
        console.log(`🤖 Scraping ${postlink}...`);
        await postPage.waitForXPath('//*[@id="__next"]/div/div/div/div[2]/div[1]/div[3]');

        let postSections: string[] = [];

        // Extract individual sections based on the structure and append them to the postSections array
        const subtitles = await postPage.$x("//*[@id='__next']/div/div/div/div[2]/div[1]/div[3]/div[1]");
        const paragraphs = await postPage.$x("//*[@id='__next']/div/div/div/div[2]/div[1]/div[3]/div[1]/following-sibling::div[not(self::ul)]");
        const lists = await postPage.$x("//*[@id='__next']/div/div/div/div[2]/div[1]/div[3]/div[1]/following-sibling::ul");

        for (let subtitle of subtitles) {
          const text = await subtitle.evaluate(el => el.textContent);
          if (text !== null) {
            postSections.push(text);
          }
        }

        for (let paragraph of paragraphs) {
          const text = await paragraph.evaluate(el => el.textContent);
          if (text !== null) {
            postSections.push(text);
          }
        }

        for (let list of lists) {
          const items = await list.$$eval('li', lis => lis.map(li => li.textContent));
          postSections.push(items.join('\n'));
        }

        // Join the sections with "\n" to format the post content
        const postContent = postSections.join("\n\n");

        childData.post_content = postContent.trim();
      }
      return data;
    } else {
      console.log("Main body element not found.");
    }

    await browser.close();
  } catch (err) {
    console.error(err);
  }
}


interface ImageInterface {
  link: string | null;
  alt: string | null;
  width: string | null;
  height: string | null;
}

interface ChildData {
  link: string | null;
  image: ImageInterface | null;
  date: string | null;
  title: string | null;
  short_description: string | null;
  author: string | null;
  authorProfession: string | null;
  post_content: string | null;
}

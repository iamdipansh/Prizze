"use server"
import * as cheerio from "cheerio";
import axios from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";
import https from "https";

export async function scrapeProduct(productUrl: string) {
  if (!productUrl) return;

  const username = 'brd-customer-hl_002b61d9-zone-buylow';
  const password = 'o9oq1t4mmpc1';
  const port = 22225;
  const session_id = (1000000 * Math.random()) | 0;
  const super_proxy = `http://${username}-session-${session_id}:${password}@brd.superproxy.io:${port}`;
  const proxyOptions = `http://${username}-session-${session_id}:${password}@brd.superproxy.io:${port}`;
  const agent = new HttpsProxyAgent(proxyOptions);

  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });

  const options = {
    url: productUrl,
    method: 'GET',
    // httpsAgent: agent,
    httpsAgent: httpsAgent,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    },
    // Disable Axios's default proxy handling as we are using https-proxy-agent
    proxy: false,
    rejectUnauthorized: false,
    // If  need to ignore SSL errors
    validateStatus: function (status: number) {
      return status >= 200 && status < 500; // Reject only if the status code is greater than or equal to 500
    },
  };
  
  try {
    const response = await axios(options);
    const $ = cheerio.load(response.data);
    const title = $('#productTitle').text().trim();
    console.log(title);
  } catch (error: any) {
    throw new Error(`Failed to scrape product: ${error.message} `);
  }
}

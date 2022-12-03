import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { exec } from 'child_process';

(async () => {
  var DIST_FOLDER = './dist';
  var FILE_NAME = 'lvt_omni_pixel';
  var COMPILED_FILE = `${DIST_FOLDER}/${FILE_NAME}.js`;
  var MIN_COMPILED_FILE = `${DIST_FOLDER}/${FILE_NAME}.min.js`;
  var FILES_TO_COMPILE = getFilesToMergeArray();

  var finalContent = mergeFilesContent(FILES_TO_COMPILE);

  if (!existsSync(DIST_FOLDER)) {
    mkdirSync(DIST_FOLDER);
  }
  writeFileSync(COMPILED_FILE, finalContent);

  exec(`minify "${COMPILED_FILE}" > "${MIN_COMPILED_FILE}"`);
})();

function mergeFilesContent(filesArr) {
  var finalContent = '';
  try {
    for (var x = 0; x < filesArr.length; x++) {
      var data = readFileSync(filesArr[x], 'utf8');
      if (data.length > 0) {
        var space = finalContent.length > 0 ? '\n' : '';
        finalContent = finalContent + space + data;
      }
    }
  } catch (e) {
    console.log(`Error while compiling: ${e.message}`);
    finalContent = '';
  }
  return finalContent;
}

function getFilesToMergeArray() {
  var FILES_TO_COMPILE = [
    './src/variables.js',

    // -------------------------------------------------------------------------

    './src/functions/detect_device.js',
    './src/functions/generate_token.js',
    './src/functions/get_current_page.js',
    './src/functions/run_when_ip_is_set.js',

    // -------------------------------------------------------------------------

    './src/libraries/shopify/get_current_collection.js',
    './src/libraries/shopify/get_products_info.js',

    './src/libraries/yampi/get_checkout_info.js',
    './src/libraries/yampi/setup_promotion_events.js',
    './src/libraries/yampi/update_order_maximum_step.js',

    './src/libraries/cookies_data.js',
    './src/libraries/cookies.js',
    './src/libraries/date.js',
    './src/libraries/queries.js',

    // -------------------------------------------------------------------------

    './src/pages/funnel/1_shopify_product.js',
    './src/pages/funnel/2_shopify_cart.js',
    './src/pages/funnel/3_yampi_checkout.js',
    './src/pages/funnel/4_yampi_address.js',
    './src/pages/funnel/5_yampi_payment.js',
    './src/pages/funnel/6_yampi_purchase.js',

    './src/pages/shopify_article.js',
    './src/pages/shopify_blog.js',
    './src/pages/shopify_collection.js',
    './src/pages/shopify_collections.js',
    './src/pages/shopify_contact.js',
    './src/pages/shopify_home.js',
    './src/pages/shopify_products.js',
    './src/pages/shopify_search.js',
    './src/pages/shopify_tracking.js',

    // -------------------------------------------------------------------------

    './src/pixels/clarity.js',
    './src/pixels/facebook.js',
    './src/pixels/tiktok.js',
    './src/pixels/google_A4.js',
    './src/pixels/google_ADS.js',
    './src/pixels/google_ALL.js',
    './src/pixels/google_UA.js',
    './src/pixels/instigare.js',

    // -------------------------------------------------------------------------

    './src/page_events.js',
    './src/index.js'
  ];

  return FILES_TO_COMPILE;
}

<h1 align="center">
    Shopify store omni pixel
</h1>

<p align="center">
  <img alt="Repository size" src="https://img.shields.io/github/repo-size/lucasvtiradentes/shopify-store-omni-pixel.svg">
  <a href="https://github.com/lucasvtiradentes/shopify-store-omni-pixel/commits/master">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/lucasvtiradentes/shopify-store-omni-pixel.svg">
  </a>
  <a href="https://github.com/lucasvtiradentes/shopify-store-omni-pixel/issues">
    <img alt="Repository issues" src="https://img.shields.io/github/issues/lucasvtiradentes/shopify-store-omni-pixel.svg">
  </a>
  <a href="https://www.npmjs.com/package/shopify-store-omni-pixel"><img src="https://img.shields.io/npm/v/shopify-store-omni-pixel.svg?style=flat" alt="npm version"></a>
</p>

<p align="center">
  <a href="#information_source-description">Description</a>
  &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;<a href="#information_source-features">Features</a>
  &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#information_source-technologies">Technologies</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#information_source-how-to-edit-it">How to edit it?</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;<a href="#information_source-how-to-use-it">How to use it?</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;  <a href="#information_source-how-to-publish-it">How to publish it?</a>
</p>

## :information_source: Description

This is a tool for saving user behavior information into cookies and send events to some ads and analytics platforms, like GA, Facebook and Tiktok.

This tool is an must-have for [shopify stores](https://www.shopify.com/) who uses [yampi](https://www.yampi.com.br/) as payment checkout solution, since it saves a lot of effort in proper setup analytics tracking in all ads platforms and yampi don't track user checkout progress correctly.

To unlock its full potential, consider using also [lvt-analytics-setup](https://github.com/lucasvtiradentes/lvt-analytics-setup).

## :information_source: Features

- [x] Track user information across all ecommerce funnel and store it at cookies;
- [x] Sends user events to regular analytics pixel platforms, like google analytics, facebook, tiktok, and others;
- [x] Saves user visits in a google spreadsheets sheet;
- [x] Increases store speed by handling all the pixels with an timeout delay;
- [x] Make the analytics tracking setting fast for developers;
- [x] Run the latest version of the code in your stores as soon as you update the code in your github;
- [x] Supported analytics platforms events: [Google analytics 3](https://analytics.google.com/), [Google analytics 4](https://analytics.google.com/), [Microsoft clarity](https://clarity.microsoft.com/) and [lvt analytics](https://github.com/lucasvtiradentes/lvt-analytics-setup).
- [x] Supported ads platforms events: [Google ads](https://ads.google.com/), [Facebook](https://facebook.com/), [Tiktok ads](https://ads.tiktok.com/help/article?aid=10028).

## :information_source: Technologies

This project uses the following technologies:

<div align="center" style="text-align: center;">
  <table>
    <tr>
      <th>Scope</th>
      <th>Technologies</th>
    </tr>
    <tr>
      <td>engine</td>
      <td align="center">
        <a target="_blank" href="https://nodejs.org"><img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white"></a>
      </td>
    </tr>
    <tr>
      <td>main</td>
      <td align="center">
        <a target="_blank" href="https://developer.mozilla.org/pt-BR/docs/Web/JavaScript"><img src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E"></a>
      </td>
    </tr>
    <tr>
      <td>dev tools</td>
      <td align="center">
        <a target="_blank" href="https://editorconfig.org/"><img src="https://img.shields.io/badge/editorconfig-gray?style=for-the-badge&logo=editorconfig&logoColor=white"></a>
        <a target="_blank" href="https://prettier.io/"><img src="https://img.shields.io/badge/prettier-black?style=for-the-badge&logo=prettier&logoColor=white"></a>
        <br>
        <a target="_blank" href="https://github.com/conventional-changelog/commitlint"><img src="https://img.shields.io/badge/commitlint-red?style=for-the-badge&logo=commitlint&logoColor=white"></a>
        <a target="_blank" href="https://github.com/commitizen/cz-cli"><img src="https://img.shields.io/badge/commitizen-pink?style=for-the-badge&logo=conventionalcommits&logoColor=white"></a>
        <a target="_blank" href="https://github.com/typicode/husky"><img src="https://img.shields.io/badge/🐶husky-yellow?style=for-the-badge&logo=husky&logoColor=white"></a>
      </td>
    </tr>
  </table>
</div>

## :information_source: How to edit it

To clone this repository and make changes in the source code, you'll need [Git](https://git-scm.com) and [Nodejs](https://nodejs.org/en/).

```bash
# Clone this repository
$ git clone https://github.com/lucasvtiradentes/shopify-store-omni-pixel

# Go into the repository
$ cd shopify-store-omni-pixel

# Compile the source code into a dist version
$ npm run build

# Run the production executable code
$ npm run start
```

As this project uses `husky`, make sure to run the following command after initialize git in the folder: `npx husky install`. Only after this command husky will be able to check commit messages validation.

## :information_source: How to use it

To be able to use this tool, first include the following snippet code (which sets page objects used in the omni pixel source code) before in the `head` section of `theme.liquid` file in you shopify store:

```html
<script>
  LVT_collection = '';
  LVT_product = '';
  LVT_search = '';
  LVT_cart = '';
  LVT_article = '';

  var curPage = "{{template.name}}"
  // console.log(curPage)

  if (curPage === "collection"){
    LVT_collection = {{ collection.products | json }};
  } else if (curPage === "product"){
    LVT_product = {{ product | json }};
  } else if (curPage === "search"){
    LVT_search = {{ search.results | json }};
  } else if (curPage === "cart"){
    LVT_cart = {{ cart | json }};
  } else if (curPage === "article"){
    LVT_article = {{ article | json }};
  } else if (curPage === "index"){
  } else if (curPage === "blog"){
  } else if (curPage === "page"){
  }

  if (LVT_collection === ''){delete LVT_collection}
  if (LVT_product === ''){delete LVT_product}
  if (LVT_search === ''){delete LVT_search}
  if (LVT_cart === ''){delete LVT_cart}
  if (LVT_article === ''){delete LVT_article}
</script>
```

And after, make sure to edit the missing pieces in the following snippet code, and after include it after the above code. Its better to include the following snippet code in a `google tag manager` tag, since GTM is compatible with both shopify and yampi platforms, and whe need to track customer
actions in Yampi too.

```html
<script type="text/javascript">
  var github_username = 'lucasvtiradentes';
  var github_repository = 'shopify-store-omni-pixel';
  var file_location = 'dist/lvt_omni_pixel.min.js';
  var final_link = 'https://api.github.com/repos/' + github_username + '/' + github_repository + '/contents/' + file_location;

  fetch(final_link)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var decodedContent = atob(data.content);
      eval(decodedContent);

      runTrackerWhenReady({
        shopify_store: {
          store_name: 'storename',
          store_url: 'storename.com.br',
          checkout_url: 'seguro.storename.com.br',
          blog_url: '/blog_page_',
          tracking_url: '/tracking_page',
          contact_url: '/contact_page',
          skip_cart: true,
          ignored_collections: ['20 OFF', 'HOT SALES']
        },
        pixel_settings: {
          lvt: {
            fire_events: true,
            settings: {
              spreadsheet_id: '-',
              store_sheet_name: '-',
              api_url: '-'
            }
          },
          clarity: {
            fire_events: false,
            pixels: ['-']
          },
          tiktok: {
            fire_events: false,
            pixels: ['-']
          },
          facebook: {
            fire_events: false,
            pixels: ['-']
          },
          google_ua: {
            fire_events: false,
            pixels: ['-']
          },
          google_a4: {
            fire_events: false,
            pixels: ['-']
          },
          google_ads: {
            fire_events: false,
            pixels: [
              {
                pixel: '-',
                labels: {
                  purchase: ['-'],
                  add_payment_info: ['-'],
                  add_address_info: ['-'],
                  begin_checkout: ['-'],
                  add_to_cart: ['-'],
                  view_item: ['-'],
                  view_item_list: ['-'],
                  page_view: ['-']
                }
              }
            ]
          }
        }
      });
    });
</script>
```

## :information_source: How to publish it

If you want to publish it to an npm package, just do the following steps:

1. Make the changes you want in the source code;
2. Login into your npm account in the terminal, using `npm login`;
3. Upgrade the `version` key for a greater one in the npm package;
4. Update the `name` key in the npm package to the name of your new package;
5. Run the command `npm run pub`.

If you succeed, you now can use the package directly from npm, with the following code:

```html
<script src="https://unpkg.com/shopify-store-omni-pixel@1.0.0/lvt_omni_pixel.min.js" type="text/javascript"></script>
```

```html
<script src="https://cdn.jsdelivr.net/npm/shopify-store-omni-pixel"></script>
```

```html
<script src="https://cdn.jsdelivr.net/npm/shopify-store-omni-pixel@1.0.0"></script>
```

---

Made with ♥ by Lucas Vieira.

Get it touch: [github](https://github.com/lucasvtiradentes) | [linkedin](https://www.linkedin.com/in/lucasvtiradentes) | lucasvtiradentes@gmail.com

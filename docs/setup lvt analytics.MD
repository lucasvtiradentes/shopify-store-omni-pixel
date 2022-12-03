<h1 align="center">
  Lvt analytics setup
</h1>

<p align="center">
  <a href="#information_source-description">Description</a>
  &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;<a href="#information_source-features">Features</a> &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#information_source-technologies">Technologies</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#information_source-how-to-setup-it">How to setup it?</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#information_source-faq">FAQ</a>
</p>

## :information_source: Description

This solution was made to proper detect access comming from all ads platforms and make my own analysis, in alternative of google analytics. This tool is meant to be used with [shopify-store-omni-pixel](https://github.com/lucasvtiradentes/shopify-store-omni-pixel).

It is very useful analytics tool because, since IOS 14 came in, facebook ads conversions aren't beign really reliable, not to mention that as the data is stored in a google spreadsheet, you can manipulate the data as you wish, and create the reports you want.

<p align="center">
<img src="https://i.ibb.co/3Y2DybF/pixel-lvt.png">
</p>

The pixel collects the data as the customer advances in the store funnel, as it follows:

  <table>
    <tr>
      <th>Step</th>
      <th>Collected data</th>
    </tr>
    <tr>
      <td>first_access</td>
      <td align="center">
        date, time, token, clarity_id, ip_address, ip_location, device, state, city, country, month, day, week_day, hour, initial_page, maximum_step, initial_date, initial_time, referrer, url, path, utm_source, utm_medium, utm_campaign, utm_content, utm_term, utm_id, utm_ad, utm_placement, utm_prodid, utm_affiliation, utm_coupon,
      </td>
    </tr>
    <tr>
      <td>checkout</td>
      <td align="center">
        shopify_token,  product, price
      </td>
    </tr>
    <tr>
      <td>address</td>
      <td align="center">
        name, email, cpf, phone
      </td>
    </tr>
    <tr>
      <td>payment</td>
      <td align="center">
        cep, shipping_method
      </td>
    </tr>
    <tr>
      <td>payment</td>
      <td align="center">
        payment_method
      </td>
    </tr>
  </table>

## :information_source: Features

These are the most important features, but remember that with the data you'll be collecting you can generate new statistics, reports and so on directly on google spreadsheets. As an example, I made an chart to look from which device comes the most access.

- [x] Track user information across all shopify store funnel and saves it in a google spreadsheet table;
- [x] Can track inumerous stores into the same spreadsheet, just need to duplicate the original store sheet and rename it, and also update the snippet code in the others stores to proper send data to the corresponding sheet;
- [x] Detect the maximum step the customer have been in, so you can check how effective you store is in coversions;
- [x] Detect from what utm related tags the user have come from (utm_campaign, utm_source, utm_medium, and others), so you can check which campaigns performed better;
- [x] Detect the customer clarity id, so you can check the screen recording by searching for this id in microsoft clarity.

## :information_source: Technologies

This project uses the following technologies:

<div align="center" style="text-align: center;">
  <table>
    <tr>
      <th>Scope</th>
      <th>Technologies</th>
    </tr>
    <tr>
      <td>main</td>
      <td align="center">
        <a href="https://developers.google.com/apps-script" target="_blank">Google apps script</a>
      </td>
    </tr>
    <tr>
      <td>secondary</td>
      <td align="center">
      <a href="https://www.google.com/sheets" target="_blank">Google sheets</a>
      </td>
    </tr>
    <tr>
      <td>dev tools</td>
      <td align="center">
        <a href="https://editorconfig.org/" target="_blank">EditorConfig</a> |
        <a href="https://git-scm.com/" target="_blank">Git</a>
      </td>
    </tr>
  </table>
</div>


## :information_source: How to setup it

### Step 1 - Copy the spreadsheet
Copy <a href="https://docs.google.com/spreadsheets/d/1qq2_A22SXw-s4QSLV-NCXHtsiIGIx0b28Pxigz9mUdY/edit?usp=sharing">this spreadsheet</a> into your personal Google account.

### Step 2 - Activate the API
On the copied spreadsheet tab, click in "Extensions" and after in "Apps scripts". When the google spreadsheet source code open in a new tab, click on "Publish" and after in "New publish". On project type, select "Web app", and click on "deploy".

Make sure to save the web app link, as we'll use it latter.

### Step 3 - Rename the sheet
Rename the sheet into a more meaningful name related to your store.

### Step 4 - Get useful data
Take notes to: (a) the name of the store sheet, (b) the id of the spreadsheet, which can be found after the url `https://docs.google.com/spreadsheets/d/` and finaly (c) the web app url generated link.

### Step 5 - Update the snippet code
Update the <a href="https://github.com/lucasvtiradentes/shopify-store-omni-pixel">shopify-store-omni-pixel</a> snippet code at google tag manager to include the information you've got in the previus step, as it follows:

```js
...,
google_sheets: {
  store_sheet_name: "a",
  spreadsheet_id: "b",
  api_url: "c"
},
...
```

## :information_source: FAQ

>What do I do with the code in this repository?

Nothing. That's it. The code in this repository already is embeded in the google spreadsheet you should copy to your google account.

>How to edit the columns order in the store sheet?

To do that, you'll have to edit the order both in the google spreadsheet sheet and in the API source code variables function.

>How to pause the tacking in lvt analytics?

To do that, you'll have to edit the snippet code at [shopify-store-omni-pixel](https://github.com/lucasvtiradentes/shopify-store-omni-pixel) and turn the setting: `pixel_events.lvt` to `false`.


---

Made with ♥ by Lucas Vieira.

Get it touch: [github](https://github.com/lucasvtiradentes) | [linkedin](https://www.linkedin.com/in/lucasvtiradentes) | lucasvtiradentes@gmail.com

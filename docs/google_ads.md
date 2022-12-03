### [Tipos de remarketing do google ads](https://developers.google.com/tag-platform/devguides/remarketing)

- Com o `remarketing padrão`, você pode veicular anúncios às pessoas que já acessaram seu site ou usaram o app para dispositivos móveis. Este artigo se concentra no remarketing padrão.

- Com o `remarketing dinâmico`, você pode ir além e mostrar aos visitantes um anúncio com o produto específico que eles encontraram no seu site. Para isso, você precisa criar um feed de dados. Consulte o artigo Remarketing dinâmico para começar a usar o remarketing dinâmico.

### [Eventos do remarketing dinâmico](https://support.google.com/google-ads/answer/7305793?hl=pt-br)

- view_search_results
- view_item_list
- view_item
- add_to_cart
- purchase

### [Parâmetros de GADS ecomm](https://developers.google.com/adwords-remarketing-tag/parameters?hl=pt-br#retail)

- ecomm_prodid
- ecomm_pagetype
- ecomm_totalvalue
- ecomm_category

### [implementação de conversões otimizadas](https://support.google.com/google-ads/answer/9888145?hl=pt-br)

```js
gtag('set', 'user_data', {
  email: yourEmailVariable,
  phone_number: yourPhoneVariable,
  address: {
    first_name: yourFirstNameVariable,
    last_name: yourLastNameVariable,
    street: yourStreetAddressVariable,
    city:yourCityVariable,
    region: yourRegionVariable,
    postal_code: yourPostalCodeVariable,
    country: yourCountryVariable
  }
});
```

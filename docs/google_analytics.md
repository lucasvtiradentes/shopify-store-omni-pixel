## Melhores links


<div align="center" style="text-align: center;">
  <table>
    <tr>
      <th>Scope</th>
      <th>Links</th>
    </tr>
    <tr>
      <td>GA3</td>
      <td align="left">
        <ul>
          <li><a href="https://measuremindsgroup.com/cheat-sheet-gtm-datalayer-enhanced-ecommerce-version" target="_blank">GA3 - Datalayer enhanced ecommerce</a></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>GA4</td>
      <td align="left">
        <ul>
          <li><a href="https://www.thyngster.com/ga4-measurement-protocol-cheatsheet/#" target="_blank">GA4 - Dados salvos pelo GA4</a></li>
          <li><a href="https://developers.google.com/gtagjs/reference/ga4-events" target="_blank">Eventos GA4 com parâmetros</a></li>
          <li><a href="https://developers.google.com/analytics/devguides/collection/ga4/reference/events" target="_blank">Eventos GA4 com gtag.js</a></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>Outros</td>
      <td align="left">
        <ul>
          <li><a href="https://measuremindsgroup.com/ga4-ecommerce-reporting" target="_blank">Diferenças no ecommerce do GA3 pro GA4</a></li>
          <li><a href="https://support.google.com/analytics/answer/11091026?hl=en&ref_topic=11091421#zippy=%2Cin-this-article" target="_blank">Mandando eventos no gtag.js para GA3 e GA4</a></li>
          <li><a href="https://developers.google.com/analytics/devguides/migration/ecommerce/gtagjs-compatibility" target="_blank">Comparação de eventos GA3 e GA4</a></li>
          <li><a href="https://developers.google.com/analytics/devguides/migration/ecommerce/gtagjs-dual-ua-ga4" target="_blank">Usar gtag.js para mandar eventos de ecommerce para GA3 e GA4</a></li>
          <li><a href="https://googleanalytics.github.io/ecommerce-migration-helper/" target="_blank">Ferramenta de ecommerce para GA3 e GA4</a></li>
          <li><a href="https://support.google.com/analytics/answer/6367342?hl=en#zippy=%2Cin-this-article" target="_blank">Acessar conta demo de ecommerce cheia de dados da https://www.googlemerchandisestore.com/</a></li>
        </ul>
      </td>
    </tr>
  </table>
</div>

### [Mandar eventos GA3 com o gtag.js](https://developers.google.com/analytics/devguides/collection/gtagjs/events)

Se <category> ou <label> forem omitidos, eles serão definidos como os valores padrão de "(not set)".

```js
gtag('event', <action>, {
  'event_category': <category>,
  'event_label': <label>,
  'value': <value>
});
```

### [Eventos padrões GA3](https://developers.google.com/analytics/devguides/collection/gtagjs/events)

- ecommerce:
  - add_payment_info
  - add_to_cart
  - add_to_wishlist
  - begin_checkout
  - checkout_progress
  - purchase
  - refund
  - remove_from_cart
  - set_checkout_option

- engagement:
  - generate_lead
  - view_item
  - view_item_list
  - view_promotion
  - login	(method)
  - search (search_term)
  - view_search_results	(search_term)
  - select_content (content_type)
  - share	(method)
  - sign_up	(method)


### [Diferenças entre comércio x e comércio avançado no GA3](https://support.google.com/tagmanager/answer/6107169?hl=pt-br)

- Com os relatórios de `e-commerce padrão`, é possível medir as transações e analisar as atividades de compra no seu site ou app. Você encontra informações sobre o produto e a transação, o valor médio do pedido, a taxa de conversão de e-commerce e o tempo até a compra, além de outros dados.

- O `e-commerce avançado` traz mais funcionalidade aos relatórios de e-commerce padrão. Ele é disponibilizado quando os clientes adicionam itens ao carrinho de compras, iniciam o processo de pagamento e concluem uma compra. Você também pode usar o e-commerce avançado para identificar segmentos de clientes que ficam de fora do funil de compra.

## [Eventos do GA4](https://developers.google.com/gtagjs/reference/ga4-events)

  - login
  - search
  - select_item
  - view_item_list
  - remove_from_cart

  - view_item
  - add_to_cart
  - view_cart
  - begin_checkout
  - add_shipping_info
  - add_payment_info
  - purchase

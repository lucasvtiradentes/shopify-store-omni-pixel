window.onbeforeunload = function () {
  // modifica valor ao fechar, atualizar, alterar pagina
  console.log('Atualizando dados de ultimo acesso!');
  updateCookie(GLOBAL_COOKIES['USER_ACCESS_LAST_ACCESS'], getDateTime());
};

document.addEventListener('visibilitychange', function (e) {
  var oldTitle = GLOBAL_VARIABLES['session'].current_page.page_title;

  if (oldTitle === undefined) {
    return;
  }

  if (document.visibilityState !== 'visible') {
    document.title = 'Ei, volta!';
  } else {
    document.title = oldTitle;
  }
});

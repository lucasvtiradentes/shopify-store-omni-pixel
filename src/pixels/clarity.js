function addClarityPixelFunction() {
  if (!GLOBAL_VARIABLES['store'].pixel_settings.clarity.fire_events) {
    return;
  }
  if (!GLOBAL_VARIABLES['store'].pixel_settings.clarity.pixels) {
    return;
  }
  if (GLOBAL_VARIABLES['store'].pixel_settings.clarity.pixels.length === 0) {
    return;
  }

  var clarityPixel = GLOBAL_VARIABLES['store'].pixel_settings.clarity.pixels[0];

  var clarityContent = `
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "${clarityPixel}");
  `;
  var clarityScript = document.createElement('script');
  clarityScript.setAttribute('type', 'text/javascript');
  clarityScript.innerHTML = clarityContent;
  document.head.appendChild(clarityScript);
}

export function setupKeyboardHandling() {
  const inputs = document.querySelectorAll('input, textarea');
  const keyboardDismissBtn = document.getElementById('keyboardDismiss');
  
  let isKeyboardDismissBtnPressed = false;
  let activeInputCount = 0; // Contatore degli input attivi

  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      if (window.innerWidth <= 768) {
        keyboardDismissBtn.classList.add('show');
        activeInputCount++; // Incrementa il contatore quando un input riceve focus
      }
    });

    // input.addEventListener('blur', () => {
    //   activeInputCount--; // Decrementa il contatore quando un input perde focus
    //   // Usa un timeout per dare tempo alla tastiera di chiudersi
    //   setTimeout(() => {
    //     if (activeInputCount === 0) {
    //       keyboardDismissBtn.classList.remove('show');
    //     }
    //   }, 1000); 
    // });

    input.addEventListener('touchstart', () => {
      if (window.innerWidth <= 768) {
        input.focus();
      }
    });
  });

  keyboardDismissBtn.addEventListener('click', () => {
    document.activeElement.blur();
    keyboardDismissBtn.classList.remove('show');
    isKeyboardDismissBtnPressed = true; // Imposta il flag quando il pulsante viene premuto
  });

  document.addEventListener('touchend', (e) => {
    const activeElement = document.activeElement;
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
      if (!activeElement.contains(e.target) && !isKeyboardDismissBtnPressed) {
        activeElement.blur();
      }
    }
    isKeyboardDismissBtnPressed = false; // Resetta il flag dopo l'evento touchend
  });
}
export function setupKeyboardHandling() {
  const inputs = document.querySelectorAll('input, textarea');
  const keyboardDismissBtn = document.getElementById('keyboardDismiss');

  let isKeyboardDismissBtnPressed = false;

  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      if (window.innerWidth <= 768) {
        keyboardDismissBtn.style.bottom = '300px'; 
        keyboardDismissBtn.classList.add('show');
      }
    });

    input.addEventListener('blur', () => {
      //keyboardDismissBtn.classList.remove('show');
      keyboardDismissBtn.style.bottom = '90px'; // Ripristina la posizione a 90px quando l'input perde il focus
    });

    input.addEventListener('touchstart', () => {
      if (window.innerWidth <= 768) {
        input.focus();
      }
    });
  });

  keyboardDismissBtn.addEventListener('click', () => {
    document.activeElement.blur();
    //keyboardDismissBtn.classList.remove('show');
    isKeyboardDismissBtnPressed = true;
    keyboardDismissBtn.style.bottom = '90px'; // Assicurati che il pulsante sia a 90px dopo il clic
  });

  document.addEventListener('touchend', (e) => {
    const activeElement = document.activeElement;
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
      if (!activeElement.contains(e.target) && !isKeyboardDismissBtnPressed) {
        activeElement.blur();
      }
    }
    isKeyboardDismissBtnPressed = false;
  });

  window.addEventListener('resize', () => {
    if (window.innerHeight < 600) { // Condizione per rilevare l'apertura della tastiera
      keyboardDismissBtn.style.bottom = '300px'; // Alza il bottone
    } else {
      keyboardDismissBtn.style.bottom = '90px'; // Ripristina la posizione originale
    }
  });
}
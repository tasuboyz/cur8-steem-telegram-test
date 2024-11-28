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
      keyboardDismissBtn.classList.remove('show');
    });

    input.addEventListener('touchstart', () => {
      if (window.innerWidth <= 768) {
        input.focus();
      }
    });
  });

  keyboardDismissBtn.addEventListener('click', () => {
    document.activeElement.blur();
    keyboardDismissBtn.classList.remove('show');
    isKeyboardDismissBtnPressed = true;
  });

  document.addEventListener('touchend', (e) => {
    const activeElement = document.activeElement;
    keyboardDismissBtn.style.bottom = '90px';
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
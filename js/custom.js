/* Contact: submit through Formspree without leaving the page. */
(function() {
  'use strict';

  function initContactForm() {
    var form = document.getElementById('contact-form');

    if (!form) {
      return;
    }

    var submitBtn = document.getElementById('contact-submit');
    var feedback = form.querySelector('.contact-feedback');
    var originalButtonText = submitBtn ? submitBtn.value : 'Send Message';

    form.addEventListener('submit', function(event) {
      event.preventDefault();

      if (!submitBtn || !feedback || submitBtn.disabled) {
        return;
      }

      submitBtn.classList.remove('success', 'error');
      submitBtn.classList.add('wait');
      submitBtn.value = 'Sending...';
      submitBtn.style.removeProperty('background-color');
      submitBtn.style.removeProperty('color');
      submitBtn.disabled = true;

      feedback.classList.remove('success', 'error');
      feedback.textContent = '';
      feedback.style.display = 'none';

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: {
          'Accept': 'application/json'
        }
      })
        .then(function(response) {
          if (response.ok) {
            return response.json().catch(function() {
              return {};
            });
          }

          return response.json()
            .catch(function() {
              return {};
            })
            .then(function(data) {
              var message = 'Unable to send your message. Please try again.';

              if (data && Array.isArray(data.errors) && data.errors.length) {
                message = data.errors
                  .map(function(item) {
                    return item.message;
                  })
                  .filter(Boolean)
                  .join(' ');
              }

              throw new Error(message);
            });
        })
        .then(function() {
          submitBtn.classList.remove('wait', 'error');
          submitBtn.classList.add('success');
          submitBtn.value = 'Success';
          submitBtn.style.setProperty('background-color', '#72c68c', 'important');
          submitBtn.style.setProperty('color', '#ffffff', 'important');

          feedback.classList.remove('error');
          feedback.classList.add('success');
          feedback.style.color = '#58d482';
          feedback.textContent = 'Thank you for your message. It has been sent.';
          feedback.style.display = 'block';

          form.reset();
        })
        .catch(function(error) {
          console.error('Contact form submission failed:', error);

          submitBtn.classList.remove('wait', 'success');
          submitBtn.classList.add('error');
          submitBtn.value = 'Error';

          feedback.classList.remove('success');
          feedback.classList.add('error');
          feedback.style.color = '#ff8e8e';
          feedback.textContent = error.message || 'Unable to send your message. Please try again.';
          feedback.style.display = 'block';
        })
        .finally(function() {
          window.setTimeout(function() {
            submitBtn.classList.remove('wait', 'success', 'error');
            submitBtn.value = originalButtonText;
            submitBtn.disabled = false;
            submitBtn.style.removeProperty('background-color');
            submitBtn.style.removeProperty('color');

            feedback.style.display = 'none';
            feedback.classList.remove('success', 'error');
            feedback.textContent = '';
          }, 6000);
        });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactForm);
  } else {
    initContactForm();
  }
}());

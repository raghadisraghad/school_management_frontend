import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { h } from 'vue';

/**
 * Custom prompt dialog using toast
 * @param {string} message - The prompt message to display
 * @param {string} [defaultValue] - Default value for the input field
 * @returns {Promise<string | null>} - Resolves with the user's input or null if canceled
 */
export const prompt = (message: string, defaultValue: string = ''): Promise<string | null> => {
  return new Promise((resolve) => {
    let inputValue = defaultValue;

    const toastId = toast(
      () =>
        h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' } }, [
          h('p', { style: { marginBottom: '10px' } }, message),
          h('input', {
            type: 'text',
            value: inputValue,
            onInput: (e: Event) => {
              inputValue = (e.target as HTMLInputElement).value; // Update input value
            },
            style: {
              padding: '8px',
              width: '100%',
              borderRadius: '4px',
              border: '1px solid #ccc',
            },
          }),
          h('div', { style: { display: 'flex', gap: '10px' } }, [
            h(
              'button',
              {
                onClick: () => {
                  resolve(inputValue); // Resolve with the input value
                  toast.remove(toastId); // Dismiss the toast
                },
                style: {
                  padding: '8px 16px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                },
              },
              'Submit'
            ),
            h(
              'button',
              {
                onClick: () => {
                  resolve(null); // Resolve with null (cancel)
                  toast.remove(toastId); // Dismiss the toast
                },
                style: {
                  padding: '8px 16px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                },
              },
              'Cancel'
            ),
          ]),
        ]),
      {
        toastId: 'custom-prompt', // Add a unique toastId
        position: 'top-center',
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        draggable: false,
        theme: 'light',
      }
    );
  });
};

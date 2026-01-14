import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { h } from 'vue';

export const confirm = (message, onConfirm, onCancel = () => {}) => {
  const toastId = toast(
    () =>
      h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center' } }, [
        h('p', { style: { marginBottom: '10px' } }, message),
        h('div', { style: { display: 'flex', gap: '10px' } }, [
          h(
            'button',
            {
              onClick: () => {
                onConfirm();
                toast.remove(toastId);
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
            'Oui'
          ),
          h(
            'button',
            {
              onClick: () => {
                onCancel();
                toast.remove(toastId);
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
            'Annuler'
          ),
        ]),
      ]),
    {
      toastId: 'custom-toast',
      position: 'top-center',
      autoClose: false,
      closeOnClick: false,
      closeButton: false,
      draggable: false,
      theme: 'light',
    }
  );
};

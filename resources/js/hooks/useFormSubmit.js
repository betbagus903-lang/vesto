import { useForm } from '@inertiajs/react';

export function useFormSubmit(options = {}) {
  const {
    onSuccessMessage = 'Operation completed successfully.',
    onErrorMessage = 'An error occurred.',
    redirectTo = null,
    showToast = true,
  } = options;

  const form = useForm();

  const submit = (method, url, data, formOptions = {}) => {
    const mergedOptions = {
      ...formOptions,
      onSuccess: (page) => {
        if (showToast) {
          window.dispatchEvent(new CustomEvent('show-toast', {
            detail: { 
              message: formOptions.onSuccessMessage || onSuccessMessage, 
              type: 'success' 
            }
          }));
        }
        
        if (formOptions.onSuccess) {
          formOptions.onSuccess(page);
        }
      },
      onError: (errors) => {
        if (showToast && errors && Object.keys(errors).length > 0) {
          window.dispatchEvent(new CustomEvent('show-toast', {
            detail: { 
              message: formOptions.onErrorMessage || onErrorMessage, 
              type: 'error' 
            }
          }));
        }
        
        if (formOptions.onError) {
          formOptions.onError(errors);
        }
      },
    };

    if (redirectTo) {
      mergedOptions.onSuccess = () => {
        if (showToast) {
          window.dispatchEvent(new CustomEvent('show-toast', {
            detail: { 
              message: formOptions.onSuccessMessage || onSuccessMessage, 
              type: 'success' 
            }
          }));
        }
        window.location.href = redirectTo;
      };
    }

    switch (method.toLowerCase()) {
      case 'post':
        return form.post(url, data, mergedOptions);
      case 'put':
        return form.put(url, data, mergedOptions);
      case 'patch':
        return form.patch(url, data, mergedOptions);
      case 'delete':
        return form.delete(url, mergedOptions);
      default:
        return form.post(url, data, mergedOptions);
    }
  };

  return {
    ...form,
    submit,
    post: (url, data, options = {}) => submit('post', url, data, options),
    put: (url, data, options = {}) => submit('put', url, data, options),
    patch: (url, data, options = {}) => submit('patch', url, data, options),
    delete: (url, options = {}) => submit('delete', url, null, options),
  };
}
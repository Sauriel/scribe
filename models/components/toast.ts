declare type ToastType = 'default' | 'alert' | 'warning' | 'success';

declare type ToastMessage = {
  type: ToastType;
  message: string;
};

declare type Toast = ToastMessage & {
  timestamp: number;
}

export default Toast;

export {
  ToastMessage,
  ToastType
};
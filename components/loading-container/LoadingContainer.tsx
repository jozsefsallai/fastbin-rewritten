import { Text, Spinner } from '@geist-ui/react';
import css from './LoadingContainer.module.scss';

const LoadingContainer = ({ text }: { text?: string }) => {
  return (
    <div className={css.wrapper}>
      <div className={css.spinner}>
        <Spinner size="large" />
        {text && <Text type="secondary">{text}</Text>}
      </div>
    </div>
  );
};

export default LoadingContainer;

import AppTemplate from '@/components/AppTemplate';
import env from '@/lib/env';
import { Modal, useToasts } from '@geist-ui/react';

import { useRouter } from 'next/router';
import { useState } from 'react';

interface DeletePageProps {
  secret: string;
  snippetKey: string;
}

const DeletePage = ({ secret, snippetKey }: DeletePageProps) => {
  const [ toasts, setToast ] = useToasts();
  const router = useRouter();

  const [ deleting, setDeleting ] = useState(false);

  const handleCancelClick = () => router.push(`/${snippetKey}`);

  const handleDeleteClick = async () => {
    setDeleting(true);

    try {
      const res = await fetch(`/api/delete/${secret}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin'
      });

      const json = await res.json();

      if (!json.ok) {
        const error = json.error || 'Internal Server Error';
        throw error;
      }

      setToast({
        text: `Snippet "${snippetKey}" deleted successfully!`,
        type: 'success'
      });

      setDeleting(false);
      router.push('/');
    } catch (err) {
      setDeleting(false);

      setToast({
        text: `${err}`,
        type: 'error'
      });
    }
  };

  return (
    <AppTemplate navigation={[]}>
      <Modal open={true} disableBackdropClick={true}>
        <Modal.Title>Delete Snippet?</Modal.Title>

        <Modal.Content>
          Are you sure you want to delete the snippet <a href={`/${snippetKey}`} target="_blank">{snippetKey}</a>?
          This action is irreversible.
        </Modal.Content>

        <Modal.Action
          passive
          disabled={deleting}
          onClick={handleCancelClick}
        >No, keep it!</Modal.Action>

        <Modal.Action
          disabled={deleting}
          onClick={handleDeleteClick}
        >Yes, delete it.</Modal.Action>
      </Modal>
    </AppTemplate>
  );
};

export default DeletePage;

export async function getServerSideProps({ params }) {
  const secret = params.secret;
  const baseUrl = env('site-url', true);

  const data = await fetch(`${baseUrl}/api/delete/${secret}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin'
  });

  const json = await data.json();

  if (!json.ok) {
    return {
      notFound: true
    };
  }

  const snippetKey = json.key;

  return {
    props: {
      snippetKey,
      secret
    }
  };
};

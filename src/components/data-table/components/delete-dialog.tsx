'use client';

import { Loader, Trash } from 'lucide-react';
import * as React from 'react';

import { toast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface DeleteDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  showTrigger?: boolean;
  onSuccess?: () => void;
  onActionDelete?: () => Promise<unknown>;
}

export default function DeleteDialog({
  showTrigger = true,
  onSuccess,
  onActionDelete,
  ...props
}: DeleteDialogProps) {
  const [isDeletePending, startDeleteTransition] = React.useTransition();

  async function onDelete() {
    startDeleteTransition(() => {
      void (async () => {
        try {
          props.onOpenChange?.(false);
          await onActionDelete?.();
          toast({
            title: 'Item deleted',
            description: 'Item has been deleted',
          });
          onSuccess?.();
        } catch (error) {
          toast({
            title: 'Delete item failed',
            description: 'Something went wrong',
            variant: 'destructive',
          });
        }
      })();
    });
  }

  return (
    <Dialog {...props}>
      {showTrigger ? (
        <DialogTrigger asChild>
          <Button variant='outline' size='sm'>
            <Trash className='mr-2 size-4' aria-hidden='true' />
            Delete
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete this item
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='gap-2 sm:space-x-0'>
          <DialogClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DialogClose>
          <Button
            aria-label='Delete selected rows'
            variant='destructive'
            onClick={onDelete}
            disabled={isDeletePending}
          >
            {isDeletePending && (
              <Loader className='mr-2 size-4 animate-spin' aria-hidden='true' />
            )}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
